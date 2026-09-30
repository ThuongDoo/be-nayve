import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import { getMySite } from '../controllers/deploy.controller.js';
import {
  approveDomainRequest,
  cancelMyDomainChange,
  checkDomain,
  getMyDomain,
  listDomainRequests,
  rejectDomainRequest,
  setMyDomain,
} from '../controllers/domain.controller.js';
import {
  approvePublishRequest,
  cancelPublish,
  getPublishRequest,
  getPublishStatus,
  getMyPublishOverview,
  listPublishRequests,
  rejectPublishRequest,
  requestPublish,
} from '../controllers/publish.controller.js';
import {
  cleanupAllStorage,
  cleanupMyStorage,
  deleteMyFile,
  deleteMyFiles,
  getMyStorage,
  getMyUsage,
} from '../controllers/storage.controller.js';
import {
  expireAdminSites,
  extendAdminSite,
  listAdminSites,
  markAdminSite,
  revokeAdminSite,
  saveAdminSiteLabels,
} from '../controllers/site.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();
const admin = [requireAuth, requireAdmin];

router.get('/health', getHealth);

// Each user has one domain: the first choice is instant, changing it needs an admin.
router.get('/domains/check', requireAuth, checkDomain);
router.get('/me/domain', requireAuth, getMyDomain);
router.put('/me/domain', requireAuth, setMyDomain);
router.delete('/me/domain/pending', requireAuth, cancelMyDomainChange);
router.get('/me/site', requireAuth, getMySite);
router.get('/me/publish-overview', requireAuth, getMyPublishOverview);

// Deletes uploads no design uses any more (after a 24h grace period, see storageCleanup.service.js).
router.post('/me/storage/cleanup', requireAuth, cleanupMyStorage);
// Upload quota (see storageUsage.service.js): usage, file list, deleting one's own files.
router.get('/me/storage/usage', requireAuth, getMyUsage);
router.get('/me/storage', requireAuth, getMyStorage);
router.delete('/me/storage/files', requireAuth, deleteMyFile);
router.post('/me/storage/files/delete', requireAuth, deleteMyFiles);
router.post('/admin/storage/cleanup', ...admin, cleanupAllStorage);

// Users ask for a page to be published on their domain; it only goes live once an admin approves it.
router.post('/designs/:designId/publish', requireAuth, requestPublish);
router.get('/designs/:designId/publish', requireAuth, getPublishStatus);
router.delete('/designs/:designId/publish', requireAuth, cancelPublish);

router.get('/admin/publish-requests', ...admin, listPublishRequests);
router.get('/admin/publish-requests/:id', ...admin, getPublishRequest);
router.post('/admin/publish-requests/:id/approve', ...admin, approvePublishRequest);
router.post('/admin/publish-requests/:id/reject', ...admin, rejectPublishRequest);

// Published sites run 3 days after approval, then until an admin extends them (after the user paid).
router.get('/admin/sites', ...admin, listAdminSites);
router.post('/admin/sites/expire-due', ...admin, expireAdminSites);
router.post('/admin/sites/:uid/extend', ...admin, extendAdminSite);
router.post('/admin/sites/:uid/revoke', ...admin, revokeAdminSite);
// Stars and labels admins put on sites to keep track of them (like Gmail's).
router.patch('/admin/sites/:uid/marks', ...admin, markAdminSite);
router.put('/admin/site-labels', ...admin, saveAdminSiteLabels);

router.get('/admin/domain-requests', ...admin, listDomainRequests);
router.post('/admin/domain-requests/:uid/approve', ...admin, approveDomainRequest);
router.post('/admin/domain-requests/:uid/reject', ...admin, rejectDomainRequest);

export default router;
