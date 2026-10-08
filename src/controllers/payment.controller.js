import { createRenewOrder, getRenewOrder, handleSepayIpn, renewPlans } from '../services/payment.service.js';

// Users renewing their own site through SePay (payment.service.js).

/** `{ enabled, plans: [{ months, amount }] }`. */
export const getRenewPlans = (req, res) => {
  res.json(renewPlans());
};

/** Body `{ months }`: `{ orderId, checkoutUrl, fields }`, which the browser posts to SePay as a form. */
export const createMyRenewOrder = async (req, res) => {
  res.json(await createRenewOrder(req.user.uid, Number(req.body?.months)));
};

export const getMyRenewOrder = async (req, res) => {
  res.json(await getRenewOrder(req.user.uid, req.params.id));
};

/** SePay's IPN; SePay only needs a 200 back. */
export const sepayIpn = async (req, res) => {
  await handleSepayIpn(req.get('x-secret-key'), req.body);
  res.json({ success: true });
};
