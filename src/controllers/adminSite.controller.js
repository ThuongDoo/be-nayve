import { deployAdminSite, getAdminSite, takeDownAdminSite } from '../services/adminSite.service.js';
import { getUserDomain } from '../services/domain.service.js';

// Admins publish their own designs directly, as many as they like, each at its own domain
// (adminSite.service.js). Routes are behind requireAdmin; the design is always the admin's own.

/** `{ site, rootDomain }`: this design's site (or null) and the root domain names go under. */
export const getMyAdminSite = async (req, res) => {
  const [site, { rootDomain }] = await Promise.all([getAdminSite(req.user.uid, req.params.designId), getUserDomain(req.user.uid)]);
  res.json({ site, rootDomain });
};

/** Body `{ name }`: deploys the design as saved now at `<name>.<root domain>`. */
export const publishMyAdminSite = async (req, res) => {
  res.json(await deployAdminSite(req.user.uid, req.params.designId, req.body?.name));
};

export const takeDownMyAdminSite = async (req, res) => {
  res.json({ removed: await takeDownAdminSite(req.user.uid, req.params.designId) });
};
