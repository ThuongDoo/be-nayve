import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
import { deploySite, getSiteStatus, renderDesign, takeDownSite } from '../services/deploy.service.js';
import { listAdminSitesOf, takeDownAdminSite } from '../services/adminSite.service.js';
import { getUserDomain } from '../services/domain.service.js';
import { withSiteLock } from '../services/siteLock.service.js';
import { httpError } from '../utils/httpError.js';
import { normalizeThreadsUrl } from '../utils/threads.js';

/**
 * Publishing goes through admin review so users can't spam public pages:
 *
 *   user  → POST   /designs/:designId/publish   snapshot the design, status 'pending'
 *   admin → POST   /admin/publish-requests/:id/approve   deploy the snapshot to Vercel, status 'approved'
 *   admin → POST   /admin/publish-requests/:id/reject    status 'rejected' with a reason
 *
 * publishRequests/{uid}_{designId} holds one request per design: a new submission replaces the old one.
 * A user has one site, so they may have only one request waiting at a time, across all their designs:
 * submitting again replaces (cancels) the one still waiting.
 * Clients never touch this collection directly (no Firestore rule allows it); everything goes through here.
 */

export const STATUS = { pending: 'pending', deploying: 'deploying', approved: 'approved', rejected: 'rejected' };
const OPEN = [STATUS.pending, STATUS.deploying];

const requests = () => db.collection('publishRequests');
const requestId = (uid, designId) => `${uid}_${designId}`;

/**
 * The user's request that is still waiting or being deployed, or null. Filtered here rather than with a
 * second `where`, which would need a composite index; a user only has a handful of requests.
 */
async function openRequestsOf(uid, t) {
  const q = requests().where('uid', '==', uid).select('designId', 'status', 'title');
  const snap = await (t ? t.get(q) : q.get());
  return snap.docs.filter((d) => OPEN.includes(d.get('status')));
}

async function openRequestOf(uid, t) {
  const [doc] = await openRequestsOf(uid, t);
  return doc ? { designId: doc.get('designId'), status: doc.get('status'), title: doc.get('title') } : null;
}

const iso = (ts) => ts?.toDate?.().toISOString() ?? null;

/** The Threads link the user left for admins to reach them (saved on their profile), or null. */
async function threadsUrlOf(uid) {
  const snap = await db.doc(`users/${uid}`).get();
  return snap.get('threadsUrl') ?? null;
}

/** The request as sent to clients; the design snapshot is only included when asked for. */
const serialize = (id, data, { withDesign = false } = {}) => ({
  id,
  uid: data.uid,
  designId: data.designId,
  status: data.status,
  title: data.title,
  user: data.user,
  domain: data.domain ?? null,
  contact: data.contact ?? null,
  submittedAt: iso(data.submittedAt),
  reviewedAt: iso(data.reviewedAt),
  rejectReason: data.rejectReason ?? null,
  lastError: data.lastError ?? null,
  ...(withDesign && { design: data.design }),
});

// ---------------------------------------------------------------- user

