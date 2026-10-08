import {
  createRenewOrder,
  getRenewOrder,
  handleSepayIpn,
  listRenewOrders,
  paymentSettings,
  recheckRenewOrder,
  renewPlans,
  resolveRenewOrder,
} from '../services/payment.service.js';

// Users renewing their own site through SePay (payment.service.js).

/** `{ enabled, plans: [{ months, amount }] }`. */
export const getRenewPlans = (req, res) => {
  res.json(renewPlans());
};

/**
 * Body `{ months, force? }`: `{ orderId, checkoutUrl, fields }`, which the browser posts to SePay as a
 * form. 409 with `code` ALREADY_PAID / RECENTLY_PAID against paying twice (`force` skips the latter).
 */
export const createMyRenewOrder = async (req, res) => {
  res.json(await createRenewOrder(req.user.uid, Number(req.body?.months), { force: req.body?.force === true }));
};

export const getMyRenewOrder = async (req, res) => {
  res.json(await getRenewOrder(req.user.uid, req.params.id));
};

/** SePay's IPN; SePay only needs a 200 back. */
export const sepayIpn = async (req, res) => {
  await handleSepayIpn(req.get('x-secret-key'), req.body);
  res.json({ success: true });
};

// ---------------------------------------------------------------- admin

/** `{ orders, settings }`: the latest renew orders with their owners, and how payment is set up. */
export const listAdminRenewOrders = async (req, res) => {
  res.json({ orders: await listRenewOrders(), settings: paymentSettings() });
};

/** Asks SePay about a pending order again, or retries extending the site of a paid one. */
export const recheckAdminRenewOrder = async (req, res) => {
  res.json(await recheckRenewOrder(req.params.id));
};

/** Body `{ action: 'extend' | 'dismiss', note? }` for an order paid with the wrong amount. */
export const resolveAdminRenewOrder = async (req, res) => {
  res.json(await resolveRenewOrder(req.params.id, req.body?.action, req.body?.note, req.user.uid));
};
