import { createHash } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
import { buildSiteFiles } from './deploy.service.js';
import { checkAvailability, cleanName, domainsCol, fullDomain } from './domain.service.js';
import { withSiteLock } from './siteLock.service.js';
import { addProjectDomain, deleteProject, deployStatic, getDeployment, removeProjectDomain } from './vercel.service.js';
import { httpError } from '../utils/httpError.js';

/**
 * Admins publish without the users' limits: any number of their designs can be live at once, each at
 * its own domain, deployed right away (no review) and never expiring.
 *
 *   adminSites/{uid}_{designId} = { uid, designId, projectName, title, name, domain, deploymentId,
 *                                   status, url, deployedAt }
 *
 * The name is reserved in domains/{name} with the design id ({ uid, designId, state: 'active' }), so it
 * can't clash with users' domains, the admin's own user domain or the admin's other sites. Kept apart
 * from sites/{uid} so the expiry sweep and the users' one-site flow never touch it. Only this backend
 * reads or writes it.
 */
const adminSiteRef = (uid, designId) => db.doc(`adminSites/${uid}_${designId}`);

/** Each admin site has its own lock: publishing one never waits on another. */
const lockKey = (uid, designId) => `admin_${uid}_${designId}`;

/** Different from the users' projectNameFor, so an admin's design published both ways never shares a project. */
const projectNameFor = (uid, designId) =>
  `nayva-a-${createHash('sha256').update(`admin/${uid}/${designId}`).digest('hex').slice(0, 16)}`;

const FAILED = ['ERROR', 'CANCELED'];
const statusOf = (d, domain) => ({ deploymentId: d.id, status: d.readyState, url: d.readyState === 'READY' ? `https://${domain}` : null });

const serialize = ({ projectName: _p, deploymentId: _d, ...record }) => ({
  ...record,
  deployedAt: record.deployedAt?.toDate?.().toISOString() ?? null,
});

/** Refreshes a record still building from Vercel, then serializes it. */
async function withFreshStatus(ref, record) {
  if (!FAILED.includes(record.status) && record.status !== 'READY') {
    const fresh = statusOf(await getDeployment(record.deploymentId), record.domain);
    Object.assign(record, fresh);
    await ref.update(fresh);
  }
  return serialize(record);
}

/** The admin site of one design, or null. */
export async function getAdminSite(uid, designId) {
  const ref = adminSiteRef(uid, designId);
  const record = (await ref.get()).data();
  return record ? withFreshStatus(ref, record) : null;
}

/** `{ [designId]: site }` for every site of this admin. */
export async function listAdminSitesOf(uid) {
  const snap = await db.collection('adminSites').where('uid', '==', uid).get();
  const sites = await Promise.all(snap.docs.map((d) => withFreshStatus(d.ref, d.data())));
  return Object.fromEntries(sites.map((s) => [s.designId, s]));
}

/**
 * Deploys the design as saved in Firestore to `<name>.<root domain>`, at once. Publishing the same
 * design again redeploys its project; a different name moves the site there and frees the old one.
 */
export async function deployAdminSite(uid, designId, rawName) {
  const name = cleanName(rawName);
  return withSiteLock(lockKey(uid, designId), { action: 'admin-publish', by: uid }, async () => {
    const snap = await db.doc(`users/${uid}/designs/${designId}`).get();
    if (!snap.exists) throw httpError(404, 'Không tìm thấy thiết kế');
    const { page, elements } = snap.data();
    const design = { page, elements };

    const ref = adminSiteRef(uid, designId);
    const current = (await ref.get()).data();
    const moving = current?.name !== name;
    // Fails on bad data before a name is reserved or anything changes on Vercel.
    const { files, missing } = await buildSiteFiles(design);

    const nameRef = domainsCol().doc(name);
    let reserved = false;
    if (moving) {
      const check = await checkAvailability(uid, name, designId);
      if (!check.available) throw httpError(409, check.reason);
      reserved = await db.runTransaction(async (t) => {
        const taken = (await t.get(nameRef)).data();
        if (taken) {
          // Checked again inside the transaction: someone may have taken it since checkAvailability.
          if (taken.uid !== uid || taken.designId !== designId) throw httpError(409, 'Tên miền này vừa có người khác chọn');
          return false;
        }
        t.set(nameRef, { uid, designId, state: 'active', createdAt: FieldValue.serverTimestamp() });
        return true;
      });
    }

    const projectName = current?.projectName ?? projectNameFor(uid, designId);
    const domain = fullDomain(name);
    let d;
    try {
      // The first deployment creates the project, so the domain can only be attached afterwards.
      d = await deployStatic(projectName, files);
      if (moving) await addProjectDomain(projectName, domain);
    } catch (e) {
      // Nothing points at a name reserved just now: give it back.
      if (reserved) await nameRef.delete().catch(() => {});
      throw e;
    }
    if (moving && current) {
      // The new address works already; now release the old one.
      await removeProjectDomain(projectName, current.domain);
      await domainsCol().doc(current.name).delete();
    }

    const record = {
      uid,
      designId,
      projectName,
      title: page?.title ?? null,
      name,
      domain,
      ...statusOf(d, domain),
      deployedAt: FieldValue.serverTimestamp(),
    };
    await ref.set(record);
    return { ...serialize({ ...record, deployedAt: null }), deployedAt: new Date().toISOString(), missingImages: missing };
  });
}

/** Takes the design's admin site off the internet and frees its name. Resolves to whether there was one. */
export async function takeDownAdminSite(uid, designId) {
  // Called for every deleted design, admin or not: skip the lock when there's nothing to take down.
  if (!(await adminSiteRef(uid, designId).get()).exists) return false;
  return withSiteLock(lockKey(uid, designId), { action: 'admin-takedown', by: uid }, async () => {
    const ref = adminSiteRef(uid, designId);
    const site = (await ref.get()).data();
    if (!site) return false;
    await removeProjectDomain(site.projectName, site.domain);
    await deleteProject(site.projectName);
    const nameRef = domainsCol().doc(site.name);
    const reservation = (await nameRef.get()).data();
    if (reservation?.uid === uid && reservation.designId === designId) await nameRef.delete();
    await ref.delete();
    return true;
  });
}
