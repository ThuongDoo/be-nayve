import { at, button, icon, box, shape, socials, big, para, tag, onePage, moving, createFromKey } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 15;


export default function musicDisc() {
  const bg = '#0c0a1d';
  const pink = '#f472b6';
  const violet = '#a78bfa';
  const soft = '#c4b5fd';
  const grad = `linear-gradient(135deg, ${pink} 0%, ${violet} 100%)`;
  const f = 'anton';
  // The record: centre, diameter, one turn every SPIN seconds.
  const cx = 820;
  const cy = 390;
  const D = 420;
  const SPIN = 8;
  const round = (d, style) => box(at(cx - d / 2, cy - d / 2, d, d), { radius: 999, ...style });
  // Vinyl grooves: rings of slightly lighter black, out from the label.
  const grooves = [];
  for (let p = 34; p <= 70; p += 3) grooves.push(`#141218 ${p}%`, `#26232e ${p + 1}%`, `#141218 ${p + 2}%`);
  const vinyl = `radial-gradient(circle, #141218 0%, ${grooves.join(', ')}, #141218 71%)`;

  return onePage('Âm nhạc – Đĩa than xoay', '1 màn hình: đĩa than có avatar xoay tròn, sóng nhạc (thành phần Âm thanh) nhảy quanh đĩa và sóng âm toả ra', 'Minh Khang – Ca sĩ & Producer', bg, [
    // Glow behind the record and sound rings spreading out from it.
    round(640, { background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(12, 10, 29, 0) 70%)' }),
    ...[0, 1, 2].map((k) => moving(round(D + 20, { borderWidth: 3, borderColor: k === 1 ? violet : pink, background: 'rgba(244, 114, 182, 0.06)' }), 'ripple', 3, k)),
    // The record and its label spin; the avatar sits on the label.
    moving(round(D, { background: vinyl, shadow: 'lg' }), 'spin', SPIN),
    moving(round(190, { background: grad }), 'spin', SPIN),
    moving(shape('circle', at(cx - 80, cy - 80, 160, 160), { background: '#1f1b2e' }, { src: 'https://picsum.photos/id/64/600/600', imgW: 600, imgH: 600, alt: 'Ảnh đại diện' }), 'spin', SPIN),
    // Light on the vinyl stays put while it turns.
    round(D, { background: 'linear-gradient(135deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.12) 48%, rgba(255, 255, 255, 0) 62%)' }),
    // The music: an audio element whose round visualizer hugs the record. It dances to a steady beat
    // until the user uploads their song; then its play button sits on the avatar.
    createFromKey('audio:circle', {
      ...at(cx - 340, cy - 340, 680, 680),
      props: { color: pink, color2: violet, bars: 72, inner: 33, always: true, loop: true, autoplay: false, name: '' },
    }),
    // Tone arm resting on the edge of the record.
    box(at(1068, 118, 56, 56), { radius: 999, background: 'linear-gradient(135deg, #e5e7eb 0%, #6b7280 100%)', shadow: 'md' }),
    { ...box(at(1014, 170, 10, 250), { radius: 5, background: 'linear-gradient(90deg, #d1d5db 0%, #9ca3af 100%)' }), rotation: 24 },
    { ...box(at(950, 394, 28, 44), { radius: 6, background: '#d1d5db', shadow: 'md' }), rotation: 24 },
    // Now playing, under the record.
    icon('music', at(cx - 118, 742, 22, 22), pink, { background: 'transparent' }, 'iconPlain', { iconSize: 100 }),
    tag(at(cx - 90, 744, 300, 20), 'ĐANG PHÁT · "ĐÊM THÀNH PHỐ"', soft, { fontSize: 13, letterSpacing: 2 }),
    box(at(cx - 118, 776, 236, 4), { radius: 2, background: '#2e2a45' }),
    box(at(cx - 118, 776, 96, 4), { radius: 2, background: grad }),

    // Artist, on the left.
    moving(icon('music', at(70, 70, 40, 40), '#ffffff', { background: grad, radius: 999 }, 'iconPlain', { iconSize: 55 }), 'pulse', 1.2),
    tag(at(124, 80, 300, 20), 'NOW PLAYING', pink, { fontSize: 14, letterSpacing: 4 }),
    big(at(70, 140, 520, 220), 'MINH\nKHANG','#ffffff', f, 110, { lineHeight: 1 }),
    para(at(70, 370, 480, 34), 'Ca sĩ · Nhạc sĩ · Producer', soft, { fontSize: 22 }),
    para(at(70, 414, 440, 76), 'Mình viết những bản nhạc về thành phố về đêm, những chuyến xe muộn và các cuộc trò chuyện chưa kịp nói hết.', '#a5a1c2', { fontSize: 15 }),
    ...[['12', 'bài hát'], ['2', 'album'], ['1,2 triệu', 'lượt nghe']].flatMap(([n, cap], k) => [
      big(at(70 + k * 150, 510, 140, 44), n, '#ffffff', f, 34),
      tag(at(70 + k * 150, 556, 140, 18), cap.toUpperCase(), '#8b86ad', { fontSize: 11, letterSpacing: 2 }),
    ]),
    button('gradient', at(70, 610, 180, 52), 'Nghe nhạc', { background: grad, fontSize: 15 }, { href: 'https://www.youtube.com/', newTab: true }),
    button('outline', at(266, 610, 210, 52), 'Mời biểu diễn', { radius: 999, color: '#e9d5ff', borderColor: '#e9d5ff', fontSize: 15 }, { href: 'mailto:booking@minhkhang.vn' }),
    para(at(70, 694, 440, 22), 'booking@minhkhang.vn · 0901 234 567', '#8b86ad', { fontSize: 13 }),
    ...socials(70, 728, '#e9d5ff', 34, 12, ['facebook', 'zaloApp', 'threads', 'tiktok']),
  ]);
}
