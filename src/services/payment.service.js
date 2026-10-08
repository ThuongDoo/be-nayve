import { randomBytes, timingSafeEqual } from 'node:crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { SePayPgClient } from 'sepay-pg-node';
import { db } from '../config/firebase.js';
import { config } from '../config/index.js';
import { siteRef } from './deploy.service.js';
import { EXTEND_MONTHS, extendSite } from './siteExpiry.service.js';
import { httpError } from '../utils/httpError.js';

/**
 * Users renewing their own site through the SePay payment gateway, instead of paying an admin who then
 * extends it by hand. An order is `renewOrders/{invoice}` ({ uid, months, amount, status, … });
 * SePay calls handleSepayIpn when it is paid, which extends the site like an admin would. In case the
 * IPN is late or can't reach us, getRenewOrder (the user's page waiting after paying) also asks SePay.
 *
 * status: 'pending' (created, not paid) → 'applying' (paid, extending the site) → 'paid'. 'failed': paid
 * but the site could not be extended yet (e.g. it was busy); it is tried again on the next IPN retry
 * or when the user checks the order.
 */

const orderRef = (id) => db.doc(`renewOrders/${id}`);

/** A paid order stuck in 'applying' this long is taken over again (the server died half way). */
const STALE_APPLYING_MS = 5 * 60_000;

const enabled = () => !!(config.sepay.merchantId && config.sepay.secretKey && config.appUrl);

let client;
const sepay = () => (client ??= new SePayPgClient({ env: config.sepay.env, merchant_id: config.sepay.merchantId, secret_key: config.sepay.secretKey }));

/** `{ enabled, plans: [{ months, amount }] }`: what users can buy (only the lengths an admin can extend by). */
export function renewPlans() {
  const plans = EXTEND_MONTHS.filter((m) => config.renewPrices[m]).map((months) => ({ months, amount: config.renewPrices[months] }));
  return { enabled: enabled() && plans.length > 0, plans };
}

/** A unique, unguessable invoice number SePay accepts: letters and digits only. */
const newInvoice = () => `NV${Date.now().toString(36)}${randomBytes(4).toString('hex')}`.toUpperCase();

/**
 * Creates an order to renew the user's site by `months` and returns what the browser posts to SePay:
 * `{ orderId, checkoutUrl, fields }`.
 */
