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
 * or when the user checks the order. 'cancelled': replaced by a newer order before it was paid (also
 * cancelled on SePay so its QR can't be paid); if money still comes in for it, the site is extended.
 * 'mismatch': paid, but not the amount asked for; left for an admin, who accepts it (extends the site)
 * or closes it as 'dismissed' (e.g. refunded).
 *
 * Against paying twice by mistake, a new order first settles the user's pending ones: one that turns
 * out paid stops it (ALREADY_PAID), the rest are cancelled. Right after a renewal, another one needs
 * the user to confirm (RECENTLY_PAID).
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

/** A renewal this recent makes another one ask the user first (RECENTLY_PAID). */
const RECENT_PAYMENT_MS = 15 * 60_000;

const formatDate = (d) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
const errorWithCode = (status, code, message) => Object.assign(httpError(status, message), { code });

/**
 * Before a new order: the user's pending orders are checked with SePay. One that was paid after all is
 * recorded and stops the new order (ALREADY_PAID); the others are cancelled, here and on SePay, so an
 * old checkout page left open can't be paid as well. Then, unless `force`, a renewal paid in the last
 * minutes stops it too (RECENTLY_PAID), for the user to confirm they want another one.
 */
async function settleEarlierOrders(uid, force) {
  const snap = await db.collection('renewOrders').where('uid', '==', uid).get();
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  for (const o of orders.filter((x) => x.status === 'pending')) {
    await lookUpPayment(o.id, o, { force: true }).catch((e) => console.error(`Could not settle renew order ${o.id}:`, e.message));
    const now = (await orderRef(o.id).get()).data();
    if (now.status !== 'pending') {
      const until = now.expiresAt ? `, đến ${formatDate(now.expiresAt.toDate())}` : '';
      throw errorWithCode(409, 'ALREADY_PAID', `Đơn gia hạn ${o.months} tháng bạn tạo trước đó đã được thanh toán, trang đã được gia hạn${until}. Bạn không cần thanh toán lại.`);
    }
    try {
      await sepay().order.cancel(o.id);
    } catch (e) {
      // 404: the user never opened SePay's checkout for it, so there is nothing there to pay.
      if (e.response?.status !== 404) {
        console.error(`Could not cancel SePay order ${o.id}:`, e.response?.status ?? '', e.message);
        continue; // Left pending: if it does get paid, it still extends the site.
      }
    }
    await orderRef(o.id).update({ status: 'cancelled', cancelledAt: FieldValue.serverTimestamp() });
  }

  if (force) return;
  const recent = orders
    .filter((o) => ['paid', 'applying', 'failed'].includes(o.status) && o.paidAt && Date.now() - o.paidAt.toMillis() < RECENT_PAYMENT_MS)
    .sort((a, b) => b.paidAt.toMillis() - a.paidAt.toMillis())[0];
  if (recent) {
    const at = recent.paidAt.toDate().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
    throw errorWithCode(409, 'RECENTLY_PAID', `Bạn vừa thanh toán gia hạn ${recent.months} tháng lúc ${at}. Thanh toán thêm sẽ cộng dồn thời gian.`);
  }
}

/**
 * Creates an order to renew the user's site by `months` and returns what the browser posts to SePay:
 * `{ orderId, checkoutUrl, fields }`. `force`: the user confirmed paying again right after a renewal.
 */
export async function createRenewOrder(uid, months, { force = false } = {}) {
  if (!enabled()) throw httpError(503, 'Chưa bật thanh toán trực tuyến. Hãy liên hệ quản trị viên để gia hạn.');
  const amount = config.renewPrices[months];
  if (!EXTEND_MONTHS.includes(months) || !amount) throw httpError(400, 'Gói gia hạn không hợp lệ');
  const site = (await siteRef(uid).get()).data();
  if (!site) throw httpError(404, 'Bạn chưa có trang web nào được xuất bản để gia hạn');
  await settleEarlierOrders(uid, force);

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
async function applyPaidOrder(id, { also = [] } = {}) {
  const ref = orderRef(id);
  const claimed = await db.runTransaction(async (t) => {
    const o = (await t.get(ref)).data();
    if (!o) return false;
    const stale = o.status === 'applying' && Date.now() - (o.applyingAt?.toMillis() ?? 0) > STALE_APPLYING_MS;
    // 'cancelled' too: only reached once SePay says it was paid (recordPayment), so the money is in.
    // `also`: statuses an admin may push through by hand (a 'mismatch' payment they accept).
    if (![...['pending', 'failed', 'cancelled'], ...also].includes(o.status) && !stale) return false;
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
  // A cancelled order paid anyway (its QR was paid before the cancel reached SePay) still counts.
  if (order.status === 'pending' || order.status === 'cancelled') {
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
async function lookUpPayment(id, order, { force = false } = {}) {
  const now = Date.now();
  if (!force && now - (lastLookup.get(id) ?? 0) < LOOKUP_EVERY_MS) return;
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
 * `{ id, status, months, amount, expiresAt }` for one of the user's orders. A pending (or cancelled) order is checked
 * with SePay, and a paid order whose site could not be extended yet is tried again.
 */
export async function getRenewOrder(uid, id) {
  const ref = orderRef(id);
  let order = (await ref.get()).data();
  if (!order || order.uid !== uid) throw httpError(404, 'Không tìm thấy đơn gia hạn');
  // 'cancelled' too: the user may have paid an old checkout page before it was cancelled.
  if (['pending', 'cancelled', 'failed'].includes(order.status)) {
    await (order.status !== 'failed' ? lookUpPayment(id, order) : applyPaidOrder(id)).catch((e) =>
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

// ---------------------------------------------------------------- admin

const iso = (t) => t?.toDate?.().toISOString() ?? null;

const serializeOrder = (id, o) => ({
  id,
  uid: o.uid,
  months: o.months,
  amount: o.amount,
  domain: o.domain ?? null,
  status: o.status,
  error: o.error ?? null,
  paidAmount: o.paidAmount ?? null,
  paidVia: o.paidVia ?? null,
  transactionId: o.transactionId ?? null,
  sepayOrderId: o.sepayOrderId ?? null,
  note: o.note ?? null,
  createdAt: iso(o.createdAt),
  paidAt: iso(o.paidAt),
  appliedAt: iso(o.appliedAt),
  cancelledAt: iso(o.cancelledAt),
  resolvedAt: iso(o.resolvedAt),
  expiresAt: iso(o.expiresAt),
});

/** The latest renew orders (newest first) with their owner (`user: { name, email, picture }`). */
export async function listRenewOrders({ limit = 1000 } = {}) {
  const snap = await db.collection('renewOrders').orderBy('createdAt', 'desc').limit(limit).get();
  const uids = [...new Set(snap.docs.map((d) => d.get('uid')).filter(Boolean))];
  const owners = uids.length ? await db.getAll(...uids.map((u) => db.doc(`users/${u}`)), { fieldMask: ['displayName', 'email', 'photoURL'] }) : [];
  const byUid = Object.fromEntries(owners.map((u) => [u.id, u.data() ?? {}]));
  return snap.docs.map((d) => {
    const u = byUid[d.get('uid')] ?? {};
    return { ...serializeOrder(d.id, d.data()), user: { name: u.displayName ?? null, email: u.email ?? null, picture: u.photoURL ?? null } };
  });
}

/**
 * Admin: settles order `id` now. Pending / cancelled: asks SePay whether it was paid. Failed (paid, site
 * not extended): extends it again. Resolves to the order as it is afterwards.
 */
export async function recheckRenewOrder(id) {
  const ref = orderRef(id);
  const order = (await ref.get()).data();
  if (!order) throw httpError(404, 'Không tìm thấy đơn');
  if (order.status === 'pending' || order.status === 'cancelled') await lookUpPayment(id, order, { force: true });
  else if (order.status === 'failed' || order.status === 'applying') await applyPaidOrder(id);
  else throw httpError(409, 'Đơn này không cần kiểm tra lại');
  return serializeOrder(id, (await ref.get()).data());
}

/**
 * Admin, for a 'mismatch' order (paid, but not the amount asked): `extend` accepts the payment and
 * extends the site as ordered; `dismiss` closes it (e.g. refunded) without extending. `note` is kept.
 */
export async function resolveRenewOrder(id, action, note, by) {
  const ref = orderRef(id);
  const order = (await ref.get()).data();
  if (!order) throw httpError(404, 'Không tìm thấy đơn');
  if (order.status !== 'mismatch') throw httpError(409, 'Chỉ xử lý tay được đơn sai số tiền');
  const resolved = { note: String(note ?? '').slice(0, 500) || null, resolvedBy: by, resolvedAt: FieldValue.serverTimestamp() };
  if (action === 'extend') {
    await ref.update(resolved);
    await applyPaidOrder(id, { also: ['mismatch'] });
  } else if (action === 'dismiss') {
    await ref.update({ ...resolved, status: 'dismissed' });
  } else {
    throw httpError(400, 'Thao tác không hợp lệ');
  }
  return serializeOrder(id, (await ref.get()).data());
}

/** Admin: whether online payment works and how it is set up (no secrets). */
export function paymentSettings() {
  const { merchantId, env, secretKey, ipnSecret } = config.sepay;
  return {
    ...renewPlans(),
    env,
    merchantId: merchantId ? `${merchantId.slice(0, 4)}…${merchantId.slice(-2)}` : null,
    hasSecretKey: !!secretKey,
    separateIpnSecret: !!ipnSecret && ipnSecret !== secretKey,
    appUrl: config.appUrl,
    ipnUrl: config.publicApiUrl ? `${config.publicApiUrl}/payments/sepay/ipn` : null,
  };
}
