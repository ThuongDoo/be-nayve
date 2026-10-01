import { W, X, CW, at, text, button, icon, box, line, rightAligned, col3, contactIcons, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 22;

// ---------------------------------------------------------------- men's barbershop (dark vintage, brass)

export default function barbershop() {
  const night = '#141110';
  const card = '#1f1a17';
  const brass = '#c8a46a';
  const cream = '#f2e8d8';
  const muted = '#a39a8e';
  const red = '#b23a2e';
  const heading = 'oswald';
  const script = 'dancing-script';
  const H = 4580;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 4, ...style } });
  const big = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heading, fontSize, fontWeight: 600, lineHeight: 1.3, letterSpacing: 1, ...extra });
  const hand = (b, t, color, fontSize, extra = {}) =>
    text('paragraph', b, t, { color, fontFamily: script, fontSize, fontWeight: 700, lineHeight: 1.3, ...extra });
  const para = (b, t, color = muted, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.65, ...extra });
  /** Script line + condensed title, left or centred. Returns [elements, bottomY]. */
  const head = (y, kicker, t, { x = X, w = CW, align = 'left' } = {}) => [
    [
      hand(at(x, y, w, 40), kicker, brass, 28, { textAlign: align }),
      big(at(x, y + 40, w, 64), t, cream, 46, { textAlign: align }),
    ],
    y + 124,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: brass, color: night, fontWeight: 700, radius: 2, letterSpacing: 1, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = cream) =>
    button('outline', b, t, { color, borderColor: color, radius: 2, fontWeight: 600, letterSpacing: 1 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const SERVICES = 900;
  const PRICES = 1600;
  const BARBERS = 2780;
  const BOOKING = 3940;

  // Menu.
  els.push(
    big(at(X, 28, 260, 44), 'THE GENTS', cream, 30, { letterSpacing: 4 }),
    text('caption', at(X, 70, 260, 18), 'BARBERSHOP · EST. 2016', { color: brass, fontSize: 11, fontWeight: 700, letterSpacing: 3 }),
    ...[
      ['DỊCH VỤ', SERVICES, 80],
      ['BẢNG GIÁ', PRICES, 88],
      ['THỢ CẮT', BARBERS, 84],
      ['ĐẶT LỊCH', BOOKING, 88],
    ].map(([t, y, w], i, all) => {
      // Laid out right to left from the button, 16px apart.
      const right = 952 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 16, 0);
      return button('link', at(right - w, 40, w, 30), t, { color: cream, underline: false, fontSize: 14, fontWeight: 600, letterSpacing: 1, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(972, 32, 148, 46), 'ĐẶT LỊCH', scrollYHref(BOOKING), { fontSize: 14 }),
  );

  // Hero.
  els.push(
    box(at(670, 140, 450, 600), { background: 'transparent', radius: 0, borderWidth: 2, borderColor: brass }),
    photo(at(640, 116, 450, 600), '1596728325488-58c87691e9af', 'Thợ cạo râu cho khách bằng dao', { radius: 0 }),
    box(at(588, 600, 190, 120), { background: red, radius: 0 }),
    big(at(588, 612, 190, 56), '30′', cream, 44, { textAlign: 'center' }),
    text('caption', at(588, 670, 190, 22), 'MỘT LƯỢT, KHÔNG CHỜ', { color: cream, fontSize: 12, fontWeight: 700, letterSpacing: 1, textAlign: 'center' }),

    hand(at(X, 168, 400, 44), 'Since 2016', brass, 34),
    big(at(X, 214, 540, 288), 'CẮT TÓC NAM\nĐÚNG CHẤT\nQUÝ ÔNG', cream, 74, { lineHeight: 1.25, letterSpacing: 2 }),
    para(at(X, 516, 470, 80), 'Kiểu tóc hợp gương mặt, đường fade sắc nét, cạo râu bằng khăn nóng. Ngồi xuống, nhâm nhi ly cà phê, phần còn lại để thợ lo.', muted, { fontSize: 17 }),
    solid(at(X, 620, 200, 56), 'ĐẶT LỊCH NGAY', scrollYHref(BOOKING), { fontSize: 15 }),
    outline(at(X + 216, 620, 180, 56), 'XEM BẢNG GIÁ', scrollYHref(PRICES)),
    line(at(X, 712, 470, 20), '#3a322c'),
    ...[
      ['award', '6 thợ tay nghề cao'],
      ['coffee', 'Cà phê miễn phí'],
      ['clock', '9:00 – 21:00'],
    ].map(([ic, t], i) => {
      const x = X + [0, 190, 350][i];
      return [
        icon(ic, at(x, 746, 28, 28), brass, {}, 'iconPlain', { iconSize: 80 }),
        text('caption', at(x + 36, 750, 150, 22), t, { color: cream, fontSize: 13 }),
      ];
    }).flat(),
  );

  // Services.
  let [h, y] = head(SERVICES, 'Dịch vụ', 'CHĂM CHÚT CHO VẺ NGOÀI', { align: 'center' });
  els.push(...h);
  ;[
    ['1567894340315-735d7c361db0', 'Cắt fade & tạo kiểu', 'Tư vấn kiểu hợp khuôn mặt, đường fade mượt, vuốt sáp gọn gàng.'],
    ['1517832606299-7ae9b720a186', 'Tỉa & tạo dáng râu', 'Đi viền râu sắc nét, dưỡng râu mềm, không còn lởm chởm.'],
    ['1590540179852-2110a54f813a', 'Uốn & nhuộm', 'Uốn phồng Hàn Quốc, nhuộm thời trang bằng thuốc ít hại tóc.'],
    ['1621605815971-fbc98d665033', 'Cạo mặt khăn nóng', 'Khăn nóng, kem cạo, dao cạo cổ điển. Thư giãn đúng nghĩa.'],
  ].forEach(([id, t, desc], i) => {
    const w = (CW - 3 * 20) / 4;
    const x = X + i * (w + 20);
    const top = y + 30;
    els.push(
      photo(at(x, top, w, 300), id, t),
      box(at(x, top + 300, w, 160), { background: card, radius: 0 }),
      text('subheading', at(x + 20, top + 320, w - 40, 30), t, { color: cream, fontFamily: heading, fontSize: 20, fontWeight: 600, letterSpacing: 0.5 }),
      para(at(x + 20, top + 356, w - 40, 80), desc, muted, { fontSize: 14, lineHeight: 1.6 }),
    );
  });

  // Price list, like a printed menu.
  ;[h, y] = head(PRICES, 'Bảng giá', 'MENU DỊCH VỤ', { align: 'center' });
  els.push(...h, box(at(X, y + 30, CW, 470), { background: card, radius: 0, borderWidth: 1, borderColor: '#3a322c' }));
  const menu = [
    ['Cắt tóc nam', 'Gội, cắt, sấy, vuốt sáp', '120K'],
    ['Cắt fade / undercut', 'Đường fade 0 – 3 mm sắc nét', '150K'],
    ['Cạo mặt khăn nóng', 'Khăn nóng, kem cạo, dao cổ điển', '80K'],
    ['Tỉa & tạo dáng râu', 'Đi viền, dưỡng râu', '100K'],
    ['Uốn phồng Hàn Quốc', 'Gồm cắt và tạo kiểu', '450K'],
    ['Nhuộm thời trang', 'Tuỳ màu và độ dài tóc', 'từ 350K'],
    ['Gội & massage đầu', '20 phút, tinh dầu bạc hà', '70K'],
    ['Combo Quý ông', 'Cắt, gội, cạo mặt, đắp mặt nạ', '250K'],
  ];
  menu.forEach(([t, note, price], i) => {
    const w = (CW - 60 * 2 - 80) / 2;
    const x = X + 60 + (i % 2) * (w + 80);
    const top = y + 74 + Math.floor(i / 2) * 102;
    const hot = i === menu.length - 1;
    els.push(
      text('subheading', at(x, top, w - 110, 30), t, { color: hot ? brass : cream, fontFamily: heading, fontSize: 21, fontWeight: 600, letterSpacing: 0.5 }),
      big(at(x + w - 110, top - 2, 110, 34), price, brass, 24, { textAlign: 'right', letterSpacing: 0 }),
      text('caption', at(x, top + 36, w, 22), note, { color: muted, fontSize: 14 }),
      line(at(x, top + 62, w, 20), '#3a322c'),
    );
  });
  els.push(text('caption', at(X, y + 520, CW, 22), 'Học sinh, sinh viên giảm 10% từ thứ 2 đến thứ 5 (xuất trình thẻ).', { color: muted, fontSize: 14, textAlign: 'center' }));

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 2320, W, 380), props: { src: unsplash('1585747860715-2ba37e788b70', 1600, 1100), alt: 'Bên trong tiệm cắt tóc' }, style: { radius: 0 } }),
    box(at(0, 2320, W, 380), { background: 'rgba(20,17,16,0.62)', radius: 0 }),
    hand(at(X, 2406, CW, 50), 'Không chỉ là cắt tóc,', brass, 40, { textAlign: 'center' }),
    big(at(X, 2458, CW, 120), 'ĐÓ LÀ 30 PHÚT\nDÀNH RIÊNG CHO BẠN', cream, 44, { textAlign: 'center', lineHeight: 1.3, letterSpacing: 2 }),
  );

  // Barbers.
  ;[h, y] = head(BARBERS, 'Đội ngũ', 'NHỮNG ĐÔI TAY CẦM KÉO', { align: 'center' });
  els.push(...h);
  ;[
    ['1622287162716-f311baa1a2b8', 'Tuấn “Fade”', 'Thợ cả · 10 năm', 'Fade, skin fade, design line'],
    ['1593702295094-aea22597af65', 'Hoàng Long', 'Thợ chính · 7 năm', 'Side part, pompadour cổ điển'],
    ['1534297635766-a262cdcb8ee4', 'Minh Đức', 'Thợ chính · 5 năm', 'Uốn Hàn Quốc, nhuộm màu'],
  ].forEach(([id, name, role, skill], i) => {
    const c = col3(i, 32);
    const top = y + 30;
    els.push(
      photo(at(c.x, top, c.w, 360), id, name),
      box(at(c.x, top + 360, c.w, 4), { background: i === 1 ? red : brass, radius: 0 }),
      text('subheading', at(c.x, top + 384, c.w, 32), name, { color: cream, fontFamily: heading, fontSize: 24, fontWeight: 600, letterSpacing: 0.5 }),
      text('caption', at(c.x, top + 420, c.w, 22), role, { color: brass, fontSize: 14, fontWeight: 700, letterSpacing: 1 }),
      text('caption', at(c.x, top + 446, c.w, 22), `Sở trường: ${skill}`, { color: muted, fontSize: 14 }),
    );
  });

  // Lookbook.
  ;[h, y] = head(3480, 'Lookbook', 'KIỂU TÓC ĐƯỢC CHỌN NHIỀU', { align: 'center' });
  els.push(...h);
  ;[
    ['1622286342621-4bd786c2447c', 'Textured crop'],
    ['1506794778202-cad84cf45f1d', 'Side part'],
    ['1599351431202-1e0f0137899a', 'Skin fade'],
    ['1532710093739-9470acff878f', 'Full beard'],
  ].forEach(([id, name], i) => {
    const w = (CW - 3 * 20) / 4;
    const x = X + i * (w + 20);
    els.push(
      photo(at(x, y + 30, w, 200), id, name, { radius: 2 }),
      text('caption', at(x, y + 242, w, 22), name.toUpperCase(), { color: cream, fontSize: 13, fontWeight: 700, letterSpacing: 2, textAlign: 'center' }),
    );
  });

  // Booking.
  els.push(
    box(at(X, BOOKING, CW, 380), { background: card, radius: 0, borderWidth: 2, borderColor: brass }),
    photo(at(X + 24, BOOKING + 24, 400, 332), '1512690459411-b9245aed614b', 'Ghế cắt tóc cổ điển', { radius: 0 }),
    hand(at(540, BOOKING + 44, 540, 44), 'Đặt chỗ trước,', brass, 32),
    big(at(540, BOOKING + 88, 560, 64), 'ĐẾN LÀ CẮT, KHÔNG CHỜ', cream, 44),
    para(at(540, BOOKING + 160, 520, 56), 'Gọi hoặc nhắn Zalo cho tiệm, chọn giờ và thợ bạn thích. Đến muộn quá 15 phút tiệm sẽ xếp lại lịch.', muted),
    solid(at(540, BOOKING + 238, 230, 56), 'GỌI 0901 234 567', 'tel:0901234567', { fontSize: 15 }),
    outline(at(786, BOOKING + 238, 160, 56), 'NHẮN ZALO', 'https://zalo.me/0901234567', brass),
    text('caption', at(540, BOOKING + 314, 520, 22), 'Mở cửa 9:00 – 21:00 · Thứ 2 – Chủ nhật', { color: muted, fontSize: 14 }),
  );

  // Footer.
  els.push(
    line(at(X, 4400, CW, 20), '#3a322c'),
    big(at(X, 4440, 260, 40), 'THE GENTS', cream, 26, { letterSpacing: 4 }),
    text('paragraph', at(X, 4490, 560, 56), '📍 27 Hàng Bông, Hoàn Kiếm, Hà Nội\n📞 0901 234 567', { color: muted, fontSize: 15, lineHeight: 1.75 }),
    ...contactIcons(rightAligned(W - X, 3, 36, 12), 4444, cream, 36, 12),
    text('caption', at(640, 4520, W - X - 640, 22), '© 2026 The Gents Barbershop', { color: '#6b625a', textAlign: 'right' }),
  );

  return {
    name: 'Barbershop tóc nam',
    description: 'Nền tối cổ điển, vàng đồng: dịch vụ, menu giá, ảnh cuộn, thợ cắt, lookbook kiểu tóc, đặt lịch',
    page: { title: 'The Gents – Barbershop tóc nam', width: W, height: H, background: night },
    elements: els,
  };
}
