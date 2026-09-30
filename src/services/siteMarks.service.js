import { db } from '../config/firebase.js';
import { siteRef } from './deploy.service.js';
import { httpError } from '../utils/httpError.js';

/**
 * Admin bookkeeping on published sites, like Gmail's stars and labels: `sites/{uid}.starred` flags a
 * site that needs attention, `sites/{uid}.labels` holds label ids. The labels themselves (name, colour)
 * are shared by all admins in `config/siteLabels`.
 */

/** What admins start with, until they edit the list. */
export const DEFAULT_LABELS = [
  { id: 'contact', name: 'Cần liên hệ', color: '#f59e0b' },
  { id: 'paid', name: 'Đã thanh toán', color: '#16a34a' },
  { id: 'vip', name: 'Khách VIP', color: '#8b5cf6' },
  { id: 'issue', name: 'Có vấn đề', color: '#ef4444' },
  { id: 'follow', name: 'Theo dõi', color: '#0ea5e9' },
];

const MAX_LABELS = 30;
const labelsRef = () => db.doc('config/siteLabels');

export async function getSiteLabels() {
  const snap = await labelsRef().get();
  return snap.exists ? (snap.get('labels') ?? []) : DEFAULT_LABELS;
}

/** Replaces the label list. Sites keep ids of deleted labels; they are simply not shown. */
export async function saveSiteLabels(input, by) {
  if (!Array.isArray(input) || input.length > MAX_LABELS) throw httpError(400, `Tối đa ${MAX_LABELS} nhãn`);
  const seen = new Set();
  const labels = input.map((l) => {
    const id = String(l?.id ?? '').trim();
    const name = String(l?.name ?? '').trim();
    const color = String(l?.color ?? '');
    if (!/^[\w-]{1,40}$/.test(id) || seen.has(id)) throw httpError(400, 'Mã nhãn không hợp lệ');
    if (!name || name.length > 30) throw httpError(400, 'Tên nhãn phải có 1–30 ký tự');
    if (!/^#[0-9a-f]{6}$/i.test(color)) throw httpError(400, 'Màu nhãn không hợp lệ');
    seen.add(id);
    return { id, name, color };
  });
  await labelsRef().set({ labels, updatedBy: by, updatedAt: new Date() });
  return labels;
}

/** Body `{ starred?, labels? }`: sets the site's star and/or its label ids. Resolves to the new marks. */
export async function markSite(uid, { starred, labels }) {
  const patch = {};
  if (starred !== undefined) patch.starred = starred === true;
  if (labels !== undefined) {
    if (!Array.isArray(labels) || labels.length > MAX_LABELS || labels.some((id) => typeof id !== 'string' || !/^[\w-]{1,40}$/.test(id))) {
      throw httpError(400, 'Danh sách nhãn không hợp lệ');
    }
    patch.labels = [...new Set(labels)];
  }
  if (!Object.keys(patch).length) throw httpError(400, 'Không có gì để thay đổi');
  const ref = siteRef(uid);
  if (!(await ref.get()).exists) throw httpError(404, 'Không tìm thấy trang web');
  await ref.update(patch);
  const site = (await ref.get()).data();
  return { starred: !!site.starred, labels: site.labels ?? [] };
}
