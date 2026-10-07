import { createHash } from 'node:crypto';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
import { exportHtml } from '../lib/render/exportHtml.js';
import { normalizeDoc } from '../lib/render/elements.js';
import { addProjectDomain, deleteProject, deployStatic, getDeployment, removeProjectDomain } from './vercel.service.js';
import { fullDomain } from './domain.service.js';
import { bundleImages } from './assets.service.js';
import { httpError } from '../utils/httpError.js';
import { config } from '../config/index.js';

/**
 * One published site per user, served at their domain. Each published design gets its own Vercel
 * project; publishing a different design deletes the previous project (and every deployment in it)
 * before deploying the new one. sites/{uid} = { projectName, designId, title, domain, deploymentId,
 * status, url, deployedAt, expiresAt, expired, design, extensions }. Only this backend reads or writes it.
 *
 * A site runs until `expiresAt`: approving a publish gives it a trial (TRIAL_DAYS, or keeps a later date
 * an admin already extended it to); admins extend it by months once the user has paid. When it runs out
 * the site is swapped for an "expired" page (siteExpiry.service.js), and `design` (what was approved)
 * lets an extension bring it back.
 */
export const siteRef = (uid) => db.doc(`sites/${uid}`);

/**
 * What is kept of a site taken down because its design was deleted (takeDownSite): its end date,
 * extensions and admin marks, so time already paid for still counts when the user publishes again.
 * retiredSites/{uid} = { designId, expiresAt, extensions, starred, labels, retiredAt }.
 */
const retiredRef = (uid) => db.doc(`retiredSites/${uid}`);

export const TRIAL_DAYS = 3;
const DAY_MS = 86_400_000;

/** Vercel project names: lowercase, max 100 chars. Hashed so it doesn't reveal the uid or design id. */
export const projectNameFor = (uid, designId) =>
  `nayva-${createHash('sha256').update(`${uid}/${designId}`).digest('hex').slice(0, 16)}`;

const FAILED = ['ERROR', 'CANCELED'];

/** Status fields from a Vercel deployment; `url` is the user's domain once the build is ready. */
const statusOf = (d, domain) => ({
  status: d.readyState,
  url: d.readyState === 'READY' ? `https://${domain}` : null,
});

const iso = (ts) => ts?.toDate?.().toISOString() ?? null;

/**
 * A site record as sent to clients: dates as ISO strings, without the design snapshot. `expired` is also
 * true once the date has passed but the sweep hasn't taken the site down yet.
 */
export const serializeSite = ({ design: _design, ...record }) => ({
  ...record,
  deployedAt: iso(record.deployedAt),
  expiresAt: iso(record.expiresAt),
  expiredAt: iso(record.expiredAt),
  expired: !!record.expired || (!!record.expiresAt && record.expiresAt.toMillis() <= Date.now()),
  extensions: (record.extensions ?? []).map((e) => ({ ...e, at: iso(e.at) })),
});
const serialize = serializeSite;

/**
 * Where the forms of the site in Vercel project `projectName` post to (see lib/render/form.js and
 * forms.service.js), or null while PUBLIC_API_URL isn't set: the forms then say they can't send.
 */
export const formsFor = (projectName) =>
  config.publicApiUrl && projectName ? { endpoint: `${config.publicApiUrl}/forms/submit`, site: projectName } : null;

/**
 * Renders `design` ({ page, elements }) to HTML, throwing 422 if the data is unusable. `projectName`:
 * the Vercel project it is deployed to, which its forms name when they post.
 */
export function renderDesign(design, { projectName } = {}) {
  try {
    return exportHtml(normalizeDoc(design), { forms: formsFor(projectName) });
  } catch {
    throw httpError(422, 'Dữ liệu thiết kế không hợp lệ');
  }
}

const DOMAIN_RETRY_MS = 2000;
const DOMAIN_RETRY_TIMEOUT_MS = 30_000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Attaches a domain that was just detached from the project being replaced. Vercel may keep reporting it
 * as in use (409) for a few seconds while the old project is torn down, so retry for a while instead of
 * failing the approval.
 */
async function attachFreedDomain(project, domain) {
  const deadline = Date.now() + DOMAIN_RETRY_TIMEOUT_MS;
  for (;;) {
    try {
      return await addProjectDomain(project, domain);
    } catch (e) {
      if (e.vercelStatus !== 409 || Date.now() + DOMAIN_RETRY_MS > deadline) throw e;
      await sleep(DOMAIN_RETRY_MS);
    }
  }
}

/**
 * The files of a site built from `design`: its HTML plus the images copied next to it. `projectName`:
 * the Vercel project they go to (see renderDesign).
 */
export async function buildSiteFiles(design, { projectName } = {}) {
  const { design: bundled, files, missing } = await bundleImages(design);
  return { files: { 'index.html': renderDesign(bundled, { projectName }), ...files }, missing };
}

/**
 * Deploys `design` as the user's site and makes sure their domain (`name`) points at it. Updating the
 * design already live redeploys its project; switching to another design first deletes the old
 * project from Vercel, so the user never has more than one site there.
 */
