import { W, X, CW, at, text, button, icon, box, line, shape, rightAligned, col3, contactIcons, moving, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 21;

// ---------------------------------------------------------------- acne-care spa (light, sage + blush, serif titles)

export default function acneSpa() {
  const paper = '#fffaf7';
  const blush = '#f6e1dc';
  const sage = '#5f7d6e';
  const sageSoft = '#e3ece6';
  const clay = '#d0715f';
  const ink = '#2c3531';
  const soft = '#6b746f';
  const serif = 'playfair';
  const H = 4960;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 18, ...style } });
  const framed = (kind, b, id, alt, background = blush) =>
    shape(kind, b, { background }, { src: unsplash(id, 900, 1100), imgW: 900, imgH: 1100, alt });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: serif, fontSize, fontWeight: 600, lineHeight: 1.3, letterSpacing: 0, ...extra });
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.65, ...extra });
  const card = (b, extra = {}) => box(b, { background: '#ffffff', radius: 20, shadow: 'sm', ...extra });
  /** Clay label + serif title, left or centred. Returns [elements, bottomY]. */
  const head = (y, label, t, { x = X, w = CW, align = 'left' } = {}) => [
    [
      text('label', at(x, y, w, 22), label, { color: clay, textAlign: align, letterSpacing: 3 }),
      title(at(x, y + 30, w, 60), t, ink, 42, { textAlign: align }),
    ],
    y + 116,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: sage, color: '#ffffff', fontWeight: 600, radius: 999, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = sage) =>
    button('outline', b, t, { color, borderColor: color, radius: 999, fontWeight: 600 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const TREATMENTS = 1000;
  const STEPS = 1640;
  const PRICES = 3640;
  const BOOKING = 4280;

  // Menu.
  els.push(
    title(at(X, 30, 300, 44), 'Mây Skin', sage, 30, { italic: true }),
    text('caption', at(X + 150, 46, 200, 20), 'SPA TRỊ MỤN', { color: clay, fontSize: 11, fontWeight: 700, letterSpacing: 3 }),
    ...[
      ['Liệu trình', TREATMENTS, 84],
      ['Quy trình', STEPS, 80],
      ['Bảng giá', PRICES, 76],
      ['Đặt lịch', BOOKING, 72],
    ].map(([t, y, w], i, all) => {
      // Laid out right to left from the button, 26px apart.
      const right = 942 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 26, 0);
      return button('link', at(right - w, 38, w, 32), t, { color: ink, underline: false, fontSize: 15, fontWeight: 500, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(970, 30, 150, 48), 'Soi da miễn phí', scrollYHref(BOOKING), { fontSize: 14 }),
  );

  // Hero.
  els.push(
    shape('blob', at(620, 110, 540, 580), { background: blush }, { seed: 5 }),
    framed('arch', at(690, 150, 400, 520), '1531746020798-e6953c6e8e04', 'Làn da sạch mụn'),
    moving(card(at(600, 520, 240, 92), { shadow: 'md' }), 'float', 3.4),
    moving(title(at(620, 532, 200, 44), '−80%', clay, 32), 'float', 3.4),
    moving(text('caption', at(620, 576, 210, 22), 'mụn viêm sau 6 buổi*', { color: soft, fontSize: 13 }), 'float', 3.4),
    moving(icon('sparkles', at(1060, 170, 56, 56), '#ffffff', { background: sage, radius: 999 }, 'iconPlain', { iconSize: 50 }), 'pulse', 2.4),
    moving(icon('leaf', at(1100, 600, 44, 44), sage, { background: sageSoft, radius: 999 }, 'iconPlain', { iconSize: 56 }), 'float', 2.8, 0.6),

    text('label', at(X, 170, 500, 22), 'SPA TRỊ MỤN CHUẨN Y KHOA', { color: clay, letterSpacing: 3 }),
    title(at(X, 204, 560, 170), 'Làn da sạch mụn,\ntự tin mỗi ngày', ink, 58, { lineHeight: 1.25 }),
    para(at(X, 392, 500, 84), 'Liệu trình riêng cho từng loại mụn, do bác sĩ da liễu xây dựng. Lấy nhân nhẹ tay, không bào mỏng da, không dùng corticoid.', soft, { fontSize: 17 }),
    solid(at(X, 498, 210, 56), 'Đặt lịch soi da', scrollYHref(BOOKING), { fontSize: 16 }),
    outline(at(X + 226, 498, 190, 56), 'Xem liệu trình', scrollYHref(TREATMENTS)),
    ...['Không đau rát', 'Không bào mỏng da', 'Theo dõi sau liệu trình'].map((t, i) =>
      text('paragraph', at(X + [0, 145, 325][i], 590, 200, 24), `✓  ${t}`, { color: sage, fontSize: 14, fontWeight: 600 }),
    ),
    text('caption', at(X, 690, 520, 20), '*Kết quả trung bình của khách hàng năm 2025, có thể khác nhau tuỳ cơ địa.', { color: '#9aa29e', fontSize: 12 }),
  );

  // Skin concerns.
  els.push(
    box(at(0, 760, W, 150), { background: sageSoft, radius: 0 }),
    title(at(X, 790, 300, 40), 'Bạn đang gặp…', ink, 26),
    para(at(X, 834, 260, 50), 'Mỗi loại mụn cần một cách xử lý khác nhau.', soft, { fontSize: 14 }),
    ...[
      ['Mụn ẩn', 96],
      ['Mụn viêm, mụn mủ', 160],
      ['Mụn đầu đen', 124],
      ['Thâm sau mụn', 128],
      ['Lỗ chân lông to', 140],
      ['Da dầu, bít tắc', 140],
    ].map(([t, w], i, all) => {
      const row = i < 3 ? 0 : 1;
      const x = 400 + all.slice(row * 3, i).reduce((sum, [, ww]) => sum + ww + 14, 0);
      return button('pill', at(x, 792 + row * 54, w, 42), t, { background: '#ffffff', color: ink, fontSize: 14, fontWeight: 600, shadow: 'sm' });
    }),
  );

  // Treatments.
  let [h, y] = head(TREATMENTS, 'LIỆU TRÌNH', 'Chọn đúng cách cho làn da của bạn', { align: 'center' });
  els.push(...h);
  ;[
    ['1552693673-1bf958298935', 'Lấy nhân mụn chuẩn y khoa', 'Dụng cụ vô trùng dùng một lần, lấy sạch nhân, hạn chế để lại thâm.', 'từ 390.000đ'],
    ['1570172619644-dfd03ed5d881', 'Peel da sinh học', 'Thay da nhẹ, giảm bít tắc và mờ thâm sau 2–3 tuần.', 'từ 590.000đ'],
    ['1616394584738-fc6e612e71b9', 'Ánh sáng sinh học', 'Diệt khuẩn gây mụn, làm dịu vùng da đang viêm đỏ.', 'từ 290.000đ'],
    ['1512290923902-8a9f81dc236c', 'Phục hồi da sau mụn', 'Cấp ẩm, tái tạo hàng rào bảo vệ cho da yếu, nhạy cảm.', 'từ 450.000đ'],
  ].forEach(([id, t, desc, price], i) => {
    const w = (CW - 3 * 24) / 4;
    const x = X + i * (w + 24);
    const top = y + 30;
    els.push(
      card(at(x, top, w, 410)),
      photo(at(x + 10, top + 10, w - 20, 190), id, t, { radius: 14 }),
      text('subheading', at(x + 22, top + 218, w - 44, 56), t, { color: ink, fontSize: 18, fontWeight: 700, lineHeight: 1.4 }),
      para(at(x + 22, top + 278, w - 44, 72), desc, soft, { fontSize: 14, lineHeight: 1.6 }),
      text('paragraph', at(x + 22, top + 364, w - 44, 26), price, { color: clay, fontSize: 16, fontWeight: 700 }),
    );
  });

  // Steps.
  ;[h, y] = head(STEPS, 'QUY TRÌNH', 'Một buổi trị mụn tại Mây Skin', { align: 'center' });
  els.push(...h);
  const steps = [
    ['Soi da & tư vấn', 'Máy soi da xác định loại mụn, độ dầu, độ nhạy cảm.'],
    ['Làm sạch sâu', 'Tẩy trang, rửa mặt, tẩy tế bào chết dịu nhẹ.'],
    ['Lấy nhân mụn', 'Xông hơi cho lỗ chân lông mở, lấy nhân nhẹ tay.'],
    ['Sát khuẩn & điện di', 'Đưa dưỡng chất chống viêm vào sâu trong da.'],
    ['Mặt nạ làm dịu', 'Giảm sưng đỏ, se lỗ chân lông sau khi lấy nhân.'],
    ['Chăm sóc tại nhà', 'Hướng dẫn routine và hẹn lịch theo dõi.'],
  ];
  const stepW = (CW - 5 * 16) / 6;
  els.push(line(at(X + stepW / 2, y + 62, CW - stepW, 20), '#d7c8c2', 2));
  steps.forEach(([t, desc], i) => {
    const x = X + i * (stepW + 16);
    els.push(
      button('pill', at(x + (stepW - 64) / 2, y + 40, 64, 64), String(i + 1).padStart(2, '0'), { background: i % 2 ? clay : sage, color: '#ffffff', fontFamily: serif, fontSize: 20, fontWeight: 700 }, { href: scrollYHref(BOOKING) }),
      text('subheading', at(x, y + 122, stepW, 28), t, { color: ink, fontSize: 16, fontWeight: 700, textAlign: 'center' }),
      para(at(x + 6, y + 154, stepW - 12, 72), desc, soft, { fontSize: 13, lineHeight: 1.55, textAlign: 'center' }),
    );
  });

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 2060, W, 400), props: { src: unsplash('1601049676869-702ea24cfd58', 1600, 1100), alt: 'Mỹ phẩm chăm sóc da và khăn spa' }, style: { radius: 0 } }),
    box(at(0, 2060, W, 400), { background: 'linear-gradient(90deg, rgba(44,53,49,0.78) 0%, rgba(44,53,49,0.4) 65%, rgba(44,53,49,0.1) 100%)', radius: 0 }),
    title(at(X, 2160, 640, 140), 'Trị mụn không phải cuộc chạy đua,\nmà là hành trình làm lành.', '#ffffff', 38, { italic: true, lineHeight: 1.4 }),
    text('label', at(X, 2324, 400, 22), '— MÂY SKIN', { color: blush, letterSpacing: 4 }),
  );

  // Expert.
  els.push(framed('arch', at(X, 2540, 420, 500), '1594824476967-48c8b964273f', 'Bác sĩ da liễu của spa', sageSoft));
  ;[h, y] = head(2560, 'CHUYÊN GIA', 'BS. Lê Thảo Vy', { x: 580, w: 540 });
  els.push(
    ...h,
    text('paragraph', at(580, y - 6, 540, 26), 'Bác sĩ Da liễu · 9 năm kinh nghiệm điều trị mụn', { color: clay, fontSize: 16, fontWeight: 600 }),
    para(at(580, y + 34, 540, 110), 'Chị Vy trực tiếp soi da, lên phác đồ cho từng khách và đào tạo kỹ thuật viên. Mục tiêu không chỉ là hết mụn, mà là một làn da khoẻ, ít tái phát.', soft, { fontSize: 16 }),
    text('list', at(580, y + 160, 540, 120), '✓  Tốt nghiệp Đại học Y Dược TP. HCM, chuyên ngành Da liễu\n✓  Chứng chỉ điều trị mụn và sẹo rỗ chuyên sâu\n✓  Hơn 6.000 khách hàng đã theo liệu trình', { color: ink, fontSize: 15, lineHeight: 2 }),
    solid(at(580, y + 300, 220, 52), 'Hẹn gặp bác sĩ', scrollYHref(BOOKING), { fontSize: 15 }),
  );

  // Reviews.
  ;[h, y] = head(3140, 'KHÁCH HÀNG NÓI GÌ', 'Những làn da đã thay đổi', { align: 'center' });
  els.push(...h);
  ;[
    ['Mình bị mụn ẩn hai năm, thử đủ thứ. Sau 6 buổi ở đây da mịn hẳn, quan trọng là không bị thâm.', 'Ngọc Anh · 22 tuổi'],
    ['Lấy nhân rất nhẹ tay, phòng sạch sẽ. Bác sĩ dặn kỹ cách chăm da ở nhà, giờ ít nổi mụn lại.', 'Minh Khoa · 27 tuổi'],
    ['Da mình nhạy cảm, đi nhiều nơi bị kích ứng. Ở Mây Skin được tư vấn kỹ và làm rất từ tốn.', 'Thu Trang · 31 tuổi'],
  ].forEach(([quote, who], i) => {
    const c = col3(i, 28);
    const top = y + 30;
    els.push(
      card(at(c.x, top, c.w, 250), { background: i === 1 ? blush : '#ffffff' }),
      text('paragraph', at(c.x + 28, top + 26, c.w - 56, 26), '★★★★★', { color: clay, fontSize: 18, letterSpacing: 2 }),
      para(at(c.x + 28, top + 64, c.w - 56, 120), `“${quote}”`, ink, { fontSize: 15, lineHeight: 1.7 }),
      text('caption', at(c.x + 28, top + 196, c.w - 56, 22), who, { color: sage, fontSize: 14, fontWeight: 700 }),
    );
  });

  // Packages.
  ;[h, y] = head(PRICES, 'BẢNG GIÁ', 'Gói liệu trình', { align: 'center' });
  els.push(...h);
  ;[
    ['1 BUỔI', '390.000đ', 'Phù hợp để trải nghiệm', ['Soi da và tư vấn', 'Lấy nhân mụn chuẩn y khoa', 'Mặt nạ làm dịu'], false],
    ['6 BUỔI', '1.990.000đ', 'Tiết kiệm 15%', ['Phác đồ riêng của bác sĩ', '6 buổi trị mụn chuyên sâu', 'Tặng 1 buổi ánh sáng sinh học', 'Nhắc lịch, theo dõi qua Zalo'], true],
    ['10 BUỔI', '2.990.000đ', 'Tiết kiệm 23%', ['Mọi quyền lợi gói 6 buổi', 'Peel da mờ thâm 2 lần', 'Bộ chăm sóc da tại nhà'], false],
  ].forEach(([name, price, note, perks, hot], i) => {
    const c = col3(i, 28);
    const top = y + 40;
    const fg = hot ? '#ffffff' : ink;
    els.push(
      card(at(c.x, top, c.w, 420), { background: hot ? sage : '#ffffff', ...(hot && { shadow: 'lg' }) }),
      text('label', at(c.x + 30, top + 34, c.w - 60, 22), name, { color: hot ? blush : clay, letterSpacing: 3 }),
      title(at(c.x + 30, top + 64, c.w - 60, 56), price, fg, 38),
      text('caption', at(c.x + 30, top + 124, c.w - 60, 22), note, { color: hot ? '#dfe9e3' : soft, fontSize: 14, fontWeight: 600 }),
      line(at(c.x + 30, top + 154, c.w - 60, 20), hot ? 'rgba(255,255,255,0.3)' : '#eee3df'),
      text('list', at(c.x + 30, top + 186, c.w - 60, 140), perks.map((s) => `✓  ${s}`).join('\n'), { color: fg, fontSize: 15, lineHeight: 1.9 }),
      hot
        ? solid(at(c.x + 30, top + 340, c.w - 60, 52), 'Đặt gói này', scrollYHref(BOOKING), { background: '#ffffff', color: sage })
        : outline(at(c.x + 30, top + 340, c.w - 60, 52), 'Đặt gói này', scrollYHref(BOOKING)),
    );
    if (hot) els.push(button('pill', at(c.x + c.w - 186, top - 16, 172, 32), 'ĐƯỢC CHỌN NHIỀU', { background: clay, color: '#ffffff', fontSize: 11, fontWeight: 700, letterSpacing: 1 }));
  });

  // Booking.
  els.push(
    box(at(X, BOOKING, CW, 360), { background: blush, radius: 28 }),
    title(at(X + 56, BOOKING + 48, 600, 60), 'Soi da miễn phí tuần này', ink, 40),
    para(at(X + 56, BOOKING + 118, 520, 56), 'Để lại lời nhắn qua Zalo hoặc gọi trực tiếp, Mây Skin sẽ xếp giờ soi da và tư vấn cho bạn.', soft, { fontSize: 16 }),
    solid(at(X + 56, BOOKING + 198, 230, 56), 'Gọi 0901 234 567', 'tel:0901234567', { fontSize: 16 }),
    outline(at(X + 302, BOOKING + 198, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567', clay),
    text('caption', at(X + 56, BOOKING + 282, 560, 22), 'Mở cửa 9:00 – 20:00, tất cả các ngày · Nên đặt trước 1 ngày', { color: soft, fontSize: 14 }),
    photo(at(700, BOOKING + 30, 390, 300), '1540555700478-4be289fbecef', 'Khăn và mỹ phẩm spa', { radius: 20 }),
  );

  // Footer.
  els.push(
    line(at(X, 4730, CW, 20), '#eadfda'),
    title(at(X, 4776, 300, 44), 'Mây Skin', sage, 28, { italic: true }),
    text('paragraph', at(X, 4832, 560, 84), '📍 88 Trần Quang Khải, Tân Định, Quận 1, TP. Hồ Chí Minh\n📞 0901 234 567\n✉️ xinchao@mayskin.vn', { color: soft, fontSize: 15, lineHeight: 1.75 }),
    ...contactIcons(rightAligned(W - X, 3, 36, 12), 4780, sage, 36, 12),
    text('caption', at(640, 4892, W - X - 640, 22), '© 2026 Mây Skin – Spa trị mụn', { color: '#a7aeaa', textAlign: 'right' }),
  );

  return {
    name: 'Spa trị mụn',
    description: 'Nền sáng, xanh xô thơm và hồng phấn: liệu trình, quy trình 6 bước, ảnh cuộn, bác sĩ, đánh giá, gói giá, đặt lịch',
    page: { title: 'Mây Skin – Spa trị mụn chuẩn y khoa', width: W, height: H, background: paper },
    elements: els,
  };
}
