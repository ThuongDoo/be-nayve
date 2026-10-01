/**
 * Building blocks shared by the sample templates (one file per template in this folder).
 */
import { createElement, createFromKey, scrollYHref } from '../../src/lib/render/elements.js';

export { createElement, createFromKey, scrollYHref };

export const W = 1200;
export const X = 80; // page margin
export const CW = W - X * 2; // content width

// ---------------------------------------------------------------- building blocks

export const at = (x, y, w, h) => ({ x, y, ...(w && { w }), ...(h && { h }) });
export const text = (preset, box, t, style = {}) => createFromKey(`text:${preset}`, { ...box, props: { text: t }, style });
export const button = (preset, box, t, style = {}, props = {}) => createFromKey(`button:${preset}`, { ...box, props: { text: t, ...props }, style });
export const icon = (name, box, color, style = {}, preset = 'iconPlain', props = {}) =>
  createFromKey(`button:${preset}`, { ...box, props: { icon: name, iconColor: color, label: '', ...props }, style });
export const box = (b, style) => createElement('box', { ...b, style });
export const line = (b, color, lineWidth = 1) => createElement('divider', { ...b, style: { color, lineWidth } });
export const shape = (kind, b, style = {}, props = {}) => createFromKey(`shape:${kind}`, { ...b, style, props: { shadow: false, texture: false, rim: 0, ...props } });
export const photo = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
export const image = (b, seed, alt, style = {}) =>
  createElement('image', { ...b, props: { src: photo(seed, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style });
/** A shape filled with a placeholder photo, framed from its known natural size. */
export const photoShape = (kind, b, seed, extra = {}) =>
  shape(kind, b, { background: '#e7e5e4' }, { src: photo(seed, 800, 1000), imgW: 800, imgH: 1000, alt: 'Ảnh minh hoạ', ...extra });
/** Placeholder links for the social icons: the user swaps in their own account. */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/tentaikhoan',
  zaloApp: 'https://zalo.me/0901234567',
  threads: 'https://www.threads.com/@tentaikhoan',
  instagram: 'https://www.instagram.com/tentaikhoan',
  tiktok: 'https://www.tiktok.com/@tentaikhoan',
  linkedin: 'https://www.linkedin.com/in/tentaikhoan',
  github: 'https://github.com/tentaikhoan',
  mail: 'mailto:hello@example.com',
};
export const socials = (x, y, color, size = 44, gap = 12, names = ['facebook', 'zaloApp', 'threads', 'instagram']) =>
  names.map((n, i) => {
    const href = SOCIAL_LINKS[n];
    return icon(n, at(x + i * (size + gap), y, size, size), color, {}, 'iconPlain', href ? { href, newTab: !href.startsWith('mailto:') } : {});
  });
/** The contact icons every template carries: Facebook, Zalo, Threads. */
export const contactIcons = (x, y, color, size = 32, gap = 10) => socials(x, y, color, size, gap, ['facebook', 'zaloApp', 'threads']);
/** Left edge that ends `count` icons of `size` with `gap` between them at `right`. */
export const rightAligned = (right, count = 3, size = 32, gap = 10) => right - (count * size + (count - 1) * gap);
/** Left edge that centres `count` items of `size` with `gap` between them. */
export const centred = (count, size, gap) => (W - (count * size + (count - 1) * gap)) / 2;

/** Small caps label + big title (+ optional intro), left or centred. Returns [elements, bottomY]. */
export function sectionHead(y, label, title, { color, labelColor, intro, introColor, align = 'left', font } = {}) {
  const els = [
    text('label', at(X, y, CW, 22), label, { color: labelColor, textAlign: align }),
    text('heading', at(X, y + 30, CW, 54), title, { color, fontSize: 40, textAlign: align, ...(font && { fontFamily: font }) }),
  ];
  let bottom = y + 96;
  if (intro) {
    const w = align === 'center' ? 720 : 640;
    els.push(text('paragraph', at(align === 'center' ? (W - w) / 2 : X, bottom, w, 56), intro, { color: introColor, textAlign: align, fontSize: 17 }));
    bottom += 70;
  }
  return [els, bottom];
}

/** Three evenly spaced columns across the content width. */
export const col3 = (i, gap = 40) => {
  const w = (CW - gap * 2) / 3;
  return { x: X + i * (w + gap), w };
};

// ---------------------------------------------------------------- slide-deck portfolios (src/assets/tl)
// Each reference is a 9-slide deck, condensed here into one screen (1200 × 800): the deck's look — its
// giant type, photos over the title, colours and doodles — with the essentials of every slide.

export const SH = 800; // the one screen
/** A picsum photo (fixed id) cropped to the box; `gray` for black-and-white decks. */
export const pic = (id, b, { gray = false, ...style } = {}) =>
  createElement('image', {
    ...b,
    props: { src: `https://picsum.photos/id/${id}/${Math.round(b.w * 1.5)}/${Math.round(b.h * 1.5)}${gray ? '?grayscale' : ''}`, alt: 'Ảnh minh hoạ', fit: 'cover' },
    style: { radius: 0, ...style },
  });
export const fill = (b, background, extra = {}) => box(b, { background, radius: 0, ...extra });
/** Display type: Anton has a single weight; other fonts are set extra bold. */
export const big = (b, t, color, font, fontSize, extra = {}) =>
  text('title', b, t, { color, fontFamily: font, fontSize, fontWeight: font === 'anton' ? 400 : 800, lineHeight: 1.15, letterSpacing: 0, ...extra });
export const para = (b, t, color, extra = {}) => text('paragraph', b, t, { color, fontSize: 14, lineHeight: 1.6, ...extra });
export const tag = (b, t, color, extra = {}) => text('caption', b, t, { color, fontSize: 12, fontWeight: 700, letterSpacing: 1, ...extra });
export const bullets = (b, items, color, extra = {}) => text('list', b, items.map((s) => `•  ${s}`).join('\n'), { color, fontSize: 13, lineHeight: 1.7, ...extra });
/** A decoration (hand-drawn arrow, brush stroke, ink blot…) in the given colour. */
export const doodle = (key, b, color, props = {}, style = {}) => createFromKey(`decor:${key}`, { ...b, props: { color, ...props }, style });
export const onePage = (name, description, title, background, elements) => ({ name, description, page: { title, width: W, height: SH, background }, elements });
export const LOREM = 'Mình yêu thích kể chuyện bằng hình ảnh, luôn bắt đầu từ việc lắng nghe khách hàng và kết thúc bằng những sản phẩm gọn gàng, có cá tính.';
export const LOREM2 = 'Hơn 5 năm làm việc cùng các thương hiệu thời trang, F&B và giáo dục, từ ý tưởng, chụp ảnh đến triển khai trên mạng xã hội.';
/** Photo with a caption under it (project thumbnails). */
export const shot = (id, b, caption, color, opts = {}) => [pic(id, b, opts), tag(at(b.x, b.y + b.h + 8, b.w, 18), caption, color, { fontSize: 11 })];

// ---------------------------------------------------------------- 10: spinning record (music artist)

/** Gives an element a looping motion (see motion.js). */
export const moving = (el, kind, duration, delay = 0, reverse = false) => ({ ...el, motion: { kind, duration, delay, reverse } });

// ---------------------------------------------------------------- 11: meme / early-2000s homepage (ugly on purpose)

/** Left edge that centres `count` items of `size` with `gap` inside a column from `x`, `width` wide. */
export const centredIn = (x, width, count, size, gap) => Math.round(x + (width - (count * size + (count - 1) * gap)) / 2);

// ---------------------------------------------------------------- 12: a cat's profile (one screen)

/** An Unsplash photo cropped to w × h (placeholders the user swaps for their own pet). */
export const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
