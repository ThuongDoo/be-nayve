import { W, X, CW, at, text, button, icon, box, shape, col3, contactIcons, rightAligned, doodle, moving, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 29;

// ---------------------------------------------------------------- real-estate agent (navy + gold, listings with prices)

export default function realEstate() {
  const cream = '#faf7f2';
  const navy = '#0f1f3a';
  const gold = '#c9a35b';
  const goldSoft = '#f4ead6';
  const ink = '#1b2433';
  const soft = '#5f6b7d';
  const mist = '#c7d0de';
  const heading = 'playfair';
  const H = 5480;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 16, ...style } });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heading, fontSize, fontWeight: 700, lineHeight: 1.25, letterSpacing: 0, ...extra });
  /** Gives `word` (inside the element's text) its own colour, like recolouring it in the editor. */
  const tint = (el, word, color) => {
    const start = el.props.text.indexOf(word);
    return start < 0 ? el : { ...el, props: { ...el.props, marks: [{ start, end: start + word.length, color }] } };
  };
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.7, ...extra });
  /** Gold label + title with one word in gold, centred. Returns [elements, bottomY]. */
  const head = (y, label, t, word, { color = ink, wordColor = gold } = {}) => [
    [
      text('label', at(X, y, CW, 22), label, { color: gold, textAlign: 'center', letterSpacing: 3 }),
      tint(title(at(X, y + 30, CW, 62), t, color, 42, { textAlign: 'center' }), word, wordColor),
    ],
    y + 116,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: gold, color: navy, fontWeight: 700, radius: 10, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = navy) =>
    button('outline', b, t, { color, borderColor: color, radius: 10, fontWeight: 600 }, { href, newTab: href.startsWith('http') });
  /** A small rounded label (property type, badge). */
  const pill = (b, t, background, color) =>
    text('caption', b, t, { background, color, fontSize: 12, fontWeight: 700, letterSpacing: 1, textAlign: 'center', verticalAlign: 'middle', radius: 999 });

  // Section tops, also the targets of the menu's in-page links.
  const LISTINGS = 1380;
  const PROJECT = 2540;
  const LOAN = 4060;
  const CONTACT = 4900;

  // Header and hero on one navy band.
  els.push(
    box(at(0, 0, W, 760), { background: navy, radius: 0 }),
    title(at(X, 24, 320, 44), 'Minh Tuấn Land', gold, 28),
    ...[
      ['Nhà đang bán', LISTINGS, 440, 130],
      ['Dự án', PROJECT, 580, 80],
      ['Vay vốn', LOAN, 670, 90],
      ['Liên hệ', CONTACT, 770, 90],
    ].map(([t, y, x, w]) =>
      button('link', at(x, 32, w, 30), t, { color: '#ffffff', underline: false, fontSize: 15, fontWeight: 500, textAlign: 'center' }, { href: scrollYHref(y) }),
    ),
    solid(at(930, 24, 190, 46), '☎  0901 234 567', 'tel:0901234567', { fontSize: 15 }),
    box(at(X, 92, CW, 1), { background: 'rgba(255,255,255,0.12)', radius: 0 }),

    text('label', at(X, 170, 540, 22), 'CHUYÊN VIÊN TƯ VẤN BẤT ĐỘNG SẢN · TP.HCM', { color: gold, letterSpacing: 3 }),
    tint(title(at(X, 204, 560, 140), 'Tìm đúng ngôi nhà,\nđầu tư đúng thời điểm', '#ffffff', 50), 'đúng ngôi nhà', gold),
    para(at(X, 366, 500, 84), 'Căn hộ, nhà phố, biệt thự đã kiểm tra pháp lý. Tư vấn tận tâm từ lúc xem nhà đến khi nhận sổ, hỗ trợ vay ngân hàng đến 70%.', mist),
    solid(at(X, 474, 210, 56), 'Xem nhà đang bán', scrollYHref(LISTINGS), { fontSize: 16 }),
    outline(at(X + 226, 474, 170, 56), 'Gọi tư vấn', 'tel:0901234567', '#ffffff'),
    ...[
      ['500+', 'giao dịch thành công'],
      ['8 năm', 'kinh nghiệm'],
      ['98%', 'khách hài lòng'],
    ].flatMap(([n, t], i) => [
      title(at(X + i * 180, 596, 170, 44), n, gold, 34),
      text('caption', at(X + i * 180, 642, 170, 22), t, { color: mist, fontSize: 13 }),
    ]),
    photo(at(660, 130, 460, 570), '1600585154340-be6161a56a0c', 'Nhà phố hiện đại lúc chiều tối', { radius: 24 }),
    moving(
      text('subheading', at(560, 610, 250, 64), '🏡  120+ căn đang mở bán', { background: '#ffffff', color: navy, fontSize: 16, fontWeight: 700, textAlign: 'center', verticalAlign: 'middle', radius: 14, shadow: 'lg' }),
      'float',
      3,
    ),
  );

  // About the agent.
  els.push(
    doodle('sparkle', at(X, 850, 40, 40), gold, { seed: 4 }),
    shape('circle', at(X + 40, 860, 380, 380), { background: goldSoft }, {
      src: `${unsplash('1560250097-0b93528c311a', 800, 800)}&crop=faces`,
      imgW: 800,
      imgH: 800,
      alt: 'Ảnh chân dung chuyên viên tư vấn',
      rim: 6,
      rimColor: gold,
    }),
    pill(at(X + 250, 1180, 200, 40), '✓ Chứng chỉ môi giới', navy, '#ffffff'),
    text('label', at(560, 900, 560, 22), 'VỀ TÔI', { color: gold, letterSpacing: 3 }),
    tint(title(at(560, 930, 560, 60), 'Xin chào, tôi là Minh Tuấn', ink, 40), 'Minh Tuấn', gold),
    para(at(560, 1004, 540, 112), 'Tôi đã đồng hành cùng hơn 500 gia đình tìm được nhà ở và tài sản đầu tư tại TP.HCM. Tôi chỉ giới thiệu sản phẩm đã tự đi xem và kiểm tra pháp lý, nói rõ ưu và nhược điểm để bạn quyết định đúng.'),
    text('list', at(560, 1130, 540, 100), '✓  Tư vấn miễn phí, không ép mua\n✓  Đưa đón xem nhà tận nơi, cả cuối tuần\n✓  Hỗ trợ thủ tục công chứng, sang tên, vay vốn', { color: ink, fontSize: 15, lineHeight: 1.9 }),
  );

  // Listings with prices.
  let [h, y] = head(LISTINGS, 'NHÀ ĐANG BÁN', 'Sản phẩm nổi bật tuần này', 'nổi bật');
  els.push(...h);
  ;[
    ['1560448204-e02f11c3d0e2', 'CĂN HỘ', 'Căn hộ 2PN view sông', 'Thảo Điền, TP. Thủ Đức', '75 m²  ·  2 PN  ·  2 WC', '4,2 tỷ'],
    ['1600607687939-ce8a6c25118c', 'CĂN HỘ', 'Căn hộ 3PN nội thất cao cấp', 'Phú Mỹ Hưng, Quận 7', '110 m²  ·  3 PN  ·  2 WC', '6,8 tỷ'],
    ['1522708323590-d24dbb6b0267', 'STUDIO', 'Studio cho thuê sinh lời', 'Bình Thạnh, gần trung tâm', '35 m²  ·  1 PN  ·  1 WC', '1,9 tỷ'],
    ['1512917774080-9991f1c4c750', 'NHÀ PHỐ', 'Nhà phố có hồ bơi riêng', 'An Phú, TP. Thủ Đức', '5 × 20 m  ·  4 PN  ·  5 WC', '15,5 tỷ'],
    ['1613490493576-7fde63acd811', 'BIỆT THỰ', 'Biệt thự hiện đại ven sông', 'Quận 9, TP. Thủ Đức', '320 m²  ·  5 PN  ·  6 WC', '32 tỷ'],
    ['1564013799919-ab600027ffc6', 'NGHỈ DƯỠNG', 'Villa nghỉ dưỡng ven biển', 'Long Hải, Bà Rịa – Vũng Tàu', '450 m²  ·  4 PN  ·  4 WC', '18 tỷ'],
  ].forEach(([id, type, t, place, specs, price], i) => {
    const c = col3(i % 3, 32);
    const top = y + 30 + Math.floor(i / 3) * 470;
    els.push(
      box(at(c.x, top, c.w, 430), { background: '#ffffff', radius: 18, shadow: 'md' }),
      photo(at(c.x + 12, top + 12, c.w - 24, 220), id, t, { radius: 12 }),
      pill(at(c.x + 24, top + 24, 104, 28), type, gold, navy),
      title(at(c.x + 22, top + 246, c.w - 44, 32), t, ink, 21),
      text('caption', at(c.x + 22, top + 282, c.w - 44, 22), `📍 ${place}`, { color: soft, fontSize: 14 }),
      text('caption', at(c.x + 22, top + 310, c.w - 44, 22), specs, { color: ink, fontSize: 14, fontWeight: 600 }),
      box(at(c.x + 22, top + 346, c.w - 44, 1), { background: '#e8e2d6', radius: 0 }),
      title(at(c.x + 22, top + 364, 140, 40), price, gold, 26),
      outline(at(c.x + c.w - 152, top + 366, 130, 40), 'Xem chi tiết', scrollYHref(CONTACT)),
    );
  });

  // Featured project on navy.
  els.push(
    box(at(0, PROJECT, W, 640), { background: navy, radius: 0 }),
    photo(at(X, PROJECT + 60, 520, 520), '1545324418-cc1a3fa10c00', 'Toà căn hộ của dự án', { radius: 20 }),
    pill(at(X + 20, PROJECT + 80, 150, 32), 'ĐANG MỞ BÁN', gold, navy),
    text('label', at(660, PROJECT + 70, 460, 22), 'DỰ ÁN NỔI BẬT', { color: gold, letterSpacing: 3 }),
    title(at(660, PROJECT + 100, 460, 56), 'The Aurora Riverside', '#ffffff', 40),
    para(at(660, PROJECT + 166, 460, 84), 'Khu căn hộ ven sông với công viên 2 ha, trường học và trung tâm thương mại ngay trong khu. Cách trung tâm Quận 1 chỉ 15 phút.', mist),
    ...[
      ['VỊ TRÍ', 'Ven sông, TP. Thủ Đức'],
      ['QUY MÔ', '3 tháp · 1.200 căn'],
      ['PHÁP LÝ', 'Sổ hồng lâu dài'],
      ['BÀN GIAO', 'Quý IV/2027'],
      ['GIÁ TỪ', '52 triệu/m²'],
      ['THANH TOÁN', 'Chỉ 15% ký HĐMB'],
    ].flatMap(([k, v], i) => {
      const x = 660 + (i % 2) * 240;
      const top = PROJECT + 274 + Math.floor(i / 2) * 74;
      return [
        text('caption', at(x, top, 220, 20), k, { color: gold, fontSize: 12, fontWeight: 700, letterSpacing: 2 }),
        text('subheading', at(x, top + 24, 220, 28), v, { color: '#ffffff', fontSize: 17, fontWeight: 600 }),
      ];
    }),
    solid(at(660, PROJECT + 510, 280, 56), 'Nhận bảng giá & mặt bằng', scrollYHref(CONTACT), { fontSize: 16 }),
  );

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 3180, W, 360), props: { src: unsplash('1582407947304-fd86f028f716', 1600, 1100), alt: 'Các toà nhà cao tầng' }, style: { radius: 0 } }),
    box(at(0, 3180, W, 360), { background: 'rgba(15,31,58,0.6)', radius: 0 }),
    tint(title(at(140, 3280, 920, 130), 'Mua nhà là quyết định lớn.\nHãy để người hiểu thị trường đồng hành cùng bạn.', '#ffffff', 34, { textAlign: 'center', lineHeight: 1.5 }), 'đồng hành', gold),
  );

  // Why work with me.
  ;[h, y] = head(3620, 'VÌ SAO CHỌN TÔI', 'An tâm từ lúc xem nhà đến khi nhận sổ', 'An tâm');
  els.push(...h);
  ;[
    ['shield', 'Pháp lý rõ ràng', 'Kiểm tra sổ, quy hoạch và chủ sở hữu trước khi giới thiệu.'],
    ['chart', 'Giá sát thị trường', 'So sánh giá giao dịch thật trong khu vực, không thổi giá.'],
    ['wallet', 'Hỗ trợ vay vốn', 'Làm hồ sơ vay với 5 ngân hàng, giải ngân nhanh.'],
    ['support', 'Đồng hành sau bán', 'Hỗ trợ bàn giao, cho thuê lại và bán lại khi cần.'],
  ].forEach(([ic, t, desc], i) => {
    const w = (CW - 3 * 24) / 4;
    const x = X + i * (w + 24);
    els.push(
      box(at(x, y + 20, w, 250), { background: '#ffffff', radius: 18, borderWidth: 1, borderColor: '#ece5d8' }),
      icon(ic, at(x + 24, y + 44, 56, 56), gold, { background: goldSoft, radius: 999 }, 'icon', { iconSize: 46 }),
      text('subheading', at(x + 24, y + 118, w - 48, 30), t, { color: ink, fontSize: 19, fontWeight: 700 }),
      para(at(x + 24, y + 154, w - 48, 96), desc, soft, { fontSize: 15 }),
    );
  });

  // Bank loans.
  els.push(
    box(at(0, LOAN, W, 260), { background: goldSoft, radius: 0 }),
    text('label', at(X, LOAN + 50, 520, 22), 'HỖ TRỢ TÀI CHÍNH', { color: navy, letterSpacing: 3 }),
    tint(title(at(X, LOAN + 80, 560, 56), 'Vay đến 70% giá trị nhà', ink, 38), '70%', gold),
    para(at(X, LOAN + 144, 540, 60), 'Liên kết 5 ngân hàng lớn, ân hạn nợ gốc đến 24 tháng. Tư vấn hồ sơ và tính khoản trả hằng tháng miễn phí.'),
    ...[
      ['70%', 'hạn mức vay'],
      ['24', 'tháng ân hạn gốc'],
      ['6,5%', 'lãi suất từ /năm'],
    ].flatMap(([n, t], i) => {
      const x = 700 + i * 140;
      return [
        title(at(x, LOAN + 86, 130, 50), n, navy, 36, { textAlign: 'center' }),
        text('caption', at(x, LOAN + 140, 130, 22), t, { color: soft, fontSize: 13, textAlign: 'center' }),
      ];
    }),
  );

  // Reviews.
  ;[h, y] = head(4400, 'KHÁCH HÀNG NÓI GÌ', 'Những gia đình đã tìm được nhà', 'tìm được nhà');
  els.push(...h);
  ;[
    ['“Anh Tuấn dẫn đi xem 6 căn trong một buổi sáng, nói rõ căn nào hướng nắng chiều. Vợ chồng tôi chốt được căn ưng ý ngay tuần đó.”', 'Chị Lan Anh', 'Mua căn hộ 2PN, Thảo Điền'],
    ['“Hồ sơ vay ngân hàng tôi tưởng rắc rối, anh lo hết từ A đến Z. Giải ngân chỉ trong 10 ngày.”', 'Anh Quốc Huy', 'Mua nhà phố, An Phú'],
    ['“Mua để cho thuê, anh tư vấn studio gần trường đại học. Sau 3 tháng đã có khách thuê ổn định.”', 'Chị Thu Trang', 'Nhà đầu tư, Bình Thạnh'],
  ].forEach(([q, name, note], i) => {
    const c = col3(i, 32);
    els.push(
      box(at(c.x, y + 20, c.w, 250), { background: '#ffffff', radius: 18, shadow: 'sm' }),
      text('paragraph', at(c.x + 24, y + 42, 140, 26), '★★★★★', { color: gold, fontSize: 18, letterSpacing: 2 }),
      para(at(c.x + 24, y + 76, c.w - 48, 120), q, ink, { fontSize: 15, italic: true }),
      text('subheading', at(c.x + 24, y + 200, c.w - 48, 24), name, { color: navy, fontSize: 16, fontWeight: 700 }),
      text('caption', at(c.x + 24, y + 226, c.w - 48, 20), note, { color: soft, fontSize: 13 }),
    );
  });

  // Contact.
  els.push(
    box(at(X, CONTACT, CW, 380), { background: navy, radius: 28 }),
    doodle('sparkle', at(X + 980, CONTACT + 30, 36, 36), gold, { seed: 7 }),
    text('label', at(X + 60, CONTACT + 56, 540, 22), 'LIÊN HỆ', { color: gold, letterSpacing: 3 }),
    tint(title(at(X + 60, CONTACT + 86, 560, 112), 'Đặt lịch xem nhà\nmiễn phí ngay hôm nay', '#ffffff', 40), 'miễn phí', gold),
    para(at(X + 60, CONTACT + 210, 520, 56), 'Gọi hoặc nhắn Zalo, tôi gửi bảng giá, video thực tế và hẹn lịch xem nhà trong ngày.', mist),
    solid(at(X + 60, CONTACT + 286, 240, 56), '☎  Gọi 0901 234 567', 'tel:0901234567', { fontSize: 16 }),
    outline(at(X + 316, CONTACT + 286, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567', '#ffffff'),
    text('label', at(700, CONTACT + 60, 360, 22), 'VĂN PHÒNG', { color: gold, letterSpacing: 3 }),
    text('list', at(700, CONTACT + 94, 380, 130), '📍 12 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức\n🕗 8:00 – 20:00, cả thứ Bảy và Chủ nhật\n✉️ minhtuan.land@example.com', { color: '#ffffff', fontSize: 15, lineHeight: 2 }),
    ...contactIcons(700, CONTACT + 260, '#ffffff', 34, 12),
  );

  // Footer.
  els.push(
    title(at(X, 5350, 320, 40), 'Minh Tuấn Land', gold, 26),
    text('caption', at(X, 5394, 460, 22), 'Tư vấn mua bán căn hộ, nhà phố, biệt thự · TP.HCM', { color: soft, fontSize: 13 }),
    text('caption', at(rightAligned(W - X, 1, 420, 0), 5370, 420, 22), '© 2026 Minh Tuấn Land. Thông tin chỉ mang tính tham khảo.', { color: soft, fontSize: 13, textAlign: 'right' }),
  );

  return {
    name: 'Môi giới bất động sản',
    description: 'Xanh navy và vàng ánh kim: hero có số liệu, giới thiệu chuyên viên, 6 căn có giá và thông số, dự án nổi bật, hỗ trợ vay, đánh giá, đặt lịch xem nhà',
    page: { title: 'Minh Tuấn Land – Tư vấn bất động sản TP.HCM', width: W, height: H, background: cream },
    elements: els,
  };
}
