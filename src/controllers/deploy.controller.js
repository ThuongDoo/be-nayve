import { getSiteStatus } from '../services/deploy.service.js';

// Deploying itself only happens when an admin approves a publish request (publish.controller.js).

/** The signed-in user's published site, or null. */
export const getMySite = async (req, res) => {
  res.json(await getSiteStatus(req.user.uid));
};
