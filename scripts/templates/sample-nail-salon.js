import { W, X, CW, at, text, button, icon, box, line, col3, contactIcons, doodle, moving, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 28;

// ---------------------------------------------------------------- nail salon (lilac & nude: capsule photos, polish swatches, stamp card)

export default function nailSalon() {
  const paper = '#faf6f8';
  const nude = '#f2e4dc';
  const lilac = '#b9a3d6';
  const plum = '#5f4b7d';
  const rose = '#d98a9e';
  const ink = '#3d3346';
  const soft = '#7e7287';
  const serif = 'prata';
  const script = 'allura';
  const H = 4580;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 20, ...style } });
  /** A photo rounded at both ends, like a fingernail. */
  const capsule = (b, id, alt) => photo(b, id, alt, { radius: 999, borderWidth: 6, borderColor: '#ffffff', shadow: 'md' });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: serif, fontSize, fontWeight: 400, lineHeight: 1.35, letterSpacing: 0, ...extra });
  /** Gives `word` (inside the element's text) its own colour, like recolouring it in the editor. */
  const tint = (el, word, color = rose) => {
    const start = el.props.text.indexOf(word);
    return start < 0 ? el : { ...el, props: { ...el.props, marks: [{ start, end: start + word.length, color }] } };
  };
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.7, ...extra });
  const label = (b, t, color = rose, extra = {}) => text('label', b, t, { color, letterSpacing: 3, ...extra });
  /** Label + serif title with one word in rose, centred. Returns [elements, bottomY]. */
  const head = (y, kicker, t, word) => [
    [label(at(X, y, CW, 22), kicker, rose, { textAlign: 'center' }), tint(title(at(X, y + 28, CW, 64), t, ink, 42, { textAlign: 'center' }), word)],
    y + 116,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: plum, color: '#ffffff', fontWeight: 600, radius: 999, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = plum) =>
    button('outline', b, t, { color, borderColor: color, radius: 999, fontWeight: 600 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const COLORS = 800;
  const PRICES = 1340;
  const GALLERY = 2180;
  const BOOKING = 4000;

  // Menu.
  els.push(
    text('title', at(X, 18, 300, 64), 'Lumi Nails', { color: plum, fontFamily: script, fontSize: 52, fontWeight: 400, lineHeight: 1.3 }),
    ...[
      ['Bảng màu', COLORS, 90],
      ['Bảng giá', PRICES, 84],
      ['Mẫu nail', GALLERY, 84],
    ].map(([t, y, w], i, all) => {
      const right = 940 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 18, 0);
      return button('link', at(right - w, 36, w, 30), t, { color: ink, underline: false, fontSize: 15, fontWeight: 500, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(964, 28, 156, 48), 'Đặt lịch', scrollYHref(BOOKING), { fontSize: 15 }),
  );

  // Hero: words on the left, three nail-shaped photos on the right.
  els.push(
    doodle('watercolor', at(620, 120, 520, 520), lilac, { seed: 12, blend: true }, { opacity: 0.45 }),
    capsule(at(650, 170, 150, 430), '1610992015732-2449b76344bc', 'Móng màu nude'),
    capsule(at(820, 120, 150, 500), '1604902396830-aca29e19b067', 'Móng hồng trên nền hồng'),
    capsule(at(990, 210, 150, 430), '1599206676335-193c82b13c9e', 'Đôi tay sơn hồng nhạt'),
    moving(doodle('sparkle', at(1110, 140, 46, 46), rose, { seed: 2 }), 'pulse', 2.4),
    text('paragraph', at(700, 650, 380, 50), 'made with love', { color: rose, fontFamily: script, fontSize: 40, textAlign: 'center', lineHeight: 1.2 }),

    label(at(X, 180, 500, 22), 'NAIL STUDIO · ĐÀ NẴNG'),
    tint(title(at(X, 214, 540, 170), 'Đôi tay xinh,\ntự tin cả ngày', ink, 60, { lineHeight: 1.3 }), 'tự tin'),
    para(at(X, 404, 470, 84), 'Sơn gel, đắp bột, úp móng và vẽ nail theo yêu cầu. Thợ tay nghề cao, dụng cụ hấp tiệt trùng sau mỗi khách.', soft, { fontSize: 17 }),
    solid(at(X, 512, 190, 56), 'Đặt lịch ngay', scrollYHref(BOOKING), { fontSize: 16 }),
    outline(at(X + 206, 512, 170, 56), 'Xem bảng giá', scrollYHref(PRICES)),
    text('paragraph', at(X, 604, 520, 26), '✓ Dụng cụ hấp tiệt trùng     ✓ Sơn gel chính hãng', { color: plum, fontSize: 14, fontWeight: 600 }),
  );

  // Polish swatches of the season.
  els.push(box(at(0, COLORS, W, 360), { background: nude, radius: 0 }));
  let [h, y] = head(COLORS + 50, 'BẢNG MÀU', 'Màu sơn được chọn nhiều mùa này', 'mùa này');
  els.push(...h);
  ;[
    ['#f4c7c3', 'Hồng sữa'],
    ['#d9b8a3', 'Nude cát'],
    ['#b9a3d6', 'Tím khói'],
    ['#7b1e33', 'Đỏ rượu vang'],
    ['#a8dcc8', 'Xanh bạc hà'],
    ['#efe3d6', 'Be sữa'],
    ['#f6a77f', 'Cam đào'],
    ['#1f1b24', 'Đen bóng'],
  ].forEach(([color, name], i) => {
    const size = 84;
    const x = 110 + i * (size + 44);
    els.push(
      box(at(x, y + 20, size, size), { background: color, radius: 999, shadow: 'md', borderWidth: 4, borderColor: '#ffffff' }),
      // A soft highlight, like light on wet polish.
      { ...box(at(x + 20, y + 32, 24, 14), { background: 'rgba(255,255,255,0.55)', radius: 999 }), rotation: -30 },
      text('caption', at(x - 22, y + 116, size + 44, 22), name, { color: ink, fontSize: 13, fontWeight: 600, textAlign: 'center' }),
    );
  });

  // Prices: four cards.
  ;[h, y] = head(PRICES, 'BẢNG GIÁ', 'Chăm chút từng ngón tay', 'từng ngón tay');
  els.push(...h);
  ;[
    ['sparkles', 'Tay', [['Cắt da, dũa form', '60K'], ['Sơn thường', '80K'], ['Sơn gel', '150K'], ['Sơn gel + dưỡng', '200K']]],
    ['leaf', 'Chân', [['Cắt da, dũa form', '70K'], ['Sơn gel chân', '170K'], ['Ngâm chân thảo mộc', '120K'], ['Chà gót, massage', '150K']]],
    ['star', 'Đắp & úp móng', [['Úp móng giả', '250K'], ['Đắp gel', '350K'], ['Đắp bột', '380K'], ['Tháo móng cũ', '50K']]],
    ['heart', 'Nail art', [['Vẽ hoạ tiết / ngón', 'từ 20K'], ['Tráng gương, mắt mèo', '50K'], ['Đính đá / ngón', 'từ 15K'], ['Mẫu theo ảnh', 'báo giá']]],
  ].forEach(([ic, group, items], i) => {
    const w = (CW - 32) / 2;
    const x = X + (i % 2) * (w + 32);
    const top = y + 30 + Math.floor(i / 2) * 330;
    els.push(
      box(at(x, top, w, 300), { background: '#ffffff', radius: 24, shadow: 'sm' }),
      icon(ic, at(x + 32, top + 30, 48, 48), plum, { background: '#efe8f7', radius: 999 }, 'icon', { iconSize: 48 }),
      title(at(x + 96, top + 32, w - 130, 46), group, ink, 28),
    );
    items.forEach(([name, price], j) => {
      const row = top + 104 + j * 46;
      els.push(
        text('paragraph', at(x + 32, row, w - 190, 28), name, { color: ink, fontSize: 16 }),
        text('paragraph', at(x + w - 158, row, 126, 28), price, { color: plum, fontSize: 16, fontWeight: 700, textAlign: 'right' }),
        ...(j < items.length - 1 ? [createElement('divider', { ...at(x + 32, row + 32, w - 64, 10), style: { color: '#eadfe6', lineWidth: 1, lineStyle: 'dashed' } })] : []),
      );
    });
  });

  // Gallery: a staggered grid with a name tag on each photo.
  ;[h, y] = head(GALLERY, 'MẪU NAIL HOT', 'Khách đặt nhiều nhất tuần này', 'nhiều nhất');
  els.push(...h);
  ;[
    ['1587729927069-ef3b7a5ab9b4', at(X, y + 30, 330, 260), 'Nude thạch'],
    ['1612887390768-fb02affea7a6', at(X, y + 310, 330, 200), 'Hồng ombre'],
    ['1519014816548-bf5fe059798b', at(435, y + 30, 330, 180), 'Love đỏ'],
    ['1607779097040-26e80aa78e66', at(435, y + 230, 330, 280), 'Tím mộng mơ'],
    ['1604654894610-df63bc536371', at(790, y + 30, 330, 240), 'Đen tối giản'],
    ['1571290274554-6a2eaa771e5f', at(790, y + 290, 330, 220), 'Vẽ hoạ tiết'],
  ].forEach(([id, b, name]) => {
    els.push(
      photo(b, id, `Mẫu nail ${name.toLowerCase()}`),
      button('pill', at(b.x + 14, b.y + b.h - 50, 130, 36), name, { background: 'rgba(255,255,255,0.92)', color: ink, fontSize: 13, fontWeight: 700 }),
    );
  });

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 2860, W, 380), props: { src: unsplash('1632345031435-8727f6897d53', 1600, 1100), alt: 'Thợ đang làm móng cho khách' }, style: { radius: 0 } }),
    box(at(0, 2860, W, 380), { background: 'rgba(61,51,70,0.5)', radius: 0 }),
    tint(title(at(X, 2960, CW, 120), 'Một giờ chậm lại,\ncho riêng đôi tay của bạn.', '#ffffff', 42, { textAlign: 'center' }), 'đôi tay của bạn', '#f3c6d2'),
  );

  // Stamp card: a membership card, tilted, beside its perks.
  const cardX = X + 20;
  const cardY = 3360;
  els.push(
    { ...box(at(cardX, cardY, 440, 270), { background: 'linear-gradient(135deg, #b9a3d6 0%, #d98a9e 100%)', radius: 24, shadow: 'lg' }), rotation: -6 },
    { ...text('title', at(cardX + 30, cardY + 20, 300, 56), 'Lumi Nails', { color: '#ffffff', fontFamily: script, fontSize: 44, fontWeight: 400, lineHeight: 1.3 }), rotation: -6 },
    { ...label(at(cardX + 34, cardY + 80, 300, 20), 'THẺ THÀNH VIÊN', '#ffffff', { fontSize: 11 }), rotation: -6 },
  );
  for (let k = 0; k < 10; k++) {
    const sx = cardX + 34 + (k % 5) * 76;
    const sy = cardY + 120 + Math.floor(k / 5) * 66;
    const done = k < 4;
    els.push({
      ...button('pill', at(sx, sy, 52, 52), k === 9 ? '🎁' : done ? '✓' : String(k + 1), {
        background: done ? '#ffffff' : 'rgba(255,255,255,0.25)',
        color: done ? plum : '#ffffff',
        fontSize: k === 9 ? 22 : 18,
        fontWeight: 700,
        borderWidth: 2,
        borderColor: '#ffffff',
      }),
      rotation: -6,
    });
  }
  els.push(
    label(at(620, 3360, 500, 22), 'THÀNH VIÊN THÂN THIẾT'),
    tint(title(at(620, 3390, 500, 130), 'Làm 9 lần,\nlần thứ 10 miễn phí', ink, 40), 'miễn phí'),
    text('list', at(620, 3536, 500, 140), '♡  Đóng dấu mỗi lần làm móng, không giới hạn dịch vụ\n♡  Giảm 10% trong tháng sinh nhật\n♡  Ưu tiên giữ lịch cuối tuần\n♡  Dưỡng móng miễn phí khi tháo gel', { color: ink, fontSize: 15, lineHeight: 2 }),
  );

  // Hygiene promises.
  ;[
    ['shield', 'Dụng cụ hấp tiệt trùng', 'Kềm, dũa được hấp sau mỗi khách; dũa giấy dùng một lần.'],
    ['sparkles', 'Sơn chính hãng', 'Sơn gel nhập khẩu, có hoá đơn, không bong tróc sau 3 tuần.'],
    ['heart', 'Nhẹ tay, không đau', 'Không mài mỏng móng thật, cắt da vừa đủ, không chảy máu.'],
  ].forEach(([ic, t, desc], i) => {
    const c = col3(i, 40);
    els.push(
      icon(ic, at(c.x, 3800, 52, 52), '#ffffff', { background: i === 1 ? rose : plum, radius: 999 }, 'icon', { iconSize: 46 }),
      text('subheading', at(c.x + 68, 3800, c.w - 68, 28), t, { color: ink, fontSize: 18, fontWeight: 700 }),
      para(at(c.x + 68, 3832, c.w - 68, 80), desc, soft, { fontSize: 15 }),
    );
  });

  // Booking.
  els.push(
    box(at(X, BOOKING, CW, 400), { background: plum, radius: 32 }),
    capsule(at(X + 820, BOOKING + 40, 170, 320), '1612887390768-fb02affea7a6', 'Móng hồng hình hạnh nhân'),
    doodle('sparkle', at(X + 1000, BOOKING + 40, 36, 36), '#f3c6d2', { seed: 7 }),
    tint(title(at(X + 56, BOOKING + 50, 680, 64), 'Đặt lịch, không phải chờ', '#ffffff', 40), 'không phải chờ', '#f3c6d2'),
    para(at(X + 56, BOOKING + 124, 600, 56), 'Nhắn Zalo ảnh mẫu bạn thích, tiệm báo giá và giữ giờ cho bạn. Khách đặt trước được ưu tiên.', '#e4dbef'),
    button('primary', at(X + 56, BOOKING + 206, 230, 56), 'Gọi 0901 234 567', { background: '#ffffff', color: plum, fontWeight: 700, radius: 999 }, { href: 'tel:0901234567' }),
    outline(at(X + 302, BOOKING + 206, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567', '#ffffff'),
    text('list', at(X + 56, BOOKING + 292, 600, 70), '📍 102 Nguyễn Văn Linh, Hải Châu, Đà Nẵng\n🕘 9:00 – 21:00 mỗi ngày', { color: '#ffffff', fontSize: 15, lineHeight: 1.9 }),
    ...contactIcons(X + 490, BOOKING + 218, '#ffffff', 32, 10),
  );

  // Footer.
  els.push(
    line(at(X, 4460, CW, 12), '#e7dde6', 1),
    text('title', at(X, 4484, 300, 56), 'Lumi Nails', { color: plum, fontFamily: script, fontSize: 40, fontWeight: 400, lineHeight: 1.3 }),
    text('caption', at(640, 4506, W - X - 640, 22), '© 2026 Lumi Nails · Đôi tay xinh mỗi ngày', { color: soft, fontSize: 13, textAlign: 'right' }),
  );

  return {
    name: 'Tiệm nail',
    description: 'Tím oải hương và hồng nude: ảnh hình móng tay, bảng màu sơn, 4 thẻ giá, mẫu nail hot, ảnh cuộn, thẻ tích điểm thành viên',
    page: { title: 'Lumi Nails – Nail studio Đà Nẵng', width: W, height: H, background: paper },
    elements: els,
  };
}
