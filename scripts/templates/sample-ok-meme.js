import { at, text, button, box, shape, contactIcons, doodle, onePage, moving } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 18;

// ---------------------------------------------------------------- 13: "everything's fine 👍" meme (manga halftone)

export default function okMeme() {
  const mint = '#9fbeb6';
  const pink = '#f4b9c8';
  const blush = '#e8859f';
  const ink = '#161b1b';
  const hand = 'mali';
  const comic = 'bangers';
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  const panel = (b, background, extra = {}) => box(b, { background, radius: 0, borderWidth: 4, borderColor: ink, ...extra });
  // Manga rain / speed lines: thin dark strokes at a steep slant, lengths and weights varied (seeded, so stable).
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const streaks = Array.from({ length: 46 }, () => {
    const h = Math.round(120 + rand() * 320);
    const w = rand() < 0.25 ? 5 : rand() < 0.6 ? 3 : 2;
    return tilt(box(at(Math.round(rand() * 1240 - 40), Math.round(rand() * 900 - 160), w, h), { background: ink, radius: 0, opacity: Math.round((0.25 + rand() * 0.45) * 100) / 100 }), 18);
  });
  const status = (k, icon, what, verdict) => {
    const y = 438 + k * 62;
    const deg = k % 2 ? 1 : -1;
    return [
      tilt(panel(at(40, y, 560, 52), '#ffffff', { borderWidth: 3 }), deg),
      tilt(text('paragraph', at(58, y + 12, 400, 30), `${icon}  ${what}`, { color: ink, fontFamily: hand, fontSize: 17, fontWeight: 700 }), deg),
      tilt(button('primary', at(470, y + 9, 116, 34), verdict, { background: pink, color: ink, fontFamily: comic, fontSize: 20, radius: 999, borderWidth: 3, borderColor: ink, shadow: 'none', letterSpacing: 1 }), deg),
    ];
  };

  return onePage('Meme – Mọi thứ đều ổn 👍', '1 màn hình: phong cách truyện tranh – chấm lưới, vệt mưa, thỏ hồng giơ ngón cái; thả ảnh meme của bạn vào khung hồng', 'Mọi thứ đều ổn 👍', mint, [
    // Halftone and rain behind everything.
    doodle('dots', at(640, 0, 560, 800), ink, { spacing: 11, dotSize: 1.6 }, { opacity: 0.45 }),
    doodle('dots', at(0, 600, 620, 200), ink, { spacing: 11, dotSize: 1.6 }, { opacity: 0.3 }),
    ...streaks,

    // The meme spot: a pink blob with a thick outline and a big thumbs up (drop the meme picture onto the shape).
    shape('blob', at(660, 90, 500, 560), { background: pink }, { seed: 23, rim: 7, rimColor: ink }),
    doodle('dots', at(700, 380, 180, 200), ink, { spacing: 8, dotSize: 1.4 }, { opacity: 0.35 }),
    moving(tilt(text('title', at(760, 200, 300, 300), '👍', { fontSize: 220, textAlign: 'center', lineHeight: 1 }), -8), 'bounce', 1.8),
    tilt(box(at(780, 470, 60, 18), { background: blush, radius: 999, opacity: 0.8 }), -8),
    tilt(box(at(990, 470, 60, 18), { background: blush, radius: 999, opacity: 0.8 }), -8),
    tilt(panel(at(900, 60, 250, 64), '#ffffff', { radius: 999, borderWidth: 4 }), 6),
    tilt(text('title', at(906, 72, 238, 42), 'ỔN MÀ 👍', { color: ink, fontFamily: comic, fontSize: 34, textAlign: 'center', letterSpacing: 2 }), 6),

    // Comic title panel.
    tilt(panel(at(40, 60, 560, 236), pink, { borderWidth: 5, shadow: 'lg' }), -2),
    tilt(text('label', at(62, 76, 300, 22), 'TRẠM ỔN ÁP · EST. 2026', { color: ink, fontSize: 13, letterSpacing: 3 }), -2),
    tilt(text('title', at(56, 100, 540, 190), 'MỌI THỨ\nĐỀU ỔN 👍', { color: ink, fontFamily: comic, fontSize: 90, lineHeight: 0.98, letterSpacing: 3 }), -2),

    // Speech bubble.
    tilt(panel(at(60, 318, 520, 92), '#ffffff', { radius: 28 }), 1),
    tilt(text('paragraph', at(84, 332, 480, 66), 'Deadline dí? Ổn. Lương chưa về? Ổn.\nCrush xem mà không rep? …Cũng ổn.', { color: ink, fontFamily: hand, fontSize: 18, lineHeight: 1.5 }), 1),

    // Today's status.
    ...status(0, '⏰', 'Deadline: dí sát gáy', 'ỔN 👍'),
    ...status(1, '💸', 'Ví tiền: 12.000đ', 'ỔN 👍'),
    ...status(2, '😴', 'Ngủ: 4 tiếng', 'ỔN 👍'),
    ...status(3, '📱', 'Crush: đã xem', '…ỔN 👍'),

    // Bottom.
    moving(button('primary', at(40, 700, 300, 60), 'BẤM ĐỂ ĐƯỢC KHEN 👍', { background: ink, color: pink, fontFamily: comic, fontSize: 26, radius: 999, shadow: 'none', letterSpacing: 1 }, { href: 'https://www.facebook.com/tentaikhoan', newTab: true }), 'pulse', 1.4),
    ...contactIcons(362, 712, ink, 36, 12),
    tilt(panel(at(700, 686, 440, 64), '#ffffff', { borderWidth: 4 }), -1),
    tilt(text('paragraph', at(716, 700, 410, 40), 'Kun Kun · chuyên gia giả vờ ổn', { color: ink, fontFamily: comic, fontSize: 28, textAlign: 'center', letterSpacing: 1 }), -1),
  ]);
}
