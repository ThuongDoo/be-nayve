import { FieldValue } from 'firebase-admin/firestore';
import { config } from '../config/index.js';
import { db } from '../config/firebase.js';
import { httpError } from '../utils/httpError.js';
import { isVercelAppHostFree } from './vercel.service.js';

/**
 * Each user owns one site name; the site lives at `<name>.<PUBLISH_ROOT_DOMAIN>`.
 *
 *   domains/{name}       reservation, which makes names unique: { uid, state: 'active' | 'pending' }
 *   userDomains/{uid}    { domain, pendingDomain, status, submittedAt, reviewedAt, rejectReason, user }
 *
 * The first name a user picks is theirs immediately. Changing it afterwards reserves the new name
 * ('pending', so nobody else can take it meanwhile) and waits for an admin; the old name is only
 * released on approval. Only this backend reads or writes these collections.
 */

export const DOMAIN_STATUS = { pending: 'pending', processing: 'processing', approved: 'approved', rejected: 'rejected' };

const RESERVED = new Set([
  'www', 'api', 'app', 'admin', 'administrator', 'root', 'mail', 'email', 'smtp', 'ftp', 'dev', 'test', 'staging',
  'static', 'cdn', 'assets', 'blog', 'help', 'support', 'status', 'docs', 'login', 'signin', 'signup', 'account',
  'dashboard', 'nayva', 'vercel', 'firebase', 'google', 'facebook',
]);

/** 3–40 characters: lowercase letters, digits and single hyphens, not at either end. */
const NAME_RE = /^[a-z0-9](?:[a-z0-9]|-(?!-)){1,38}[a-z0-9]$/;

export const domainsCol = () => db.collection('domains');
export const userDomainRef = (uid) => db.doc(`userDomains/${uid}`);

export const fullDomain = (name) => `${name}.${config.publish.rootDomain}`;

/** Lowercases and trims a requested name; users often type the whole host, so drop the root domain. */
export function cleanName(raw) {
  const name = String(raw ?? '').trim().toLowerCase();
  const suffix = `.${config.publish.rootDomain}`;
  return name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
}

/** Why `name` can't be used as a site name, or null if its format is fine. */
export function invalidReason(name) {
  if (name.length < 3) return 'Tên miền cần ít nhất 3 ký tự';
  if (name.length > 40) return 'Tên miền tối đa 40 ký tự';
  if (!NAME_RE.test(name)) return 'Chỉ dùng chữ thường không dấu (a-z), số và dấu gạch ngang; không bắt đầu/kết thúc bằng gạch ngang';
  if (RESERVED.has(name)) return 'Tên miền này được hệ thống giữ lại';
  return null;
}

/**
 * `{ name, domain, available, reason }`. Taken means reserved by another user in Firestore, or (for
 * *.vercel.app) already used by some other Vercel project. The user's own names count as available
 * for the same use: their user domain when `designId` is null, or the site of that design for an admin
 * (adminSite.service.js reserves those with the design id).
 */
export async function checkAvailability(uid, raw, designId = null) {
  const name = cleanName(raw);
  const base = { name, domain: fullDomain(name) };
  const reason = invalidReason(name);
  if (reason) return { ...base, available: false, reason };

  const taken = (await domainsCol().doc(name).get()).data();
  if (taken && taken.uid !== uid) return { ...base, available: false, reason: 'Tên miền này đã có người dùng' };
  if (taken && (taken.designId ?? null) !== designId) {
    return { ...base, available: false, reason: 'Bạn đang dùng tên miền này cho một trang khác' };
  }
  if (!taken && config.publish.rootDomain === 'vercel.app' && !(await isVercelAppHostFree(base.domain))) {
    return { ...base, available: false, reason: 'Tên miền này đã có người dùng trên Vercel' };
  }
  return { ...base, available: true, reason: null };
}

const iso = (ts) => ts?.toDate?.().toISOString() ?? null;

/** Client view of userDomains/{uid} (fields are null when the user hasn't picked a name). */
export function serializeUserDomain(uid, data = {}) {
  return {
    uid,
    rootDomain: config.publish.rootDomain,
    domain: data.domain ? fullDomain(data.domain) : null,
    name: data.domain ?? null,
    pendingDomain: data.pendingDomain ? fullDomain(data.pendingDomain) : null,
    pendingName: data.pendingDomain ?? null,
    status: data.status ?? null,
    submittedAt: iso(data.submittedAt),
    reviewedAt: iso(data.reviewedAt),
    rejectReason: data.rejectReason ?? null,
    lastError: data.lastError ?? null,
    user: data.user ?? null,
  };
}

export async function getUserDomain(uid) {
  return serializeUserDomain(uid, (await userDomainRef(uid).get()).data());
}

/**
 * Picks the user's first name (active at once) or asks to change it (pending review). `user` holds
 * the requester's email/name for the admin screen.
 */
