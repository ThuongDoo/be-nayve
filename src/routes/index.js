import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import { getMySite } from '../controllers/deploy.controller.js';
import { getMyAdminSite, publishMyAdminSite, takeDownMyAdminSite } from '../controllers/adminSite.controller.js';
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
  takeDownDesignSite,
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
import { findTelegramChats, testForm } from '../controllers/forms.controller.js';
import { createMyRenewOrder, getMyRenewOrder, getRenewPlans, sepayIpn } from '../controllers/payment.controller.js';
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
// Contact forms: checking where a form sends before publishing (published pages post to routes/forms.routes.js).
router.post('/me/forms/test', requireAuth, testForm);
router.post('/me/forms/telegram-chats', requireAuth, findTelegramChats);

router.post('/designs/:designId/publish', requireAuth, requestPublish);
router.get('/designs/:designId/publish', requireAuth, getPublishStatus);
router.delete('/designs/:designId/publish', requireAuth, cancelPublish);
router.delete('/designs/:designId/site', requireAuth, takeDownDesignSite);

// Admins skip all of that: any number of their designs go live at once, each at its own domain, with
// no review and no expiry.
router.get('/designs/:designId/admin-site', ...admin, getMyAdminSite);
router.put('/designs/:designId/admin-site', ...admin, publishMyAdminSite);
router.delete('/designs/:designId/admin-site', ...admin, takeDownMyAdminSite);

router.get('/admin/publish-requests', ...admin, listPublishRequests);
router.get('/admin/publish-requests/:id', ...admin, getPublishRequest);
router.post('/admin/publish-requests/:id/approve', ...admin, approvePublishRequest);
router.post('/admin/publish-requests/:id/reject', ...admin, rejectPublishRequest);

// Published sites run 3 days after approval, then until an admin extends them (after the user paid).
router.get('/admin/sites', ...admin, listAdminSites);
router.post('/admin/sites/expire-due', ...admin, expireAdminSites);
router.post('/admin/sites/:uid/extend', ...admin, extendAdminSite);
router.post('/admin/sites/:uid/revoke', ...admin, revokeAdminSite);
// Users renewing their site themselves: an order is paid on SePay, whose IPN extends the site.
router.get('/me/renew-plans', requireAuth, getRenewPlans);
router.post('/me/renew-orders', requireAuth, createMyRenewOrder);
router.get('/me/renew-orders/:id', requireAuth, getMyRenewOrder);
router.post('/payments/sepay/ipn', sepayIpn);
// Stars and labels admins put on sites to keep track of them (like Gmail's).
router.patch('/admin/sites/:uid/marks', ...admin, markAdminSite);
router.put('/admin/site-labels', ...admin, saveAdminSiteLabels);

router.get('/admin/domain-requests', ...admin, listDomainRequests);
router.post('/admin/domain-requests/:uid/approve', ...admin, approveDomainRequest);
router.post('/admin/domain-requests/:uid/reject', ...admin, rejectDomainRequest);

export default router;