export async function deploySite(uid, designId, design, name) {
  renderDesign(design); // Fail on bad data before touching anything.
  const domain = fullDomain(name);
  const ref = siteRef(uid);
  const current = (await ref.get()).data();
  // Updating the live design keeps its project; another design gets its own (decided below too).
  const target = current?.designId === designId ? current.projectName : projectNameFor(uid, designId);
  // Images are copied into the deployment before the old site is removed, so a failure here leaves it up.
  const { files, missing } = await buildSiteFiles(design, { projectName: target });
  // Dates and marks carry over from the live site, or from one taken down when its design was deleted.
  const previous = current ?? (await retiredRef(uid).get()).data();
  // A trial from now, unless an admin already extended the site further (a paid site keeps its date,
  // even when another design takes its place).
  const expiresAt = Timestamp.fromMillis(Math.max(previous?.expiresAt?.toMillis() ?? 0, Date.now() + TRIAL_DAYS * DAY_MS));

  let projectName;
  let replaced = false;
  if (current?.designId === designId) {
    projectName = current.projectName;
  } else {
    if (current) {
      // The old site is offline from here until the new deployment is ready. The domain is detached
      // explicitly first: deleting a project finishes in the background, and until it does Vercel still
      // treats the domain as taken.
      await removeProjectDomain(current.projectName, current.domain);
      await deleteProject(current.projectName);
      await ref.delete();
      replaced = true;
    }
    projectName = projectNameFor(uid, designId);
  }

  // The first deployment creates the project, so the domain can only be attached afterwards.
  const d = await deployStatic(projectName, files);
  // A site taken down moments ago (takeDownSite) may still hold the domain on Vercel, like a replaced one.
  await (replaced || (!current && previous) ? attachFreedDomain : addProjectDomain)(projectName, domain);
  const record = {
    projectName,
    designId,
    title: design.page?.title ?? null,
    domain,
    deploymentId: d.id,
    ...statusOf(d, domain),
    deployedAt: FieldValue.serverTimestamp(),
    expiresAt,
    expired: false,
    expiredAt: null,
    design: { page: design.page, elements: design.elements },
    extensions: previous?.extensions ?? [],
    // Admin marks (siteMarks.service.js) follow the user, whichever design is live.
    starred: previous?.starred ?? false,
    labels: previous?.labels ?? [],
  };
  await ref.set(record);
  if (!current && previous) await retiredRef(uid).delete();
  return { ...serialize({ ...record, deployedAt: Timestamp.now() }), missingImages: missing };
}

/**
 * Takes the user's site off the internet because `designId`, the design it shows, is being deleted:
 * the domain is detached and the Vercel project deleted with all its deployments. The domain name stays
 * the user's, and time paid for is kept for their next publish (retiredRef). Resolves to whether there
 * was a site for this design. Call while holding the user's site lock.
 */
export async function takeDownSite(uid, designId) {
  const ref = siteRef(uid);
  const site = (await ref.get()).data();
  if (!site || site.designId !== designId) return false;
  await removeProjectDomain(site.projectName, site.domain);
  await deleteProject(site.projectName);
  await retiredRef(uid).set({
    designId,
    expiresAt: site.expiresAt ?? null,
    extensions: site.extensions ?? [],
    starred: site.starred ?? false,
    labels: site.labels ?? [],
    retiredAt: FieldValue.serverTimestamp(),
  });
  await ref.delete();
  return true;
}

/** Moves a deployed site from one name to another. Does nothing on Vercel if the user never published. */
export async function moveSiteDomain(uid, fromName, toName) {
  const ref = siteRef(uid);
  const site = (await ref.get()).data();
  if (!site) return;
  const to = fullDomain(toName);
  // New address first so the site never goes offline, then the old one. Both steps are idempotent, so
  // if anything fails the admin can simply approve again.
  await addProjectDomain(site.projectName, to);
  if (fromName && fromName !== toName) {
    // Must succeed: the old name is released for other users once the change is approved.
    await removeProjectDomain(site.projectName, fullDomain(fromName));
  }
  await ref.update({ domain: to, url: site.status === 'READY' ? `https://${to}` : null });
}

/** The user's site, or null if nothing was published yet. Refreshed from Vercel while it is building. */
export async function getSiteStatus(uid) {
  const ref = siteRef(uid);
  const record = (await ref.get()).data();
  if (!record) return null;
  // Past its date but not taken down yet: do it now, in the background (the answer already says expired).
  if (!record.expired && record.expiresAt && record.expiresAt.toMillis() <= Date.now()) {
    import('./siteExpiry.service.js')
      .then(({ expireSite }) => expireSite(uid))
      .catch((e) => console.error(`Could not expire site of ${uid}:`, e.message));
  }
  if (!FAILED.includes(record.status) && record.status !== 'READY') {
    const fresh = statusOf(await getDeployment(record.deploymentId), record.domain);
    Object.assign(record, fresh);
    await ref.update(fresh);
  }
  return serialize(record);
}
