import { at, text, button, icon, box, shape, contactIcons, rightAligned, tag, onePage, moving, unsplash, createElement } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 17;


export default function catProfile() {
  const cream = '#fff6ea';
  const peach = '#ffd9b8';
  const orange = '#f0802f';
  const brown = '#4a3222';
  const soft = '#8a6a55';
  const pink = '#f6a5b5';
  const hand = 'mali'; // round, handwritten-looking
  const round = 'baloo';
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  const note = (b, t, color, extra = {}) => text('paragraph', b, t, { color, fontFamily: hand, fontSize: 16, lineHeight: 1.55, ...extra });
  const card = (b, extra = {}) => box(b, { background: '#ffffff', radius: 22, shadow: 'md', ...extra });
  /** A polaroid: white frame, photo, handwritten caption, all at the same slant. */
  const polaroid = (x, y, id, caption, deg) => [
    tilt(card(at(x, y, 170, 168), { radius: 6 }), deg),
    tilt(createElement('image', { ...at(x + 10, y + 10, 150, 118), props: { src: unsplash(id, 300, 236), alt: 'Ảnh mèo', fit: 'cover' }, style: { radius: 2 } }), deg),
    tilt(note(at(x + 6, y + 132, 158, 28), caption, brown, { fontSize: 15, textAlign: 'center' }), deg),
  ];
  const paw = (b, deg, delay) => moving(tilt(text('paragraph', b, '🐾', { fontSize: Math.round(b.w * 0.8), textAlign: 'center', lineHeight: 1 }), deg), 'float', 3, delay);

  return onePage('Thú cưng – Hồ sơ Boss mèo', '1 màn hình: trang riêng cho bé mèo – ảnh vòm, thẻ thông tin, thích / ghét, ảnh polaroid, số của sen khi bé đi lạc', 'Mít – Hồ sơ Boss mèo', cream, [
    // Right: the star of the page.
    shape('blob', at(640, 30, 540, 540), { background: peach }, { seed: 7 }),
    shape('arch', at(700, 70, 400, 470), { background: '#f3e3d3' }, { src: unsplash('1518791841217-8f162f1e1131', 800, 1000), imgW: 800, imgH: 1000, alt: 'Ảnh của Mít' }),
    moving(tilt(button('primary', at(640, 96, 150, 54), 'Meo~ 😽', { background: '#ffffff', color: brown, fontFamily: hand, fontSize: 20, fontWeight: 700, radius: 999, shadow: 'md' }), -8), 'float', 2.6),
    moving(icon('heart', at(1090, 70, 54, 54), '#ffffff', { background: pink, radius: 999 }, 'iconPlain', { iconSize: 55 }), 'heartbeat', 1.4),
    paw(at(1110, 440, 46, 46), 20, 0),
    paw(at(596, 470, 38, 38), -15, 1),
    paw(at(560, 40, 34, 34), 10, 0.5),

    // Polaroids.
    ...polaroid(640, 590, '1495360010541-f48722b34f7d', 'Ngồi canh cầu thang', -6),
    ...polaroid(820, 606, '1574158622682-e40e69881006', 'Nhìn gì đấy sen?', 3),
    ...polaroid(1000, 588, '1518791841217-8f162f1e1131', 'Ngủ ca 3 trong ngày', -3),

    // Left: who.
    tag(at(48, 42, 400, 20), 'HỒ SƠ BOSS MÈO', orange, { fontSize: 13, letterSpacing: 4 }),
    note(at(48, 74, 400, 34), 'Xin chào, tui là', soft, { fontSize: 24 }),
    tilt(text('title', at(40, 100, 420, 140), 'MÍT', { color: orange, fontFamily: round, fontSize: 132, fontWeight: 800, lineHeight: 1, letterSpacing: 2 }), -3),
    note(at(48, 242, 520, 80), 'Boss mèo mướp 3 tuổi, chuyên gia ngủ trưa và phá hộp giấy. Sen của tui dựng trang này để khoe tui với cả thế giới.', brown, { fontSize: 17 }),

    // Profile card.
    card(at(40, 334, 540, 176)),
    text('subheading', at(66, 352, 300, 30), 'Thông tin cơ bản', { color: brown, fontFamily: round, fontSize: 20, fontWeight: 700 }),
    note(at(66, 390, 250, 110), '🎂  Sinh nhật: 12/05/2023\n⚖️  Cân nặng: 4,2 kg\n🐱  Giống: Mèo mướp', brown, { fontSize: 15, lineHeight: 1.75 }),
    note(at(320, 390, 250, 110), '💉  Tiêm phòng: Đủ\n🏠  Ở: Hà Nội\n😴  Ngủ: ~16 tiếng/ngày', brown, { fontSize: 15, lineHeight: 1.75 }),

    // Likes and dislikes.
    card(at(40, 528, 262, 176), { background: '#fff0e0' }),
    text('subheading', at(62, 544, 220, 30), '💛 Tui thích', { color: orange, fontFamily: round, fontSize: 19, fontWeight: 700 }),
    note(at(62, 580, 230, 116), '• Pate cá ngừ\n• Hộp giấy (mọi cỡ)\n• Nắng buổi sáng\n• Được gãi cằm', brown, { fontSize: 15, lineHeight: 1.65 }),
    card(at(318, 528, 262, 176), { background: '#fde8ec' }),
    text('subheading', at(340, 544, 220, 30), '💢 Tui ghét', { color: '#d9536f', fontFamily: round, fontSize: 19, fontWeight: 700 }),
    note(at(340, 580, 230, 116), '• Bị tắm\n• Máy hút bụi\n• Bát cơm lưng lưng\n• Bị gọi dậy', brown, { fontSize: 15, lineHeight: 1.65 }),

    // If found.
    note(at(48, 722, 340, 26), 'Thấy tui đi lạc? Gọi sen giúp nha:', soft, { fontSize: 15 }),
    text('subheading', at(48, 746, 300, 34), '📞 0901 234 567', { color: brown, fontFamily: round, fontSize: 22, fontWeight: 700 }),
    ...contactIcons(rightAligned(580, 3, 34, 10), 740, brown, 34, 10),
  ]);
}
