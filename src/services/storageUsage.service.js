import { FieldValue } from 'firebase-admin/firestore';
import { bucket, db } from '../config/firebase.js';
import { httpError } from '../utils/httpError.js';
import { OPEN_REQUEST, USER_FOLDERS, pathsInDesign } from './storageCleanup.service.js';

/**
 * Per-user upload quota. Usage is measured from what is actually in Storage (users/{uid}/images,
 * users/{uid}/audio and users/{uid}/videos) and written to quotas/{uid}.usedBytes, which storage.rules
 * read to refuse uploads that would go over the limit. The editor refreshes it after every upload.
 */
export const STORAGE_LIMIT_BYTES = (Number(process.env.STORAGE_LIMIT_MB) || 100) * 1024 * 1024;

const quotaRef = (uid) => db.doc(`quotas/${uid}`);

const downloadUrl = (file) => {
  const token = (file.metadata?.metadata?.firebaseStorageDownloadTokens || '').split(',')[0];
  return token
    ? `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`
    : null;
};

async function listUserFiles(uid) {
  const lists = await Promise.all(USER_FOLDERS.map((folder) => bucket.getFiles({ prefix: `users/${uid}/${folder}/` })));
  return lists.flatMap(([files]) => files);
}

async function saveUsage(uid, usedBytes) {
  await quotaRef(uid).set({ usedBytes, limitBytes: STORAGE_LIMIT_BYTES, updatedAt: FieldValue.serverTimestamp() });
}

/** Recomputes the user's usage from Storage and stores it for the rules. Returns `{ usedBytes, limitBytes }`. */
export async function refreshUsage(uid) {
  const files = await listUserFiles(uid);
  const usedBytes = files.reduce((sum, f) => sum + (Number(f.metadata?.size) || 0), 0);
  await saveUsage(uid, usedBytes);
  return { usedBytes, limitBytes: STORAGE_LIMIT_BYTES };
}

/**
 * Usage plus every uploaded file with where it is used:
 * `{ usedBytes, limitBytes, files: [{ path, name, kind, size, contentType, createdAt, url, usedIn, pendingPublish }] }`.
 * `usedIn` lists the designs showing the file; `pendingPublish` means a publish request waiting for
 * review still contains it.
 */
export async function storageDetails(uid) {
  const [files, designs, requests] = await Promise.all([
    listUserFiles(uid),
    db.collection(`users/${uid}/designs`).get(),
    db.collection('publishRequests').where('uid', '==', uid).get(),
  ]);

  const usedIn = new Map();
  for (const d of designs.docs) {
    const title = d.get('page')?.title || 'Chưa đặt tên';
    for (const path of pathsInDesign(d.data(), new Set())) {
      if (!usedIn.has(path)) usedIn.set(path, []);
      usedIn.get(path).push({ designId: d.id, title });
    }
  }
  const inRequests = new Set();
  requests.docs.filter((d) => OPEN_REQUEST.includes(d.get('status'))).forEach((d) => pathsInDesign(d.get('design'), inRequests));

  const list = files
    .map((f) => ({
      path: f.name,
      // Uploads made since the storage panel exist carry their original file name.
      name: f.metadata?.metadata?.originalName || f.name.split('/').pop(),
      kind: f.name.includes('/audio/') ? 'audio' : f.name.includes('/videos/') ? 'video' : 'image',
      size: Number(f.metadata?.size) || 0,
      contentType: f.metadata?.contentType || '',
      createdAt: f.metadata?.timeCreated || null,
      url: downloadUrl(f),
      usedIn: usedIn.get(f.name) ?? [],
      pendingPublish: inRequests.has(f.name),
    }))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  const usedBytes = list.reduce((sum, f) => sum + f.size, 0);
  await saveUsage(uid, usedBytes);
  return { usedBytes, limitBytes: STORAGE_LIMIT_BYTES, files: list };
}

/** Max files per bulk delete request. */
const MAX_BULK = 200;

const ownsPath = (uid, path) =>
  typeof path === 'string' && !path.includes('..') && USER_FOLDERS.some((folder) => path.startsWith(`users/${uid}/${folder}/`));

/** Deletes one of the user's own uploads (never anything outside their images/audio folders). */
export function deleteUserFile(uid, path) {
  return deleteUserFiles(uid, [path]);
}

/**
 * Deletes several of the user's own uploads, then recomputes usage once. Refuses the whole request if
 * any path is not theirs. Returns `{ usedBytes, limitBytes, deleted, failed }`.
 */
export async function deleteUserFiles(uid, paths) {
  if (!Array.isArray(paths) || !paths.length) throw httpError(400, 'Chưa chọn tệp nào');
  if (paths.length > MAX_BULK) throw httpError(400, `Mỗi lần xoá tối đa ${MAX_BULK} tệp`);
  if (!paths.every((p) => ownsPath(uid, p))) throw httpError(403, 'Không được xoá tệp này');
  const results = await Promise.allSettled([...new Set(paths)].map((p) => bucket.file(p).delete({ ignoreNotFound: true })));
  const failed = results.filter((r) => r.status === 'rejected').length;
  return { ...(await refreshUsage(uid)), deleted: results.length - failed, failed };
}
