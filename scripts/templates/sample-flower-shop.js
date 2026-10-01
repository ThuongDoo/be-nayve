import { W, X, CW, at, text, button, icon, box, shape, col3, contactIcons, rightAligned, doodle, moving, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 25;

// ---------------------------------------------------------------- flower shop (blush + forest green, centred logo, arches)

export default function flowerShop() {
  const cream = '#fff8f5';
  const blush = '#f9e1e0';
  const rose = '#d6577a';
  const green = '#2f4a3a';
  const ink = '#3a2e2e';
  const soft = '#7d6b6b';
  const heading = 'yeseva';
  const script = 'great-vibes';
  const H = 4840;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 18, ...style } });
  const framed = (kind, b, id, alt, extra = {}) =>
    shape(kind, b, { background: blush }, { src: unsplash(id, 800, 1000), imgW: 800, imgH: 1000, alt, ...extra });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heading, fontSize, fontWeight: 400, lineHeight: 1.3, letterSpacing: 0, ...extra });
  /** Gives `word` (inside the element's text) its own colour, like recolouring it in the editor. */
  const tint = (el, word, color) => {
    const start = el.props.text.indexOf(word);
    return start < 0 ? el : { ...el, props: { ...el.props, marks: [{ start, end: start + word.length, color }] } };
  };
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.7, ...extra });
  /** Rose label + title with one word in rose, centred. Returns [elements, bottomY]. */
  const head = (y, label, t, word, { color = ink, wordColor = rose, labelColor = rose } = {}) => [
    [
      text('label', at(X, y, CW, 22), label, { color: labelColor, textAlign: 'center', letterSpacing: 3 }),
      tint(title(at(X, y + 30, CW, 62), t, color, 44, { textAlign: 'center' }), word, wordColor),
    ],
    y + 116,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: rose, color: '#ffffff', fontWeight: 600, radius: 999, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = green) =>
    button('outline', b, t, { color, borderColor: color, radius: 999, fontWeight: 600 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const BOUQUETS = 1120;
  const OCCASIONS = 2300;
  const ORDER = 3240;
  const CONTACT = 4260;

  // Delivery strip, then a menu split around a centred logo.
  els.push(
    box(at(0, 0, W, 40), { background: green, radius: 0 }),
    text('paragraph', at(X, 9, CW, 22), '🌸  Miễn phí giao hoa nội thành Hà Nội cho đơn từ 500K · Giao nhanh trong 2 giờ', { color: '#f3e9e4', fontSize: 13, textAlign: 'center' }),
    text('title', at(W / 2 - 160, 50, 320, 70), 'Hoa Mộc', { color: rose, fontFamily: script, fontSize: 52, fontWeight: 400, lineHeight: 1.3, textAlign: 'center' }),
    ...[
      ['Bó hoa', BOUQUETS, 200],
      ['Theo dịp', OCCASIONS, 320],
      ['Cách đặt', ORDER, 790],
      ['Liên hệ', CONTACT, 910],
    ].map(([t, y, x]) =>
      button('link', at(x, 70, 100, 30), t, { color: ink, underline: false, fontSize: 15, fontWeight: 500, textAlign: 'center' }, { href: scrollYHref(y) }),
    ),
    icon('cart', at(1084, 66, 36, 36), ink, {}, 'iconPlain', { iconSize: 62, href: scrollYHref(CONTACT), label: 'Đặt hoa' }),
  );

  // Hero: centred words above three arches.
  els.push(
    doodle('sparkle', at(250, 200, 40, 40), rose, { seed: 5 }),
    doodle('sparkle', at(1000, 250, 30, 30), green, { seed: 9 }),
    text('label', at(X, 160, CW, 22), 'TIỆM HOA TƯƠI · HÀ NỘI', { color: rose, textAlign: 'center', letterSpacing: 4 }),
    tint(title(at(X, 190, CW, 150), 'Gửi yêu thương\nbằng những bó hoa tươi', ink, 56, { textAlign: 'center' }), 'yêu thương', rose),
    para(at(300, 356, 600, 56), 'Hoa nhập mỗi sáng, cắm theo câu chuyện của bạn, kèm thiệp viết tay. Giao tận tay người nhận trong 2 giờ.', soft, { textAlign: 'center' }),
    solid(at(W / 2 - 196, 436, 190, 52), 'Chọn bó hoa', scrollYHref(BOUQUETS), { fontSize: 15 }),
    outline(at(W / 2 + 6, 436, 190, 52), 'Gọi đặt nhanh', 'tel:0901234567'),
    framed('arch', at(180, 560, 260, 340), '1487530811176-3780de880c2d', 'Bó hoa nhiều màu'),
    framed('arch', at(470, 520, 260, 380), '1563241527-3004b7be0ffd', 'Bó hoa tông pastel'),
    framed('arch', at(760, 560, 260, 340), '1533616688419-b7a585564566', 'Bó hoa tông cam'),
    moving(button('pill', at(640, 830, 150, 40), '♥ Bán chạy nhất', { background: '#ffffff', color: rose, fontSize: 13, fontWeight: 700, shadow: 'md' }), 'float', 3),
  );

  // Promises.
  els.push(box(at(0, 940, W, 110), { background: blush, radius: 0 }));
  ;[
    ['truck', 'Giao trong 2 giờ'],
    ['leaf', 'Hoa tươi mỗi sáng'],
    ['gift', 'Thiệp viết tay'],
    ['camera', 'Ảnh trước khi giao'],
  ].forEach(([ic, t], i) => {
    const w = CW / 4;
    const x = X + i * w;
    els.push(
      icon(ic, at(x + 20, 971, 48, 48), rose, { background: '#ffffff', radius: 999 }, 'icon', { iconSize: 46 }),
      text('subheading', at(x + 80, 982, w - 90, 26), t, { color: ink, fontSize: 16, fontWeight: 600 }),
    );
  });

  // Bouquets.
  let [h, y] = head(BOUQUETS, 'BỘ SƯU TẬP', 'Những bó hoa bán chạy', 'bán chạy');
  els.push(...h);
  ;[
    ['1567696153798-9111f9cd3d0d', 'Nắng sớm', 'Hướng dương, cúc tana, gói giấy kraft', '450.000đ'],
    ['1591886960571-74d43a9d4166', 'Mộng mơ', 'Mẫu đơn hồng, hồng kem, lá bạc', '890.000đ'],
    ['1596438459194-f275f413d6ff', 'Tình đầu', 'Hồng pastel, cẩm chướng, baby trắng', '650.000đ'],
    ['1561181286-d3fee7d55364', 'Tulip Hà Lan', '10 cành tulip hồng cắm bình thuỷ tinh', '750.000đ'],
    ['1559563362-c667ba5f5480', 'Hồng đỏ Ecuador', 'Hồng nhập khẩu bông to, nhung đỏ', '1.200.000đ'],
    ['1455659817273-f96807779a8a', 'Giỏ hướng dương', 'Giỏ mây 15 bông, hợp khai trương', '980.000đ'],
  ].forEach(([id, t, desc, price], i) => {
    const c = col3(i % 3, 32);
    const top = y + 30 + Math.floor(i / 3) * 510;
    els.push(
      photo(at(c.x, top, c.w, 340), id, `Bó hoa ${t}`, { radius: 20 }),
      title(at(c.x, top + 354, c.w, 40), t, ink, 26),
      para(at(c.x, top + 394, c.w, 26), desc, soft, { fontSize: 14 }),
      text('subheading', at(c.x, top + 428, 160, 30), price, { color: rose, fontSize: 20, fontWeight: 700 }),
      outline(at(c.x + c.w - 120, top + 424, 120, 38), 'Đặt bó này', scrollYHref(CONTACT)),
    );
  });

  // Occasions on a green band.
  els.push(box(at(0, OCCASIONS, W, 460), { background: green, radius: 0 }));
  ;[h, y] = head(OCCASIONS + 60, 'THEO DỊP', 'Hoa cho mọi dịp đặc biệt', 'mọi dịp', { color: '#fdf6f3', wordColor: '#f6b8c6', labelColor: '#f6b8c6' });
  els.push(...h);
  ;[
    ['1582794543139-8ac9cb0f7b11', 'Sinh nhật'],
    ['1562690868-60bbe7293e94', 'Kỷ niệm'],
    ['1526047932273-341f2a7631f9', 'Valentine'],
    ['1520763185298-1b434c919102', 'Tốt nghiệp'],
    ['1502977249166-824b3a8a4d6d', 'Khai trương'],
  ].forEach(([id, t], i) => {
    const x = 120 + i * 200;
    els.push(
      shape('circle', at(x, y + 20, 160, 160), { background: blush }, { src: unsplash(id, 400, 400), imgW: 400, imgH: 400, alt: `Hoa ${t.toLowerCase()}`, rim: 4, rimColor: '#f6b8c6' }),
      text('subheading', at(x - 20, y + 196, 200, 28), t, { color: '#fdf6f3', fontSize: 17, fontWeight: 600, textAlign: 'center' }),
    );
  });

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 2760, W, 400), props: { src: unsplash('1494972308805-463bc619d34e', 1600, 1100), alt: 'Bức tường hoa hồng đỏ' }, style: { radius: 0 } }),
    box(at(0, 2760, W, 400), { background: 'rgba(58,46,46,0.45)', radius: 0 }),
    tint(title(at(140, 2870, 920, 130), 'Hoa không biết nói,\nnhưng luôn biết cách nói thay bạn.', '#ffffff', 42, { textAlign: 'center' }), 'nói thay bạn', '#f9c8d4'),
    text('paragraph', at(X, 3020, CW, 50), 'Hoa Mộc', { color: '#ffffff', fontFamily: script, fontSize: 36, textAlign: 'center', lineHeight: 1.3 }),
  );

  // How to order.
  ;[h, y] = head(ORDER, 'CÁCH ĐẶT HOA', 'Ba bước, hoa đến tận tay', 'tận tay');
  els.push(...h);
  ;[
    ['1', 'Chọn hoa', 'Chọn một bó trong bộ sưu tập, hoặc kể cho tiệm nghe dịp và ngân sách của bạn.'],
    ['2', 'Nhắn Zalo hoặc gọi', 'Gửi tên, địa chỉ người nhận, lời nhắn trên thiệp. Tiệm gửi ảnh mẫu để bạn duyệt.'],
    ['3', 'Nhận hoa tận tay', 'Shipper giao trong 2 giờ, chụp ảnh lúc trao hoa gửi lại cho bạn.'],
  ].forEach(([n, t, desc], i) => {
    const c = col3(i, 40);
    els.push(
      text('title', at(c.x + (c.w - 72) / 2, y + 30, 72, 72), n, { color: '#ffffff', background: i === 1 ? rose : green, fontFamily: heading, fontSize: 30, fontWeight: 400, lineHeight: 1.3, textAlign: 'center', verticalAlign: 'middle', radius: 999 }),
      text('subheading', at(c.x, y + 122, c.w, 30), t, { color: ink, fontSize: 20, fontWeight: 700, textAlign: 'center' }),
      para(at(c.x + 10, y + 160, c.w - 20, 80), desc, soft, { fontSize: 15, textAlign: 'center' }),
    );
  });

  // Story + review.
  els.push(
    framed('arch', at(X, 3660, 420, 520), '1518895949257-7621c3c786d7', 'Một cành hồng trong bình'),
    text('label', at(580, 3690, 540, 22), 'CHUYỆN CỦA TIỆM', { color: rose, letterSpacing: 3 }),
    tint(title(at(580, 3720, 540, 120), 'Một tiệm nhỏ,\nnhiều câu chuyện lớn', ink, 42), 'câu chuyện', rose),
    para(at(580, 3856, 520, 110), 'Hoa Mộc bắt đầu từ một góc ban công năm 2018. Mỗi bó hoa đều được cắm bởi một người, cho một người, với một lời nhắn riêng. Chúng tôi chọn hoa mỗi sáng ở chợ Quảng An và nhà vườn Đà Lạt.'),
    box(at(580, 3990, 540, 170), { background: blush, radius: 20 }),
    text('paragraph', at(608, 4010, 120, 30), '★★★★★', { color: rose, fontSize: 18, letterSpacing: 2 }),
    para(at(608, 4044, 484, 78), '“Đặt hoa cho mẹ ở quê lúc nửa đêm, sáng hôm sau mẹ gọi khoe bó hoa đẹp quá. Tiệm còn gửi cả ảnh lúc trao hoa.”', ink, { fontSize: 15, italic: true }),
    text('caption', at(608, 4126, 484, 22), 'Thu Hà · Khách đặt hoa từ xa', { color: green, fontSize: 14, fontWeight: 700 }),
  );

  // Contact.
  els.push(
    box(at(X, CONTACT, CW, 340), { background: green, radius: 28 }),
    doodle('sparkle', at(X + 980, CONTACT + 30, 36, 36), '#f6b8c6', { seed: 3 }),
    tint(title(at(X + 60, CONTACT + 48, 560, 64), 'Đặt hoa ngay hôm nay', '#fdf6f3', 42), 'ngay hôm nay', '#f6b8c6'),
    para(at(X + 60, CONTACT + 120, 520, 56), 'Nhắn Zalo hoặc gọi điện, tiệm tư vấn mẫu hoa và gửi ảnh trước khi giao.', '#dfe7e1'),
    solid(at(X + 60, CONTACT + 200, 230, 56), 'Gọi 0901 234 567', 'tel:0901234567', { fontSize: 16 }),
    outline(at(X + 306, CONTACT + 200, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567', '#fdf6f3'),
    text('label', at(700, CONTACT + 60, 360, 22), 'GHÉ TIỆM', { color: '#f6b8c6', letterSpacing: 3 }),
    text('list', at(700, CONTACT + 94, 380, 130), '📍 56 Tô Ngọc Vân, Tây Hồ, Hà Nội\n🕗 7:00 – 21:00, tất cả các ngày\n🚚 Giao hoa toàn Hà Nội, liên tỉnh qua đối tác', { color: '#fdf6f3', fontSize: 15, lineHeight: 2 }),
    ...contactIcons(700, CONTACT + 240, '#fdf6f3', 34, 12),
  );

  // Footer.
  els.push(
    text('title', at(X, 4690, 300, 60), 'Hoa Mộc', { color: rose, fontFamily: script, fontSize: 40, fontWeight: 400, lineHeight: 1.3 }),
    text('caption', at(X, 4752, 400, 22), 'Tiệm hoa tươi · Hà Nội', { color: soft, fontSize: 13 }),
    text('caption', at(rightAligned(W - X, 1, 400, 0), 4720, 400, 22), '© 2026 Hoa Mộc. Cắm bằng cả trái tim.', { color: soft, fontSize: 13, textAlign: 'right' }),
  );

  return {
    name: 'Shop hoa tươi',
    description: 'Hồng phấn và xanh rêu: logo giữa, hero 3 khung vòm, 6 bó hoa có giá, hoa theo dịp, ảnh cuộn, 3 bước đặt hoa, chữ tô màu từng từ',
    page: { title: 'Hoa Mộc – Tiệm hoa tươi Hà Nội', width: W, height: H, background: cream },
    elements: els,
  };
}