export async function createRenewOrder(uid, months) {
  if (!enabled()) throw httpError(503, 'Chưa bật thanh toán trực tuyến. Hãy liên hệ quản trị viên để gia hạn.');
  const amount = config.renewPrices[months];
  if (!EXTEND_MONTHS.includes(months) || !amount) throw httpError(400, 'Gói gia hạn không hợp lệ');
  const site = (await siteRef(uid).get()).data();
  if (!site) throw httpError(404, 'Bạn chưa có trang web nào được xuất bản để gia hạn');

  const id = newInvoice();
  const description = `Gia han ${site.domain} ${months} thang`;
  await orderRef(id).set({ uid, months, amount, domain: site.domain, status: 'pending', createdAt: FieldValue.serverTimestamp() });

  const back = (result) => `${config.appUrl}/#/?renew=${id}&result=${result}`;
  // In the field order of SePay's signature (developer.sepay.vn → Cổng thanh toán → Tạo form thanh toán):
  // the SDK signs the fields in the order they are given.
  const fields = sepay().checkout.initOneTimePaymentFields({
    order_amount: amount,
    merchant: config.sepay.merchantId,
    currency: 'VND',
    operation: 'PURCHASE',
    order_description: description,
    order_invoice_number: id,
    customer_id: uid,
    payment_method: 'BANK_TRANSFER',
    success_url: back('success'),
    error_url: back('error'),
    cancel_url: back('cancel'),
  });
  return { orderId: id, checkoutUrl: sepay().checkout.initCheckoutUrl(), fields };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Extends the site of paid order `id`, once. Several callers (IPN retries, the user checking) may race:
 * only the one that moves the order to 'applying' does the work. The site may be busy with another
 * change (409): retried a few times, then left 'failed' for the next attempt.
 */
async function applyPaidOrder(id) {
  const ref = orderRef(id);
  const claimed = await db.runTransaction(async (t) => {
    const o = (await t.get(ref)).data();
    if (!o) return false;
    const stale = o.status === 'applying' && Date.now() - (o.applyingAt?.toMillis() ?? 0) > STALE_APPLYING_MS;
    if (o.status !== 'pending' && o.status !== 'failed' && !stale) return false;
    t.update(ref, { status: 'applying', applyingAt: FieldValue.serverTimestamp() });
    return true;
  });
  if (!claimed) return;

  const { uid, months } = (await ref.get()).data();
  for (let attempt = 1; ; attempt++) {
    try {
      const site = await extendSite(uid, months, `sepay:${id}`);
      await ref.update({ status: 'paid', appliedAt: FieldValue.serverTimestamp(), expiresAt: Timestamp.fromDate(new Date(site.expiresAt)), error: null });
      return;
    } catch (e) {
      if (e.status === 409 && attempt < 5) {
        await sleep(3000);
        continue;
      }
      console.error(`Could not extend site for paid order ${id}:`, e.message);
      await ref.update({ status: 'failed', error: e.message });
      throw e;
    }
  }
}

const sameSecret = (given, expected) => {
  const a = Buffer.from(String(given ?? ''));
  const b = Buffer.from(String(expected ?? ''));
  return a.length === b.length && timingSafeEqual(a, b);
};

/**
 * SePay's IPN (developer.sepay.vn → Cổng thanh toán → IPN). Checks the secret key and that the order
 * was paid in full, records the payment and extends the site. Throws 401 for a forged call; a payment
 * that can't be applied throws too, so SePay tries again.
 */
export async function handleSepayIpn(secret, body) {
  if (!config.sepay.ipnSecret || !sameSecret(secret, config.sepay.ipnSecret)) throw httpError(401, 'Invalid secret key');
  if (body?.notification_type !== 'ORDER_PAID') return;

  const id = String(body.order?.order_invoice_number ?? '');
  const ref = /^NV[A-Z0-9]+$/.test(id) && orderRef(id);
  const order = ref && (await ref.get()).data();
  if (!order) {
    console.warn(`SePay IPN for unknown order ${id}`);
    return;
  }
  await recordPayment(id, order, body.order, body.transaction?.transaction_id, 'ipn');
}

/**
 * Takes SePay's word on order `id` (`sepayOrder`: the `order` of an IPN, or the order detail from the
 * API) and, if it was paid in full, extends the site. Paid but not in full (wrong amount or currency):
 * kept as 'mismatch' for an admin to sort out rather than extending the site. Not paid yet: nothing.
 */
async function recordPayment(id, order, sepayOrder, transactionId, via) {
  if (sepayOrder?.order_status !== 'CAPTURED') return;
  if (order.status === 'pending') {
    const paid = Math.round(Number(sepayOrder.order_amount));
    const payment = {
      sepayOrderId: sepayOrder.order_id ?? null,
      transactionId: transactionId ?? null,
      paidAmount: paid,
      paidAt: FieldValue.serverTimestamp(),
      paidVia: via,
    };
    if (sepayOrder.order_currency !== 'VND' || paid !== order.amount) {
      console.error(`SePay payment for ${id} does not match the order:`, sepayOrder.order_currency, paid, order.amount);
      await orderRef(id).update({ ...payment, status: 'mismatch' });
      return;
    }
    await orderRef(id).update(payment);
  } else if (order.status === 'mismatch') {
    return;
  }
  await applyPaidOrder(id);
}

/** Don't ask SePay about the same order more often than this (the user's page checks every few seconds). */
const LOOKUP_EVERY_MS = 8000;
const lastLookup = new Map();

/**
 * Asks SePay whether pending order `id` has been paid, in case its IPN hasn't arrived (it is late, or
 * can't reach this server, e.g. while developing on localhost), and records the payment if so.
 */
async function lookUpPayment(id, order) {
  const now = Date.now();
  if (now - (lastLookup.get(id) ?? 0) < LOOKUP_EVERY_MS) return;
  lastLookup.set(id, now);
  for (const [key, at] of lastLookup) if (now - at > 10 * 60_000) lastLookup.delete(key);

  let detail;
  try {
    // The SDK looks orders up by our invoice number.
    detail = (await sepay().order.retrieve(id)).data?.data;
  } catch (e) {
    // Not found until the user has opened SePay's checkout page; anything else is logged.
    if (e.response?.status !== 404) console.error(`Could not look up SePay order ${id}:`, e.response?.status ?? '', e.message);
    return;
  }
  const paidTx = detail?.transactions?.find((t) => t.transaction_status === 'APPROVED');
  await recordPayment(id, order, detail, paidTx?.id, 'lookup');
}

/**
 * `{ id, status, months, amount, expiresAt }` for one of the user's orders. A pending order is checked
 * with SePay, and a paid order whose site could not be extended yet is tried again.
 */
export async function getRenewOrder(uid, id) {
  const ref = orderRef(id);
  let order = (await ref.get()).data();
  if (!order || order.uid !== uid) throw httpError(404, 'Không tìm thấy đơn gia hạn');
  if (order.status === 'pending' || order.status === 'failed') {
    await (order.status === 'pending' ? lookUpPayment(id, order) : applyPaidOrder(id)).catch((e) =>
      console.error(`Could not settle renew order ${id}:`, e.message),
    );
    order = (await ref.get()).data();
  }
  return {
    id,
    status: order.status,
    months: order.months,
    amount: order.amount,
    expiresAt: order.expiresAt?.toDate().toISOString() ?? null,
  };
}