export async function claimDomain(uid, raw, user) {
  const name = cleanName(raw);
  const check = await checkAvailability(uid, name);
  if (!check.available) throw httpError(409, check.reason);

  const nameRef = domainsCol().doc(name);
  const mineRef = userDomainRef(uid);
  const data = await db.runTransaction(async (t) => {
    const [taken, mineSnap] = await Promise.all([t.get(nameRef), t.get(mineRef)]);
    const mine = mineSnap.data() ?? {};
    // Checked again inside the transaction: someone may have taken it since checkAvailability.
    if (taken.exists && (taken.get('uid') !== uid || taken.get('designId'))) throw httpError(409, 'Tên miền này vừa có người khác chọn');
    if (mine.domain === name) throw httpError(409, 'Đây đã là tên miền của bạn');
    if (mine.status === DOMAIN_STATUS.pending || mine.status === DOMAIN_STATUS.processing) {
      throw httpError(409, 'Bạn đang có một yêu cầu đổi tên miền chờ duyệt. Hãy huỷ nó trước khi gửi yêu cầu mới.');
    }

    if (!mine.domain) {
      t.set(nameRef, { uid, state: 'active', createdAt: FieldValue.serverTimestamp() });
      const next = { domain: name, pendingDomain: null, status: null, rejectReason: null, lastError: null, user };
      t.set(mineRef, { ...next, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return next;
    }

    t.set(nameRef, { uid, state: 'pending', createdAt: FieldValue.serverTimestamp() });
    const next = {
      ...mine,
      pendingDomain: name,
      status: DOMAIN_STATUS.pending,
      rejectReason: null,
      lastError: null,
      reviewedAt: null,
      user,
    };
    t.set(mineRef, { ...next, submittedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    return { ...next, submittedAt: null };
  });
  return { ...serializeUserDomain(uid, data), submittedAt: data.status ? new Date().toISOString() : null };
}

/** Frees the name a pending change had reserved and marks the change `status` with `fields`. */
async function closePending(uid, fromStatuses, status, fields = {}) {
  const mineRef = userDomainRef(uid);
  await db.runTransaction(async (t) => {
    const mine = (await t.get(mineRef)).data();
    if (!mine || !fromStatuses.includes(mine.status)) throw httpError(409, 'Không có yêu cầu đổi tên miền nào đang chờ');
    const nameRef = domainsCol().doc(mine.pendingDomain);
    const reservation = await t.get(nameRef);
    if (reservation.get('uid') === uid && reservation.get('state') === 'pending') t.delete(nameRef);
    t.update(mineRef, { pendingDomain: null, status, ...fields, updatedAt: FieldValue.serverTimestamp() });
  });
}

export const cancelDomainChange = (uid) => closePending(uid, [DOMAIN_STATUS.pending], null);

export const rejectDomainChange = (uid, adminUid, reason) =>
  closePending(uid, [DOMAIN_STATUS.pending], DOMAIN_STATUS.rejected, {
    rejectReason: reason,
    reviewedBy: adminUid,
    reviewedAt: FieldValue.serverTimestamp(),
  });

/** Locks a pending change for approval so two admins can't process it at once. Returns `{ from, to }`. */
export async function startDomainApproval(uid, adminUid) {
  const mineRef = userDomainRef(uid);
  return db.runTransaction(async (t) => {
    const mine = (await t.get(mineRef)).data();
    if (mine?.status !== DOMAIN_STATUS.pending) throw httpError(409, 'Yêu cầu này đã được xử lý hoặc đã bị huỷ');
    t.update(mineRef, { status: DOMAIN_STATUS.processing, reviewedBy: adminUid });
    return { from: mine.domain, to: mine.pendingDomain };
  });
}

/** Puts a change that failed half-way back in the queue. */
export const failDomainApproval = (uid, message) =>
  userDomainRef(uid).update({ status: DOMAIN_STATUS.pending, lastError: message });

/**
 * Makes the pending name the user's domain and releases the old one. Publish requests still waiting
 * for review now show the new domain (they are deployed to the user's current domain anyway).
 */
export async function finishDomainApproval(uid, { from, to }) {
  const waiting = await db.collection('publishRequests').where('uid', '==', uid).where('status', '==', 'pending').get();
  const batch = db.batch();
  for (const d of waiting.docs) batch.update(d.ref, { domain: fullDomain(to) });
  batch.set(domainsCol().doc(to), { uid, state: 'active', createdAt: FieldValue.serverTimestamp() });
  if (from && from !== to) batch.delete(domainsCol().doc(from));
  batch.update(userDomainRef(uid), {
    domain: to,
    pendingDomain: null,
    status: DOMAIN_STATUS.approved,
    lastError: null,
    reviewedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}

/** Admin queue of domain changes with the given status, oldest first. */
export async function listDomainChanges(status) {
  const snap = await db.collection('userDomains').where('status', '==', status).get();
  return snap.docs
    .map((d) => serializeUserDomain(d.id, d.data()))
    .sort((a, b) => (a.submittedAt ?? '').localeCompare(b.submittedAt ?? ''));
}
