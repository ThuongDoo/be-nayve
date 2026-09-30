import { EXTEND_MONTHS, expireDueSites, extendSite, listSites, revokeSite } from '../services/siteExpiry.service.js';
import { getSiteLabels, markSite, saveSiteLabels } from '../services/siteMarks.service.js';

// ---------------------------------------------------------------- admin: published sites and their expiry

/** `{ sites, extendMonths, labels }`: every published site with its owner, soonest to expire first. */
export const listAdminSites = async (req, res) => {
  const [sites, labels] = await Promise.all([listSites(), getSiteLabels()]);
  res.json({ sites, extendMonths: EXTEND_MONTHS, labels });
};

/** Body `{ starred?, labels? }`: stars a site and / or sets its labels. */
export const markAdminSite = async (req, res) => {
  res.json(await markSite(req.params.uid, req.body ?? {}));
};

/** Body `{ labels: [{ id, name, color }] }`: the admins' label list. */
export const saveAdminSiteLabels = async (req, res) => {
  res.json({ labels: await saveSiteLabels(req.body?.labels, req.user.uid) });
};

/** Body `{ months }` (3, 6 or 12), after the user has paid. Brings an expired site back online. */
export const extendAdminSite = async (req, res) => {
  res.json(await extendSite(req.params.uid, Number(req.body?.months), req.user.uid));
};

/** Cancels the time left on a site: it expires and goes offline right away (extend brings it back). */
export const revokeAdminSite = async (req, res) => {
  res.json(await revokeSite(req.params.uid, req.user.uid));
};

/** Takes down every site past its date now instead of waiting for the next sweep. */
export const expireAdminSites = async (req, res) => {
  res.json({ expired: await expireDueSites() });
};
