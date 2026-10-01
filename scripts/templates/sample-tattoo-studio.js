import { W, X, CW, at, text, button, box, line, col3, contactIcons, rightAligned, doodle, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 26;

// ---------------------------------------------------------------- tattoo studio (black, bone & red: giant stacked type, style list)

export default function tattooStudio() {
  const black = '#0d0d0d';
  const panel = '#171616';
  const bone = '#ece6dc';
  const red = '#c8102e';
  const grey = '#8a8580';
  const heavy = 'big-shoulders';
  const H = 4780;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 0, ...style } });
  const big = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heavy, fontSize, fontWeight: 800, lineHeight: 1.3, letterSpacing: 1, ...extra });
  /** Gives `word` (inside the element's text) its own colour, like recolouring it in the editor. */
  const tint = (el, word, color = red) => {
    const start = el.props.text.indexOf(word);
    return start < 0 ? el : { ...el, props: { ...el.props, marks: [...(el.props.marks ?? []), { start, end: start + word.length, color }] } };
  };
  const para = (b, t, color = grey, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.7, ...extra });
  const small = (b, t, color = red, extra = {}) => text('label', b, t, { color, fontSize: 13, letterSpacing: 3, ...extra });
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: red, color: '#ffffff', fontFamily: heavy, fontSize: 20, fontWeight: 800, letterSpacing: 2, radius: 0, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = bone) =>
    button('outline', b, t, { color, borderColor: color, fontFamily: heavy, fontSize: 20, fontWeight: 800, letterSpacing: 2, radius: 0 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const STYLES = 1040;
  const WORK = 1800;
  const ARTISTS = 2960;
  const BOOKING = 4140;

  // Menu.
  els.push(
    big(at(X, 22, 300, 50), 'MỰC ĐEN', bone, 36, { letterSpacing: 4 }),
    small(at(X, 68, 300, 18), 'TATTOO STUDIO · SÀI GÒN', grey, { fontSize: 11 }),
    ...[
      ['PHONG CÁCH', STYLES, 124],
      ['TÁC PHẨM', WORK, 90],
      ['THỢ XĂM', ARTISTS, 84],
    ].map(([t, y, w], i, all) => {
      const right = 940 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 20, 0);
      return button('link', at(right - w, 38, w, 30), t, { color: bone, underline: false, fontSize: 13, fontWeight: 700, letterSpacing: 2, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(964, 28, 156, 48), 'ĐẶT LỊCH', scrollYHref(BOOKING), { fontSize: 18 }),
  );

  // Hero: giant stacked words beside a portrait, a splash of red ink behind it.
  els.push(
    doodle('splatter', at(560, 100, 380, 320), red, { seed: 17, density: 50 }),
    photo(at(660, 120, 460, 680), '1475695752828-6d2b0a83cf8a', 'Cô gái với những hình xăm'),
    small(at(X, 150, 500, 20), '★ EST. 2015 · QUẬN 1, SÀI GÒN'),
    tint(big(at(X - 6, 180, 640, 450), 'XĂM\nLÀ\nKÝ ỨC', bone, 150, { lineHeight: 0.98, letterSpacing: 2 }), 'KÝ ỨC'),
    para(at(X, 646, 500, 84), 'Mỗi hình xăm là một câu chuyện bạn mang theo cả đời. Chúng tôi vẽ riêng cho bạn, xăm bằng kim dùng một lần và mực hữu cơ nhập khẩu.', grey, { fontSize: 17 }),
    solid(at(X, 748, 210, 56), 'ĐẶT LỊCH TƯ VẤN', scrollYHref(BOOKING)),
    outline(at(X + 226, 748, 180, 56), 'XEM TÁC PHẨM', scrollYHref(WORK)),
  );

  // A red ribbon of styles, slightly askew.
  els.push(
    { ...box(at(-40, 880, W + 80, 72), { background: red, radius: 0 }), rotation: -2 },
    { ...big(at(-40, 892, W + 80, 48), 'BLACKWORK ✦ FINE LINE ✦ REALISM ✦ JAPANESE ✦ OLD SCHOOL ✦ LETTERING ✦ COVER-UP', '#ffffff', 34, { textAlign: 'center', letterSpacing: 3, lineHeight: 1.3 }), rotation: -2 },
  );

  // Styles: a typographic list, one big line each.
  els.push(
    small(at(X, STYLES, 400, 20), '(01) PHONG CÁCH'),
    tint(big(at(X, STYLES + 24, 800, 88), 'CHÚNG TÔI XĂM GÌ?', bone, 64), 'GÌ?'),
  );
  ;[
    ['Blackwork', 'Mảng đen đặc, hoa văn hình học, tribal hiện đại.'],
    ['Fine line', 'Nét mảnh như bút chì, chữ nhỏ, hoa lá tối giản.'],
    ['Realism', 'Chân dung, thú cưng, phong cảnh đen xám chân thật.'],
    ['Japanese', 'Cá chép, rồng, sóng, hoa anh đào, kín tay kín lưng.'],
    ['Old school', 'Viền đậm, màu tươi, hình kinh điển của thuỷ thủ.'],
    ['Cover-up', 'Che và sửa hình cũ, xoá ký ức bạn muốn quên.'],
  ].forEach(([t, desc], i) => {
    const top = STYLES + 140 + i * 92;
    els.push(
      line(at(X, top - 10, CW, 12), '#2a2827', 1),
      small(at(X, top + 22, 60, 22), String(i + 1).padStart(2, '0'), grey),
      big(at(X + 70, top - 4, 520, 74), t.toUpperCase(), i === 0 ? red : bone, 54, { letterSpacing: 2 }),
      para(at(700, top + 18, 420, 30), desc, grey, { fontSize: 15, textAlign: 'right' }),
    );
  });

  // Work: a staggered grid.
  els.push(
    small(at(X, WORK, 400, 20), '(02) TÁC PHẨM'),
    tint(big(at(X, WORK + 24, 900, 88), 'DA LÀ TẤM TOAN CỦA CHÚNG TÔI', bone, 64), 'TẤM TOAN'),
  );
  ;[
    ['1598371839696-5c5bb00bdc28', at(X, WORK + 140, 330, 480), 'Hoa mẫu đơn · fine line · 4 giờ'],
    ['1611501275019-9b5cda994e8d', at(435, WORK + 200, 330, 240), 'Kín lưng · blackwork · 3 buổi'],
    ['1542727365-19732a80dcfd', at(435, WORK + 470, 330, 240), 'Chữ viết tay · fine line · 40 phút'],
    ['1604374376934-2df6fad6519b', at(790, WORK + 140, 330, 480), 'Kín tay · realism · 5 buổi'],
  ].forEach(([id, b, caption]) => {
    els.push(
      photo(b, id, caption),
      text('caption', at(b.x, b.y + b.h + 8, b.w, 20), caption, { color: grey, fontSize: 12, letterSpacing: 1 }),
    );
  });

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 2560, W, 340), props: { src: unsplash('1568515045052-f9a854d70bfd', 1600, 1100), alt: 'Thợ xăm đang làm việc' }, style: { radius: 0 } }),
    box(at(0, 2560, W, 340), { background: 'rgba(13,13,13,0.55)', radius: 0 }),
    tint(big(at(X, 2636, CW, 190), 'ĐAU MỘT LẦN.\nĐẸP CẢ ĐỜI.', bone, 70, { textAlign: 'center', lineHeight: 1.3, letterSpacing: 3 }), 'ĐẸP CẢ ĐỜI.'),
  );

  // Artists: text-only cards with a big number.
  els.push(
    small(at(X, ARTISTS, 400, 20), '(03) THỢ XĂM'),
    tint(big(at(X, ARTISTS + 24, 900, 88), 'NHỮNG BÀN TAY CẦM KIM', bone, 64), 'CẦM KIM'),
  );
  ;[
    ['Khoa “Ink”', 'Blackwork · Japanese', '12 năm', '@khoa.ink', 'Người mở tiệm. Mê rồng, cá chép và những mảng đen thật đặc.'],
    ['Vy Nguyễn', 'Fine line · Lettering', '6 năm', '@vy.fineline', 'Nét mảnh, hoa lá tối giản, chữ viết tay cho những hình đầu tiên.'],
    ['Duy Trần', 'Realism · Cover-up', '9 năm', '@duy.realism', 'Chân dung đen xám, thú cưng, và sửa giúp những hình xăm cũ.'],
  ].forEach(([name, style, years, handle, bio], i) => {
    const c = col3(i, 24);
    const top = ARTISTS + 140;
    els.push(
      box(at(c.x, top, c.w, 330), { background: panel, radius: 0, borderWidth: 1, borderColor: '#2a2827' }),
      big(at(c.x + 28, top + 18, 120, 100), String(i + 1).padStart(2, '0'), i === 0 ? red : '#2f2c2a', 96, { lineHeight: 1.05 }),
      big(at(c.x + 28, top + 128, c.w - 56, 44), name.toUpperCase(), bone, 34),
      small(at(c.x + 28, top + 176, c.w - 56, 20), style.toUpperCase(), red, { fontSize: 12 }),
      para(at(c.x + 28, top + 206, c.w - 56, 76), bio, grey, { fontSize: 15 }),
      text('caption', at(c.x + 28, top + 290, c.w - 56, 20), `${years} kinh nghiệm · ${handle}`, { color: bone, fontSize: 13, fontWeight: 600 }),
    );
  });

  // Process and aftercare, side by side.
  els.push(
    photo(at(X, 3560, CW, 260), '1552627019-947c3789ffb5', 'Thợ xăm trong studio', { opacity: 0.9 }),
    small(at(X, 3870, 500, 20), '(04) QUY TRÌNH'),
    small(at(640, 3870, 480, 20), '(05) CHĂM SÓC SAU XĂM'),
  );
  ;[
    ['Tư vấn & vẽ mẫu', 'Gặp trực tiếp hoặc qua Zalo, thợ vẽ mẫu riêng trong 3 – 5 ngày.'],
    ['Đặt cọc 30%', 'Giữ lịch và mẫu vẽ; trừ vào tổng chi phí.'],
    ['Ngày xăm', 'Kim và găng dùng một lần, khử khuẩn trước mặt bạn.'],
    ['Tái khám miễn phí', 'Dặm lại màu sau 4 tuần nếu cần.'],
  ].forEach(([t, desc], i) => {
    const top = 3906 + i * 52;
    els.push(
      big(at(X, top, 40, 30), String(i + 1), red, 26, { lineHeight: 1.15 }),
      text('subheading', at(X + 40, top + 2, 480, 24), t, { color: bone, fontSize: 16, fontWeight: 700 }),
      para(at(X + 40, top + 24, 480, 24), desc, grey, { fontSize: 14, lineHeight: 1.5 }),
    );
  });
  els.push(
    text('list', at(640, 3906, 480, 210), '✕  Không ngâm nước, đi bơi, xông hơi trong 2 tuần\n✕  Không gãi, không bóc vảy\n✓  Rửa nhẹ bằng nước ấm, thấm khô 2 lần mỗi ngày\n✓  Thoa kem dưỡng tiệm tặng, che nắng khi ra đường\n✓  Nhắn thợ ngay nếu sưng đỏ bất thường', { color: bone, fontSize: 15, lineHeight: 2 }),
  );

  // Booking.
  els.push(
    box(at(X, BOOKING, CW, 400), { background: red, radius: 0 }),
    doodle('ink', at(X + 820, BOOKING + 160, 200, 200), '#8f0b20', { seed: 8, inkStyle: 'splash' }),
    big(at(X + 56, BOOKING + 36, 700, 172), 'TƯ VẤN & VẼ MẪU\nMIỄN PHÍ', '#ffffff', 64),
    para(at(X + 56, BOOKING + 214, 560, 56), 'Gửi ý tưởng, vị trí và kích thước qua Zalo. Thợ sẽ báo giá và hẹn lịch trong ngày.', '#ffe3e7', { fontSize: 16 }),
    button('primary', at(X + 56, BOOKING + 290, 230, 56), 'GỌI 0901 234 567', { background: black, color: '#ffffff', fontFamily: heavy, fontSize: 20, fontWeight: 800, letterSpacing: 2, radius: 0 }, { href: 'tel:0901234567' }),
    outline(at(X + 302, BOOKING + 290, 170, 56), 'NHẮN ZALO', 'https://zalo.me/0901234567', '#ffffff'),
    small(at(780, BOOKING + 56, 300, 20), 'BẢNG GIÁ THAM KHẢO', '#ffe3e7'),
    text('list', at(780, BOOKING + 86, 300, 150), 'Hình nhỏ (dưới 5 cm)   từ 500K\nTheo giờ   1.200K / giờ\nKín tay, kín lưng   báo giá riêng\nĐặt cọc   30%', { color: '#ffffff', fontSize: 15, fontWeight: 600, lineHeight: 2 }),
  );

  // Footer.
  els.push(
    line(at(X, 4610, CW, 12), '#2a2827', 1),
    big(at(X, 4640, 300, 44), 'MỰC ĐEN', bone, 32, { letterSpacing: 4 }),
    text('paragraph', at(X, 4688, 600, 50), '📍 18 Bùi Viện, Phạm Ngũ Lão, Quận 1 · 13:00 – 22:00 mỗi ngày\nChỉ nhận khách từ 18 tuổi, mang theo giấy tờ tuỳ thân.', { color: grey, fontSize: 13, lineHeight: 1.8 }),
    ...contactIcons(rightAligned(W - X, 3, 34, 12), 4646, bone, 34, 12),
    text('caption', at(640, 4708, W - X - 640, 20), '© 2026 Mực Đen Tattoo Studio', { color: '#5a5654', fontSize: 12, textAlign: 'right' }),
  );

  return {
    name: 'Tiệm xăm',
    description: 'Nền đen, chữ trắng ngà và đỏ: chữ chồng cỡ lớn, dải chữ nghiêng, danh sách phong cách xăm, lưới tác phẩm so le, ảnh cuộn, thợ xăm, chăm sóc sau xăm',
    page: { title: 'Mực Đen – Tattoo Studio Sài Gòn', width: W, height: H, background: black },
    elements: els,
  };
}
