import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
import { httpError } from '../utils/httpError.js';

/**
 * Serializes everything that changes one user's site on Vercel (publishing a design, moving the domain).
 * Run in parallel, two of those can delete each other's project or attach the domain to the wrong one,
 * leaving orphaned projects behind. siteLocks/{uid} = { action, by, lockedAt } while one runs.
 */
const lockRef = (uid) => db.doc(`siteLocks/${uid}`);

/** A lock older than this is assumed to belong to a crashed request; deploys finish well within it. */
const STALE_MS = 5 * 60_000;

/**
 * Runs `fn` while holding the user's site lock. Throws 409 if another change to the same site is in
 * progress; the admin can simply try again once it finishes.
 */
export async function withSiteLock(uid, { action, by }, fn) {
  const ref = lockRef(uid);
  await db.runTransaction(async (t) => {
    const lock = (await t.get(ref)).data();
    if (lock && Date.now() - lock.lockedAt.toMillis() < STALE_MS) {
      throw httpError(409, 'Trang web của người dùng này đang được cập nhật. Hãy thử lại sau ít giây.');
    }
    t.set(ref, { action, by, lockedAt: FieldValue.serverTimestamp() });
  });
  try {
    return await fn();
  } finally {
    await ref.delete().catch((e) => console.error(`Could not release site lock of ${uid}:`, e.message));
  }
}
