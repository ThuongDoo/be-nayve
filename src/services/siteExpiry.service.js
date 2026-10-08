import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { db } from '../config/firebase.js';
import { buildSiteFiles, serializeSite, siteRef } from './deploy.service.js';
import { withSiteLock } from './siteLock.service.js';
import { deployStatic } from './vercel.service.js';
import { httpError } from '../utils/httpError.js';
import { config } from '../config/index.js';

/**
 * Site expiry (see deploy.service.js): a site past its `expiresAt` is swapped for a notice page, keeping
 * its project, domain and design; an admin extending it (once the user has paid) puts the design back.
 */

/** How long an admin can extend a site by, in months. */
export const EXTEND_MONTHS = [3, 6, 12];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** What visitors see on an expired site. */
const expiredPage = (site) => `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${esc(site.title || site.domain)} – Tạm ngưng</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: grid; place-items: center; padding: 24px; box-sizing: border-box; background: #f8fafc; color: #0f172a;
           font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; text-align: center; }
    .box { max-width: 460px; }
    .icon { width: 72px; height: 72px; margin: 0 auto 20px; border-radius: 50%; display: grid; place-items: center;
            background: #fef3c7; color: #b45309; font-size: 34px; }
    h1 { margin: 0 0 10px; font-size: 26px; }
    p { margin: 0; color: #64748b; font-size: 17px; line-height: 1.6; }
    a { color: #4f46e5; font-weight: 600; }
  </style>
</head>
<body>
  <div class="box">
    <div class="icon">⏳</div>
    <h1>Trang web đã hết hạn</h1>
    <p>${esc(site.domain)} đang tạm ngưng. ${config.appUrl ? `Nếu bạn là chủ trang, hãy <a href="${esc(config.appUrl)}">đăng nhập để gia hạn</a>.` : 'Nếu bạn là chủ trang, hãy liên hệ quản trị viên để gia hạn.'}</p>
  </div>
</body>
</html>
`;

const statusOf = (d, domain) => ({ deploymentId: d.id, status: d.readyState, url: d.readyState === 'READY' ? `https://${domain}` : null });

/** Takes the user's site down if its time is up. Resolves to whether it did. */
export async function expireSite(uid) {
  return withSiteLock(uid, { action: 'expire', by: 'system' }, async () => {
    const ref = siteRef(uid);
    const site = (await ref.get()).data();
    if (!site || site.expired || !site.expiresAt || site.expiresAt.toMillis() > Date.now()) return false;
    const d = await deployStatic(site.projectName, { 'index.html': expiredPage(site) });
    await ref.update({ expired: true, expiredAt: FieldValue.serverTimestamp(), ...statusOf(d, site.domain) });
    return true;
  });
}

/** Takes down every site whose time is up. Run periodically (server.js) and on demand by admins. */
export async function expireDueSites() {
  const snap = await db.collection('sites').where('expiresAt', '<=', Timestamp.now()).select('expired').get();
  let expired = 0;
  for (const doc of snap.docs) {
    if (doc.get('expired')) continue;
    try {
      if (await expireSite(doc.id)) expired++;
    } catch (e) {
      // Busy (another change holds the lock) or Vercel failed: the next sweep tries again.
      console.error(`Could not expire site of ${doc.id}:`, e.message);
    }
  }
  return expired;
}

/** `date` plus `months` calendar months, staying on the last day when the target month is shorter. */
function addMonths(date, months) {
  const d = new Date(date);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return d;
}

/**
 * Extends the user's site by `months` from its current end (or from now if that already passed), after
 * the user paid. An expired site is redeployed with the design that was live.
 */
export async function extendSite(uid, months, by) {
  if (!EXTEND_MONTHS.includes(months)) throw httpError(400, `Chỉ gia hạn được ${EXTEND_MONTHS.join(', ')} tháng`);
  return withSiteLock(uid, { action: 'extend', by }, async () => {
    const ref = siteRef(uid);
    const site = (await ref.get()).data();
    if (!site) throw httpError(404, 'Người dùng này chưa có trang web nào được xuất bản');

    const from = Math.max(Date.now(), site.expiresAt?.toMillis() ?? 0);
    const patch = {
      expiresAt: Timestamp.fromDate(addMonths(new Date(from), months)),
      extensions: FieldValue.arrayUnion({ months, at: Timestamp.now(), by }),
    };
    if (site.expired) {
      // Back online with the design that was live; sites from before this was stored fall back to the
      // design as the user last saved it.
      const design = site.design ?? (await db.doc(`users/${uid}/designs/${site.designId}`).get()).data();
      if (!design) throw httpError(409, 'Không tìm thấy thiết kế để khôi phục trang');
      const { files } = await buildSiteFiles({ page: design.page, elements: design.elements }, { projectName: site.projectName });
      Object.assign(patch, { expired: false, expiredAt: null, ...statusOf(await deployStatic(site.projectName, files), site.domain) });
    }
    await ref.update(patch);
    return serializeSite((await ref.get()).data());
  });
}

/**
 * Cancels the time left on the user's site (e.g. a payment fell through): its end date becomes now and
 * it is taken down right away. Recorded in `extensions` as `{ months: 0, revoked: true }`; extending
 * it later brings it back as usual.
 */
export async function revokeSite(uid, by) {
  await withSiteLock(uid, { action: 'revoke', by }, async () => {
    const ref = siteRef(uid);
    const site = (await ref.get()).data();
    if (!site) throw httpError(404, 'Người dùng này chưa có trang web nào được xuất bản');
    if (site.expired) throw httpError(409, 'Trang này đã hết hạn rồi');
    const now = Timestamp.now();
    await ref.update({ expiresAt: now, extensions: FieldValue.arrayUnion({ months: 0, revoked: true, at: now, by }) });
  });
  await expireSite(uid);
  return serializeSite((await siteRef(uid).get()).data());
}

const SITE_FIELDS = ['projectName', 'designId', 'title', 'domain', 'status', 'url', 'deployedAt', 'expiresAt', 'expired', 'expiredAt', 'extensions', 'starred', 'labels'];

/** Every published site with its owner (name, email, Threads link), the soonest to expire first. */
export async function listSites() {
  const snap = await db.collection('sites').select(...SITE_FIELDS).get();
  const owners = snap.empty ? [] : await db.getAll(...snap.docs.map((d) => db.doc(`users/${d.id}`)), { fieldMask: ['displayName', 'email', 'photoURL', 'threadsUrl'] });
  const byUid = Object.fromEntries(owners.map((u) => [u.id, u.data() ?? {}]));
  return snap.docs
    .map((d) => {
      const u = byUid[d.id] ?? {};
      return {
        uid: d.id,
        ...serializeSite(d.data()),
        // Admin marks (siteMarks.service.js).
        starred: !!d.get('starred'),
        labels: d.get('labels') ?? [],
        user: { name: u.displayName ?? null, email: u.email ?? null, picture: u.photoURL ?? null, threadsUrl: u.threadsUrl ?? null },
      };
    })
    .sort((a, b) => (a.expiresAt ?? '9999').localeCompare(b.expiresAt ?? '9999'));
}
