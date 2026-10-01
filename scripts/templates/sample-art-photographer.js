import { W, X, CW, at, text, button, box, line, col3, socials, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 24;

// ---------------------------------------------------------------- art photographer (photo book: collage, film strip, gallery labels)

export default function artPhotographer() {
  const paper = '#efece6';
  const ink = '#141414';
  const red = '#d6402a';
  const grey = '#6f6a62';
  const display = 'playfair';
  const mono = 'space-mono';
  const H = 5360;
  const els = [];

  const photo = (b, id, alt, extra = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 0 }, ...extra });
  const big = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: display, fontSize, fontWeight: 400, italic: true, lineHeight: 1.25, letterSpacing: -1, ...extra });
  /** Typewriter-style gallery label. */
  const label = (b, t, color = grey, extra = {}) =>
    text('caption', b, t, { color, fontFamily: mono, fontSize: 12, lineHeight: 1.5, letterSpacing: 0.5, ...extra });
  const para = (b, t, color = ink, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.75, ...extra });
  /** "(01) Title" section opener with a mono note on the right. */
  const opener = (y, n, t, note) => [
    label(at(X, y + 26, 60, 22), `(${n})`, red, { fontSize: 14 }),
    big(at(X + 60, y, 640, 90), t, ink, 68),
    label(at(760, y + 34, W - X - 760, 44), note, grey, { textAlign: 'right' }),
    line(at(X, y + 96, CW, 20), ink, 1),
  ];

  // Section tops, also the targets of the menu's in-page links.
  const SERIES = 1480;
  const PORTRAITS = 3240;
  const ABOUT = 3880;
  const CONTACT = 4880;

  // Header.
  els.push(
    label(at(X, 34, 400, 22), 'LINH NGUYỄN — NHIẾP ẢNH', ink, { fontSize: 13, fontWeight: 700, letterSpacing: 2 }),
    ...[
      ['(01) Series', SERIES, 110],
      ['(02) Chân dung', PORTRAITS, 134],
      ['(03) Giới thiệu', ABOUT, 140],
      ['(04) Liên hệ', CONTACT, 112],
    ].map(([t, y, w], i, all) => {
      const right = W - X - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 8, 0);
      return button('link', at(right - w, 30, w, 28), t, { color: ink, underline: false, fontFamily: mono, fontSize: 12, fontWeight: 400, textAlign: 'right' }, { href: scrollYHref(y) });
    }),
  );

  // Hero: photos pinned off-grid, the name set huge across them.
  els.push(
    photo(at(560, 120, 420, 560), '1534528741775-53994a69daeb', 'Chân dung dưới ánh sáng xanh'),
    photo(at(330, 600, 260, 190), '1470071459604-3b5ec3a7fe05', 'Đồi cỏ trong sương sớm'),
    photo(at(900, 520, 240, 320), '1529626455594-4ff0802cfb7e', 'Chân dung cô gái tóc đỏ'),
    box(at(536, 104, 22, 22), { background: red, radius: 999 }),
    big(at(60, 120, 760, 290), 'Linh', ink, 230),
    big(at(180, 340, 980, 290), 'Nguyễn', ink, 230),
    // Turned on its side along the left edge.
    { ...label(at(-124, 548, 320, 24), 'PORTFOLIO · 2016 — 2026', ink, { fontSize: 13, letterSpacing: 4, textAlign: 'center' }), rotation: -90 },
    label(at(600, 690, 300, 20), 'fig. 01 — Lam, Hà Nội, 2024'),
    label(at(330, 800, 260, 20), 'fig. 02 — Mộc Châu, 05:12'),
    label(at(900, 850, 240, 20), 'fig. 03 — Hồng, 2025'),
    para(at(X, 870, 420, 84), 'Nhiếp ảnh gia chân dung và phong cảnh, sống ở Hà Nội. Tôi chụp bằng ánh sáng tự nhiên, máy phim, và kiên nhẫn chờ những khoảng lặng.', grey, { fontSize: 15 }),
  );

  // Statement.
  els.push(
    label(at(X, 1070, 400, 22), '(00) TUYÊN NGÔN', red, { fontSize: 13 }),
    big(at(X, 1104, 1000, 260), 'Tôi chụp những khoảnh khắc ở giữa — trước khi người ta kịp mỉm cười, và sau khi họ quên mất chiếc máy ảnh.', ink, 50, { lineHeight: 1.35, letterSpacing: -0.5 }),
  );

  // Series 01: an off-grid spread.
  els.push(
    ...opener(SERIES, '01', 'Sương & Đá', 'Miền Bắc Việt Nam · 2023 — 2025\n24 khung hình · phim 120'),
    photo(at(X, SERIES + 160, 640, 440), '1528127269322-539801943592', 'Vịnh Hạ Long lúc sáng sớm'),
    label(at(X, SERIES + 610, 640, 20), 'fig. 04 — Hạ Long, 05:40'),
    photo(at(760, SERIES + 160, 360, 520), '1557750255-c76072a7aad1', 'Chùa giữa núi đá Ninh Bình'),
    label(at(760, SERIES + 690, 360, 20), 'fig. 05 — Tràng An, sau mưa'),
    big(at(X, SERIES + 660, 140, 200), '“Sương không che, sương kể.”', red, 22, { lineHeight: 1.4, letterSpacing: 0 }),
    photo(at(240, SERIES + 660, 420, 300), '1555921015-5532091f6026', 'Phố đường tàu Hà Nội'),
    label(at(240, SERIES + 970, 420, 20), 'fig. 06 — Phố đường tàu, 16:20'),
    photo(at(760, SERIES + 740, 260, 220), '1559592413-7cec4d0cae2b', 'Cầu Vàng trong mây'),
    label(at(760, SERIES + 970, 260, 20), 'fig. 07 — Bà Nà, mây thấp'),
  );

  // Full-bleed photo that stays put while the page scrolls past.
  els.push(
    createElement('parallax', { ...at(0, 2560, W, 600), props: { src: unsplash('1519681393784-d120267933ba', 1800, 1200), alt: 'Núi dưới bầu trời sao' }, style: { radius: 0 } }),
    box(at(0, 2560, W, 600), { background: 'rgba(10,10,20,0.25)', radius: 0 }),
    big(at(X, 2640, 900, 200), 'Ánh sáng', '#ffffff', 150),
    big(at(330, 2820, 860, 200), '& bóng tối', '#ffffff', 150),
    label(at(X, 3110, 500, 20), 'fig. 08 — Tà Xùa, 02:13 sáng · phơi sáng 25 giây', '#ffffff'),
  );

  // Series 02: a strip of film.
  els.push(...opener(PORTRAITS, '02', 'Chân dung', 'Người lạ, bạn bè, và chính tôi\nKodak Portra 400 · Mamiya RZ67'));
  const stripTop = PORTRAITS + 160;
  els.push(box(at(0, stripTop, W, 340), { background: ink, radius: 0 }));
  for (let x = 14; x < W; x += 30) {
    els.push(
      box(at(x, stripTop + 12, 14, 10), { background: paper, radius: 2 }),
      box(at(x, stripTop + 318, 14, 10), { background: paper, radius: 2 }),
    );
  }
  ;[
    ['1488426862026-3ee34a7d66df', 'Chân dung cô gái áo jean'],
    ['1517841905240-472988babdf9', 'Cô gái áo hoodie xanh'],
    ['1531123897727-8f129e1688ce', 'Chân dung trong bóng tối'],
    ['1504593811423-6dd665756598', 'Chàng trai trên phố'],
    ['1508214751196-bcfd4ca60f91', 'Người phụ nữ trong nắng chiều'],
    ['1529626455594-4ff0802cfb7e', 'Cô gái tóc đỏ'],
  ].forEach(([id, alt], i) => {
    const x = 20 + i * (180 + 16);
    els.push(
      photo(at(x, stripTop + 40, 180, 240), id, alt),
      label(at(x, stripTop + 286, 180, 20), `${String(i + 12).padStart(2, '0')}A`, '#e8a33d', { fontSize: 11, fontWeight: 700 }),
    );
  });

  // About + exhibitions.
  els.push(
    photo(at(X, ABOUT, 420, 540), '1542038784456-1ea8e935640e', 'Linh Nguyễn cầm máy ảnh'),
    label(at(X, ABOUT + 550, 420, 20), 'Chân dung tự chụp, Đà Lạt 2025'),
    label(at(580, ABOUT, 300, 22), '(03) GIỚI THIỆU', red, { fontSize: 13 }),
    big(at(580, ABOUT + 30, 540, 70), 'Xin chào, tôi là Linh.', ink, 48),
    para(at(580, ABOUT + 112, 540, 112), 'Mười năm cầm máy, bắt đầu từ một chiếc Zenit cũ của bố. Tôi theo đuổi ảnh phim và ánh sáng tự nhiên, làm việc chậm, chụp ít, và in mọi bức ảnh mình thích.'),
    label(at(580, ABOUT + 250, 540, 22), 'TRIỂN LÃM & GIẢI THƯỞNG', ink, { fontWeight: 700, letterSpacing: 2 }),
  );
  ;[
    ['2025', 'Triển lãm cá nhân “Sương”', 'Manzi Art Space, Hà Nội'],
    ['2024', 'Giải Nhì Ảnh chân dung', 'Vietnam Photo Awards'],
    ['2023', 'Triển lãm nhóm “Người lạ”', 'The Factory, TP. HCM'],
    ['2022', 'Ảnh bìa tạp chí', 'Tạp chí Mùa, số 14'],
    ['2020', 'Workshop ảnh phim', 'Hanoi Photo Week'],
  ].forEach(([year, what, where], i) => {
    const top = ABOUT + 290 + i * 48;
    els.push(
      line(at(580, top - 8, 540, 12), '#cfc9bf', 1),
      label(at(580, top + 6, 70, 22), year, red, { fontSize: 13 }),
      text('paragraph', at(650, top + 4, 250, 24), what, { color: ink, fontSize: 15, fontWeight: 600 }),
      label(at(900, top + 6, 220, 22), where, grey, { textAlign: 'right' }),
    );
  });

  // Commissions.
  els.push(label(at(X, 4520, 400, 22), '(04) NHẬN CHỤP', red, { fontSize: 13 }));
  ;[
    ['Chân dung cá nhân', 'từ 2.500.000đ / buổi', 'Hai giờ chụp ngoài trời hoặc tại studio, 20 ảnh chỉnh màu, 2 ảnh in phim khổ lớn.'],
    ['Ảnh cưới chất phim', 'từ 12.000.000đ', 'Một ngày theo chân hai bạn, máy kỹ thuật số và máy phim, album in thủ công.'],
    ['Editorial & thương hiệu', 'báo giá theo dự án', 'Ảnh cho tạp chí, sản phẩm, lookbook. Lên ý tưởng cùng đội của bạn.'],
  ].forEach(([t, price, desc], i) => {
    const c = col3(i, 40);
    els.push(
      line(at(c.x, 4560, c.w, 12), ink, 2),
      big(at(c.x, 4584, c.w, 50), t, ink, 30, { letterSpacing: 0 }),
      label(at(c.x, 4638, c.w, 22), price, red, { fontSize: 13 }),
      para(at(c.x, 4668, c.w, 84), desc, grey, { fontSize: 15 }),
    );
  });

  // Contact.
  els.push(
    big(at(X, CONTACT, 900, 210), 'Cùng tạo nên\nmột khung hình?', ink, 84, { lineHeight: 1.2 }),
    button('link', at(X, CONTACT + 230, 720, 64), 'xinchao@linhnguyen.art', { color: red, underline: true, fontFamily: display, fontSize: 44, italic: true, fontWeight: 400, textAlign: 'left' }, { href: 'mailto:xinchao@linhnguyen.art' }),
    label(at(840, CONTACT + 60, 280, 80), 'Hà Nội, Việt Nam\n+84 901 234 567\nNhận lịch từ tháng 3/2026', ink, { fontSize: 13, lineHeight: 1.8, textAlign: 'right' }),
    ...socials(1120 - (3 * 32 + 2 * 12), CONTACT + 170, ink, 32, 12, ['instagram', 'facebook', 'threads']),
    line(at(X, H - 80, CW, 12), ink, 1),
    label(at(X, H - 56, 500, 20), '© 2026 Linh Nguyễn. Mọi hình ảnh thuộc bản quyền tác giả.'),
    label(at(640, H - 56, W - X - 640, 20), 'In trên giấy, sống trên màn hình.', grey, { textAlign: 'right' }),
  );

  return {
    name: 'Nhiếp ảnh gia – Nghệ thuật',
    description: 'Kiểu sách ảnh: tên khổng lồ đè lên ảnh cắt dán, nhãn kiểu phòng tranh, series bất đối xứng, ảnh cuộn, dải phim, danh sách triển lãm',
    page: { title: 'Linh Nguyễn – Nhiếp ảnh', width: W, height: H, background: paper },
    elements: els,
  };
}