export const requestPublish = async (req, res) => {
  const { uid, email = null, name = null, picture = null } = req.user;
  const { designId } = req.params;

  const [snap, userDomain, savedThreads] = await Promise.all([
    db.doc(`users/${uid}/designs/${designId}`).get(),
    getUserDomain(uid),
    threadsUrlOf(uid),
  ]);
  if (!snap.exists) throw httpError(404, 'Không tìm thấy thiết kế');
  if (!userDomain.name) throw httpError(409, 'Hãy chọn tên miền cho trang web trước khi xuất bản');
  // A Threads link is optional (the publish dialog no longer asks for one): one sent is kept on the
  // profile, and one saved earlier is still passed on to admins.
  const sentThreads = req.body?.threadsUrl;
  const threadsUrl = sentThreads ? normalizeThreadsUrl(sentThreads) : savedThreads;
  if (sentThreads && !threadsUrl) throw httpError(400, 'Link Threads không hợp lệ (ví dụ: https://www.threads.com/@tentaikhoan)');
  const { page, elements } = snap.data();
  const design = { page, elements };
  renderDesign(design); // Reject unusable data now rather than when the admin approves it.

  const ref = requests().doc(requestId(uid, designId));
  const data = await db.runTransaction(async (t) => {
    // A new submission replaces the one still waiting (this design's is overwritten below, another
    // design's is cancelled), so the user only ever has one request in the queue. Read inside the
    // transaction so two quick submissions can't both stay open.
    const open = await openRequestsOf(uid, t);
    const deploying = open.find((d) => d.get('status') === STATUS.deploying);
    if (deploying) {
      throw httpError(409, `Trang “${deploying.get('title')}” đang được triển khai, hãy đợi xong rồi gửi lại.`);
    }
    for (const d of open) {
      if (d.id !== ref.id) t.update(d.ref, { status: 'cancelled', design: FieldValue.delete(), replacedBy: ref.id });
    }

    const next = {
      uid,
      designId,
      status: STATUS.pending,
      title: page?.title || 'Chưa đặt tên',
      user: { email, name, picture },
      domain: userDomain.domain,
      contact: { threadsUrl },
      design,
      submittedAt: FieldValue.serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      rejectReason: null,
      lastError: null,
    };
    t.set(ref, next);
    if (threadsUrl && threadsUrl !== savedThreads) t.set(db.doc(`users/${uid}`), { threadsUrl }, { merge: true });
    return next;
  });

  res.status(201).json({ ...serialize(ref.id, data), submittedAt: new Date().toISOString() });
};

/**
 * Everything the publish dialog needs: this design's request (or null), the user's site (or null; its
 * `designId` says which design is live), their domain settings, `contact.threadsUrl` (null until given)
 * and `otherOpen`: a request for another design that is still waiting (which blocks submitting this one), or null.
 */
export const getPublishStatus = async (req, res) => {
  const { uid } = req.user;
  const { designId } = req.params;
  const [snap, site, domain, open, threadsUrl] = await Promise.all([
    requests().doc(requestId(uid, designId)).get(),
    getSiteStatus(uid),
    getUserDomain(uid),
    openRequestOf(uid),
    threadsUrlOf(uid),
  ]);
  res.json({
    request: snap.exists ? serialize(snap.id, snap.data()) : null,
    site,
    domain,
    // Null until the user has given their Threads link: the dialog then asks for it.
    contact: { threadsUrl },
    otherOpen: open && open.designId !== designId ? open : null,
  });
};

/** Withdraws a request that is still waiting for review. */
export const cancelPublish = async (req, res) => {
  const ref = requests().doc(requestId(req.user.uid, req.params.designId));
  await db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    if (snap.get('status') !== STATUS.pending) throw httpError(409, 'Không có yêu cầu nào đang chờ duyệt');
    t.update(ref, { status: 'cancelled', design: FieldValue.delete() });
  });
  res.status(204).end();
};

/**
 * Called before the user deletes a design: takes its site off Vercel if it is the live one, and cancels
 * a request of it still waiting for review (approving that would publish the deleted design). An
 * admin's own site of the design (adminSite.service.js) goes too.
 * Answers `{ removed }`: whether a site was taken down.
 */
export const takeDownDesignSite = async (req, res) => {
  const { uid } = req.user;
  const { designId } = req.params;
  const removedAdmin = await takeDownAdminSite(uid, designId);
  const removedUser = await withSiteLock(uid, { action: 'takedown', by: uid }, async () => {
    const ref = requests().doc(requestId(uid, designId));
    await db.runTransaction(async (t) => {
      const status = (await t.get(ref)).get('status');
      if (status === STATUS.deploying) throw httpError(409, 'Trang này đang được triển khai, hãy đợi xong rồi xoá.');
      if (status === STATUS.pending) t.update(ref, { status: 'cancelled', design: FieldValue.delete() });
    });
    return takeDownSite(uid, designId);
  });
  res.json({ removed: removedAdmin || removedUser });
};

/** Request fields without the (large) design snapshot, for lists. */
const LIST_FIELDS = ['uid', 'designId', 'status', 'title', 'user', 'domain', 'contact', 'submittedAt', 'reviewedAt', 'rejectReason', 'lastError'];

