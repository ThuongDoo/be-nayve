import { W, at, text, button, box, socials, pic, fill, doodle, onePage, moving, centredIn } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 16;


export default function memeHome() {
  const yellow = '#fff200';
  const red = '#ff1f1f';
  const blue = '#1e3cff';
  const lime = '#39ff14';
  const magenta = '#ff00e6';
  const ink = '#111111';
  const comic = 'pangolin'; // the Comic Sans of this template
  // No yellow in it: it would vanish into the page.
  const rainbow = 'linear-gradient(90deg, #ff1f1f 0%, #ff00e6 30%, #1e3cff 60%, #00a650 100%)';
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  const say = (b, t, color, extra = {}) => text('paragraph', b, t, { color, fontFamily: comic, fontSize: 18, lineHeight: 1.35, ...extra });
  const sticker = (b, t, bg, color, deg, motionKind, dur) =>
    moving(tilt(button('primary', b, t, { background: bg, color, fontFamily: 'bangers', fontSize: 26, radius: 999, borderWidth: 3, borderColor: ink, shadow: 'none', letterSpacing: 1 }), deg), motionKind, dur);
  const winButton = (b, t) =>
    button('primary', b, t, { background: '#c0c0c0', color: ink, fontFamily: 'roboto', fontSize: 14, radius: 0, borderWidth: 2, borderColor: '#404040', shadow: 'none' }, { href: 'https://zalo.me/0901234567', newTab: true });

  return onePage('Meme – Trang chủ cợt nhả', '1 màn hình: phong cách web năm 2005, cố tình xấu – chữ WordArt cầu vồng, ảnh meme, hộp thoại lỗi, bộ đếm lượt xem', 'Tuấn Đẹp Trai – Trang chủ chính thức', yellow, [
    // A blinking banner, like it's 2005.
    fill(at(0, 0, W, 44), red),
    moving(say(at(0, 8, W, 30), '⚠️ TRANG WEB ĐANG XÂY DỰNG TỪ NĂM 2019 – VUI LÒNG QUAY LẠI SAU (HOẶC ĐỪNG) ⚠️', yellow, { fontSize: 20, fontWeight: 700, textAlign: 'center' }), 'blink', 1.2),

    // WordArt title.
    tilt(say(at(40, 58, 520, 34), 'Xin chào, tôi là', blue, { fontSize: 28, fontWeight: 700 }), -3),
    moving(tilt(text('title', at(36, 104, 340, 176),'TUẤN\nĐẸP TRAI', { color: rainbow, fontFamily: 'bangers', fontSize: 92, lineHeight: 0.95, letterSpacing: 3 }), -5), 'swing', 3),
    tilt(say(at(370, 214, 220, 30), '(đẹp trai là tên thật)', ink, { fontSize: 15, italic: true }), 6),
    say(at(40, 298, 560, 56), 'Lập trình viên kiêm chuyên gia tắt cam khi họp. Code chạy được nhưng đừng hỏi tại sao.', ink, { fontSize: 19 }),

    // Meme: caption bar + pug.
    tilt(box(at(690, 70, 440, 420), { background: '#ffffff', radius: 0, borderWidth: 4, borderColor: ink, shadow: 'lg' }), 2),
    tilt(text('paragraph', at(706, 84, 408, 84), 'Khi sếp bảo "sửa nhẹ thôi em, 5 phút là xong":', { color: ink, fontFamily: 'roboto', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }), 2),
    tilt(pic(1025, at(714, 172, 392, 300)), 2),
    tilt(text('title', at(714, 408, 392, 60), 'OK SẾP 🙂', { color: '#ffffff', fontFamily: 'anton', fontSize: 44, textAlign: 'center', letterSpacing: 2 }), 2),

    // Stickers.
    sticker(at(1040, 36, 140, 64), 'HOT!!! 🔥', red, yellow, 12, 'pulse', 0.8),
    sticker(at(610, 470, 150, 60), 'MỚI 100%', lime, ink, -10, 'heartbeat', 1.2),
    moving(say(at(560, 90, 80, 80), '😂', ink, { fontSize: 64, textAlign: 'center' }), 'spin', 3),
    moving(say(at(1110, 470, 70, 70), '💯', ink, { fontSize: 52, textAlign: 'center' }), 'bounce', 1.3),
    moving(doodle('sparkle', at(640, 250, 50, 50), magenta, { seed: 5 }), 'spin', 4),

    // Skills nobody asked for.
    tilt(text('title', at(40, 356, 400, 44), 'KỸ NĂNG ĐẶC BIỆT:', { color: magenta, fontFamily: 'bangers', fontSize: 38, letterSpacing: 2 }), -2),
    ...[
      ['Ngủ nướng', 100, red],
      ['Làm deadline lúc 3h sáng', 99, blue],
      ['Họp mà tắt cam', 100, '#22c55e'],
      ['Hiểu code mình viết tuần trước', 7, '#ff9900'],
    ].flatMap(([name, pct, color], k) => {
      const y = 410 + k * 50;
      return [
        say(at(40, y, 300, 24), name, ink, { fontSize: 17, fontWeight: 700 }),
        box(at(40, y + 26, 340, 16), { background: '#ffffff', radius: 0, borderWidth: 2, borderColor: ink }),
        box(at(42, y + 28, Math.max(8, Math.round(3.36 * pct)), 12), { background: color, radius: 0 }),
        say(at(390, y + 18, 80, 28), `${pct}%`, color, { fontSize: 20, fontWeight: 700 }),
      ];
    }),

    // Fake Windows 98 error.
    box(at(490, 560, 360, 176), { background: '#c0c0c0', radius: 0, borderWidth: 3, borderColor: '#ffffff', shadow: 'md' }),
    box(at(494, 564, 352, 30), { background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)', radius: 0 }),
    text('paragraph', at(504, 568, 280, 24), 'Loi.exe', { color: '#ffffff', fontFamily: 'roboto', fontSize: 15, fontWeight: 700 }),
    box(at(818, 568, 22, 20), { background: '#c0c0c0', radius: 0, borderWidth: 2, borderColor: '#ffffff' }),
    text('paragraph', at(818, 566, 22, 22), '×', { color: ink, fontFamily: 'roboto', fontSize: 16, fontWeight: 700, textAlign: 'center' }),
    say(at(510, 604, 60, 50), '⛔', ink, { fontSize: 34 }),
    text('paragraph', at(566, 606, 270, 64), 'Tuấn đã ngừng hoạt động.\nLý do: đói. Vui lòng gửi trà sữa.', { color: ink, fontFamily: 'roboto', fontSize: 15, lineHeight: 1.45 }),
    winButton(at(600, 684, 96, 34), 'OK'),
    winButton(at(708, 684, 120, 34), 'Cũng OK'),

    // Clickbait button + arrow + begging.
    moving(
      button('primary', at(40, 624, 380, 64), 'BẤM VÀO ĐÂY ĐỂ NHẬN IPHONE 📱', { background: 'linear-gradient(90deg, #39ff14 0%, #ff00e6 100%)', color: ink, fontFamily: 'bangers', fontSize: 26, radius: 6, borderWidth: 4, borderStyle: 'dashed', borderColor: red, shadow: 'none', letterSpacing: 1 }, { href: 'https://www.facebook.com/tentaikhoan', newTab: true }),
      'shake',
      0.6,
    ),
    say(at(40, 694, 380, 26), '(không có iPhone đâu, nhưng có tôi 👉👈)', blue, { fontSize: 15 }),
    doodle('arrow', at(420, 610, 70, 60), red, { strokeWidth: 4, seed: 9 }),

    // Visitor counter and contact.
    box(at(880, 540, 290, 90), { background: ink, radius: 0, borderWidth: 3, borderColor: lime }),
    text('paragraph', at(890, 548, 270, 22), 'BẠN LÀ NGƯỜI THỨ', { color: lime, fontFamily: 'vt323', fontSize: 20, textAlign: 'center' }),
    moving(text('title', at(890, 570, 270, 50), '000069', { color: lime, fontFamily: 'vt323', fontSize: 48, textAlign: 'center', letterSpacing: 6 }), 'blink', 2),
    say(at(880, 642, 290, 24), 'Liên hệ (tôi rep chậm nha):', ink, { fontSize: 16, fontWeight: 700, textAlign: 'center' }),
    ...socials(centredIn(880, 290, 4, 38, 12), 676, ink, 38, 12, ['facebook', 'zaloApp', 'threads', 'tiktok']),
    say(at(880, 724, 290, 60), 'Website tối ưu cho Internet Explorer 6, độ phân giải 800×600', '#6b6b00', { fontSize: 12, textAlign: 'center' }),
  ]);
}
