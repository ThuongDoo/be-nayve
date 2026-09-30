import { FieldValue } from 'firebase-admin/firestore';
import { bucket, db } from '../config/firebase.js';
import { httpError } from '../utils/httpError.js';

/**
 * Deletes uploads nobody uses any more (images and audio removed from every design), which otherwise
 * pile up in Storage.
 *
 * A file counts as used while any of these points at it: one of the owner's designs, the snapshot of a
 * publish request still waiting or deploying, or a template (a template keeps the original URL when
 * copying one of its images failed). Published sites don't count: their files were copied into the
 * Vercel deployment.
 *
 * Files are not deleted the first time they turn up unused, since the owner may still undo the
 * removal in an open editor. storageCleanups/{scope} remembers since when each one has been unused;
 * only after ORPHAN_GRACE_MS in a row is it deleted. A file that is used again is forgotten.
 */
const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;
/** Per user, at most one automatic run this often (the editor asks on every visit to the home screen). */
const MIN_INTERVAL_MS = 60 * 1000;

export const USER_FOLDERS = ['images', 'audio', 'videos'];
export const OPEN_REQUEST = ['pending', 'deploying'];

const stateRef = (scope) => db.doc(`storageCleanups/${scope}`);

/** Storage object path of a Firebase download URL, or null for anything else (pasted links, data:). */
export function storagePath(url) {
  if (typeof url !== 'string') return null;
  const m = /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?]+)/.exec(url);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return null;
  }
}

/** Every Storage path a design ({ page, elements }) uses: favicon, images, shape images, audio. */
export function pathsInDesign(design, into) {
  const add = (url) => {
    const p = storagePath(url);
    if (p) into.add(p);
  };
  add(design?.page?.favicon);
  for (const el of design?.elements ?? []) add(el?.props?.src);
  return into;
}

async function templateRefs(into) {
  const snap = await db.collection('templates').get();
  snap.docs.forEach((d) => pathsInDesign(d.data(), into));
  return into;
}

/** Paths that must be kept for this user. */
async function userRefs(uid) {
  const used = new Set();
  const [designs, requests] = await Promise.all([
    db.collection(`users/${uid}/designs`).get(),
    db.collection('publishRequests').where('uid', '==', uid).get(),
    templateRefs(used),
  ]);
  designs.docs.forEach((d) => pathsInDesign(d.data(), used));
  requests.docs.filter((d) => OPEN_REQUEST.includes(d.get('status'))).forEach((d) => pathsInDesign(d.get('design'), used));
  return used;
}

// Firestore map keys can't hold every character a path can, so keys are URI-encoded.
const key = (path) => encodeURIComponent(path);

/**
 * Decides what to do with each file (`[{ name, size }]`): keep it (in use), delete it (unused for the
 * whole grace period) or wait. `since` maps encoded paths to when each was first seen unused.
 * Returns `{ remove, waiting }`, with `waiting` being the next `since` map.
 */
export function planSweep(files, used, since, now) {
  const remove = [];
  const waiting = {};
  for (const file of files) {
    if (used.has(file.name)) continue;
    const first = since[key(file.name)] ?? now;
    if (now - first >= ORPHAN_GRACE_MS) remove.push(file);
    else waiting[key(file.name)] = first;
  }
  return { remove, waiting };
}

/**
 * Compares the files under `prefixes` with the paths in use, deletes files unused for the whole grace
 * period and records the rest. Returns `{ deleted, freedBytes, waiting, kept }`.
 */
async function sweep(scope, prefixes, used) {
  const now = Date.now();
  const state = (await stateRef(scope).get()).data() ?? {};
  const since = state.orphans ?? {};
  const nextOrphans = {};
  const result = { deleted: 0, freedBytes: 0, waiting: 0, kept: 0 };

  const files = (await Promise.all(prefixes.map((prefix) => bucket.getFiles({ prefix })))).flatMap(([list]) => list);
  const plan = planSweep(files, used, since, now);
  Object.assign(nextOrphans, plan.waiting);
  for (const file of plan.remove) {
    try {
      await file.delete({ ignoreNotFound: true });
      result.deleted++;
      result.freedBytes += Number(file.metadata?.size) || 0;
    } catch (e) {
      console.error(`Could not delete ${file.name}:`, e.message);
      nextOrphans[key(file.name)] = since[key(file.name)];
    }
  }
  result.waiting = Object.keys(nextOrphans).length;
  result.kept = files.length - plan.remove.length - Object.keys(plan.waiting).length;

  await stateRef(scope).set({ orphans: nextOrphans, lastRunAt: FieldValue.serverTimestamp() });
  return result;
}

/**
 * Cleans one user's uploads. `force` skips the once-a-minute limit (used by the admin sweep).
 * Returns the sweep result, or `{ skipped: true }` when it ran too recently.
 */
export async function cleanupUser(uid, { force = false } = {}) {
  if (!force) {
    const last = (await stateRef(`user_${uid}`).get()).get('lastRunAt');
    if (last && Date.now() - last.toMillis() < MIN_INTERVAL_MS) return { skipped: true };
  }
  const used = await userRefs(uid);
  return sweep(`user_${uid}`, USER_FOLDERS.map((f) => `users/${uid}/${f}/`), used);
}

/** Images copied into templates that no template uses any more (e.g. after a template was deleted). */
async function cleanupTemplates() {
  return sweep('templates', ['templates/images/'], await templateRefs(new Set()));
}

/** Admin: every user plus the template images. Returns totals and how many users were checked. */
export async function cleanupAll() {
  const users = await db.collection('users').select().get();
  const total = { deleted: 0, freedBytes: 0, waiting: 0, kept: 0, users: users.size, errors: 0 };
  const add = (r) => {
    total.deleted += r.deleted;
    total.freedBytes += r.freedBytes;
    total.waiting += r.waiting;
    total.kept += r.kept;
  };
  for (const u of users.docs) {
    try {
      add(await cleanupUser(u.id, { force: true }));
    } catch (e) {
      console.error(`Storage cleanup failed for ${u.id}:`, e.message);
      total.errors++;
    }
  }
  try {
    add(await cleanupTemplates());
  } catch (e) {
    console.error('Storage cleanup failed for templates:', e.message);
    total.errors++;
  }
  if (total.errors && total.errors === total.users + 1) throw httpError(502, 'Không dọn được kho lưu trữ');
  return total;
}