/**
 * For the home screen: `{ requests: { [designId]: request }, site }`, i.e. every design's latest publish
 * request and the live site (`site.designId` is the design being shown), in one call. `adminSites`
 * maps design ids to an admin's own sites (adminSite.service.js); it is empty for everyone else.
 */
export const getMyPublishOverview = async (req, res) => {
  const { uid } = req.user;
  const [snap, site, adminSites] = await Promise.all([
    requests().where('uid', '==', uid).select(...LIST_FIELDS).get(),
    getSiteStatus(uid),
    listAdminSitesOf(uid),
  ]);
  const byDesign = Object.fromEntries(snap.docs.map((d) => [d.get('designId'), serialize(d.id, d.data())]));
  res.json({ requests: byDesign, site, adminSites });
};

// ---------------------------------------------------------------- admin

const REVIEWABLE = Object.values(STATUS);

/** `?status=pending` (default) | deploying | approved | rejected. Oldest first, so the queue is fair. */
export const listPublishRequests = async (req, res) => {
  const status = req.query.status ?? STATUS.pending;
  if (!REVIEWABLE.includes(status)) throw httpError(400, 'Trạng thái không hợp lệ');
  // Sorted here: ordering by another field than the filter would need a composite index.
  const snap = await requests()
    .where('status', '==', status)
    .select(...LIST_FIELDS)
    .get();
  const list = snap.docs
    .map((d) => serialize(d.id, d.data()))
    .sort((a, b) => (a.submittedAt ?? '').localeCompare(b.submittedAt ?? ''));
  res.json(status === STATUS.pending ? list : list.reverse());
};

/** One request including the design snapshot, for previewing before a decision. */
export const getPublishRequest = async (req, res) => {
  const snap = await requests().doc(req.params.id).get();
  if (!snap.exists) throw httpError(404, 'Không tìm thấy yêu cầu');
  res.json(serialize(snap.id, snap.data(), { withDesign: true }));
};

/** Moves a pending request to `status` inside a transaction, so two admins can't both act on it. */
async function claim(id, status, fields) {
  const ref = requests().doc(id);
  return db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    if (!snap.exists) throw httpError(404, 'Không tìm thấy yêu cầu');
    if (snap.get('status') !== STATUS.pending) throw httpError(409, 'Yêu cầu này đã được xử lý hoặc đã bị huỷ');
    t.update(ref, { status, ...fields });
    return { ref, data: snap.data() };
  });
}

export const approvePublishRequest = async (req, res) => {
  const owner = (await requests().doc(req.params.id).get()).get('uid');
  if (!owner) throw httpError(404, 'Không tìm thấy yêu cầu');

  // Locked before claiming, so a request that can't run yet simply stays pending.
  const result = await withSiteLock(owner, { action: 'publish', by: req.user.uid }, async () => {
    const { ref, data } = await claim(req.params.id, STATUS.deploying, { reviewedBy: req.user.uid });
    let deployment;
    try {
      // The user's current domain, even if it changed since they asked to publish.
      const { name } = await getUserDomain(data.uid);
      if (!name) throw httpError(409, 'Người dùng này chưa chọn tên miền');
      deployment = await deploySite(data.uid, data.designId, data.design, name);
    } catch (e) {
      // Back in the queue so it can be approved again once the problem (e.g. Vercel) is fixed.
      await ref.update({ status: STATUS.pending, lastError: e.message });
      throw e;
    }
    await ref.update({ status: STATUS.approved, reviewedAt: FieldValue.serverTimestamp(), lastError: null });
    return { id: ref.id, status: STATUS.approved, deployment };
  });
  res.json(result);
};

export const rejectPublishRequest = async (req, res) => {
  const reason = String(req.body?.reason ?? '').trim().slice(0, 500);
  if (!reason) throw httpError(400, 'Hãy nhập lý do từ chối để người dùng biết cần sửa gì');
  const { ref } = await claim(req.params.id, STATUS.rejected, {
    reviewedBy: req.user.uid,
    reviewedAt: FieldValue.serverTimestamp(),
    rejectReason: reason,
  });
  res.json({ id: ref.id, status: STATUS.rejected, rejectReason: reason });
};
