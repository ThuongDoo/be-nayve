import { uploadFile } from './vercel.service.js';

/**
 * Makes a published site independent of Firebase Storage: every file the design loads from Storage
 * (image elements, images/videos inside shapes, audio elements, the favicon) is downloaded and
 * shipped inside the Vercel deployment, and the design is rewritten to point at those copies.
 * Deleting a file from Storage then no longer breaks the live site.
 */

const STORAGE_URL = /^https:\/\/firebasestorage\.googleapis\.com\//;
/** Same cap as the Storage upload rules (videos allow up to 30MB). */
const MAX_BYTES = 30 * 1024 * 1024;

const EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/webm': 'weba',
  'audio/flac': 'flac',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/ogg': 'ogv',
};

const isStorageUrl = (src) => typeof src === 'string' && STORAGE_URL.test(src);

/** Storage answers these for a file that was deleted (or whose download token was revoked). */
const GONE = [403, 404];

/**
 * Downloads one image and uploads it to Vercel; returns its path inside the deployment, or null if the
 * image no longer exists. Any other failure (network, Vercel) throws, so publishing stops before the
 * old site is touched rather than going live with images missing.
 */
async function bundle(src, files) {
  const res = await fetch(src);
  if (GONE.includes(res.status)) return null;
  if (!res.ok) throw new Error(`Không tải được ảnh từ Storage (HTTP ${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  // Can't normally happen (uploads are capped by the Storage rules); leave it out rather than fail.
  if (buffer.length > MAX_BYTES) return null;
  const type = (res.headers.get('content-type') ?? '').split(';')[0].trim();
  const { sha, size } = await uploadFile(buffer);
  const path = `assets/${sha.slice(0, 20)}.${EXT[type] ?? 'bin'}`;
  files[path] = { sha, size };
  return `/${path}`;
}

/**
 * Returns `{ design, files, missing }`: the design with Storage URLs replaced by `/assets/…` paths, the
 * files to add to the deployment, and how many images could not be fetched (e.g. already deleted from
 * Storage). Those are left empty, so the page shows its placeholder colour instead of a broken image.
 */
export async function bundleImages(design) {
  const sources = new Set();
  if (isStorageUrl(design.page?.favicon)) sources.add(design.page.favicon);
  for (const el of design.elements ?? []) if (isStorageUrl(el?.props?.src)) sources.add(el.props.src);

  const files = {};
  const moved = new Map();
  let missing = 0;
  await Promise.all(
    [...sources].map(async (src) => {
      const path = await bundle(src, files);
      if (path === null) {
        console.warn('Image no longer in Storage, leaving it out:', src);
        missing++;
      }
      moved.set(src, path ?? '');
    }),
  );

  const swap = (src) => (moved.has(src) ? moved.get(src) : src);
  return {
    design: {
      ...design,
      page: design.page && { ...design.page, favicon: swap(design.page.favicon) },
      elements: (design.elements ?? []).map((el) =>
        el?.props && moved.has(el.props.src) ? { ...el, props: { ...el.props, src: swap(el.props.src) } } : el,
      ),
    },
    files,
    missing,
  };
}
