import { W, X, CW, at, text, button, icon, box, line, shape, rightAligned, col3, contactIcons, moving, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 20;

// ---------------------------------------------------------------- veterinary hospital (light, teal + coral)

export default function vetClinic() {
  const cream = '#f6fbf9';
  const mint = '#d9f2ec';
  const teal = '#0f766e';
  const coral = '#ff7a59';
  const ink = '#12302f';
  const soft = '#5b7472';
  const round = 'baloo';
  const H = 5190;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 20, ...style } });
  const framed = (kind, b, id, alt, props = {}) =>
    shape(kind, b, { background: mint }, { src: unsplash(id, 900, 1100), imgW: 900, imgH: 1100, alt, ...props });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: round, fontSize, fontWeight: 800, lineHeight: 1.3, letterSpacing: 0, ...extra });
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.65, ...extra });
  const card = (b, extra = {}) => box(b, { background: '#ffffff', radius: 22, shadow: 'md', ...extra });
  /** Coral label + big rounded title, left or centred. Returns [elements, bottomY]. */
  const head = (y, label, t, { x = X, w = CW, align = 'left' } = {}) => [
    [
      text('label', at(x, y, w, 22), label, { color: coral, textAlign: align, letterSpacing: 3 }),
      title(at(x, y + 30, w, 60), t, ink, 42, { textAlign: align }),
    ],
    y + 116,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: coral, color: '#ffffff', fontWeight: 700, radius: 999, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = teal) =>
    button('outline', b, t, { color, borderColor: color, radius: 999, fontWeight: 600 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const SERVICES = 960;
  const DOCTORS = 2720;
  const PRICES = 3240;
  const BOOKING = 4490;

  // Emergency strip + menu.
  els.push(
    box(at(0, 0, W, 44), { background: teal, radius: 0 }),
    text('paragraph', at(X, 10, 600, 24), '🚑  Cấp cứu 24/7: 1900 1234', { color: '#ffffff', fontSize: 14, fontWeight: 600 }),
    text('paragraph', at(600, 10, W - X - 600, 24), 'Mở cửa 7:30 – 21:00, tất cả các ngày', { color: '#ccfbf1', fontSize: 14, textAlign: 'right' }),
    icon('heart', at(X, 70, 44, 44), '#ffffff', { background: teal, radius: 14 }, 'icon', { iconSize: 52 }),
    title(at(X + 56, 72, 300, 40), 'Thú Y An Tâm', teal, 26),
    ...[
      ['Dịch vụ', SERVICES, 70],
      ['Bác sĩ', DOCTORS, 60],
      ['Bảng giá', PRICES, 80],
      ['Đặt lịch', BOOKING, 76],
    ].map(([t, y, w], i, all) => {
      // Laid out right to left from the button, 26px apart.
      const right = 932 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 26, 0);
      return button('link', at(right - w, 76, w, 32), t, { color: ink, underline: false, fontSize: 15, fontWeight: 600, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(960, 68, 160, 48), 'Đặt lịch khám', scrollYHref(BOOKING), { fontSize: 15 }),
  );

  // Hero.
  els.push(
    shape('blob', at(600, 150, 560, 560), { background: mint }, { seed: 11 }),
    framed('arch', at(680, 190, 400, 500), '1516734212186-a967f81ad0d7', 'Bác sĩ thú y chăm sóc chú chó'),
    moving(card(at(590, 560, 230, 76)), 'float', 3.2),
    moving(icon('shield', at(606, 574, 48, 48), '#ffffff', { background: teal, radius: 14 }, 'icon', { iconSize: 50 }), 'float', 3.2),
    moving(text('subheading', at(664, 572, 150, 26), 'Bác sĩ trực 24/7', { color: ink, fontSize: 15, fontWeight: 700 }), 'float', 3.2),
    moving(text('caption', at(664, 598, 150, 22), 'Cả đêm và ngày lễ', { color: soft, fontSize: 13 }), 'float', 3.2),
    moving(icon('heart', at(1080, 180, 56, 56), '#ffffff', { background: coral, radius: 999 }, 'iconPlain', { iconSize: 52 }), 'heartbeat', 1.4),
    moving(text('paragraph', at(1086, 600, 50, 50), '🐾', { fontSize: 38, textAlign: 'center', lineHeight: 1 }), 'float', 2.6, 0.8),

    text('label', at(X, 196, 480, 22), 'BỆNH VIỆN THÚ Y · TP. HỒ CHÍ MINH', { color: coral, letterSpacing: 3 }),
    title(at(X, 230, 540, 160), 'Chăm sóc thú cưng\nnhư người trong nhà', ink, 54, { lineHeight: 1.25 }),
    para(at(X, 404, 500, 84), 'Đội ngũ bác sĩ tận tâm, trang thiết bị hiện đại và một không gian sạch sẽ, dịu nhẹ để các bé bớt sợ mỗi lần đi khám.', soft, { fontSize: 17 }),
    solid(at(X, 512, 200, 56), 'Đặt lịch khám', scrollYHref(BOOKING), { fontSize: 16 }),
    outline(at(X + 216, 512, 180, 56), 'Xem dịch vụ', scrollYHref(SERVICES)),
    text('paragraph', at(X, 600, 500, 26), '⭐ 4.9/5 từ hơn 2.300 đánh giá của chủ nuôi', { color: ink, fontSize: 15, fontWeight: 600 }),
  );

  // Numbers.
  ;[
    ['12', 'năm hoạt động'],
    ['15', 'bác sĩ thú y'],
    ['30.000+', 'bé đã được chăm sóc'],
    ['24/7', 'trực cấp cứu'],
  ].forEach(([n, cap], i) => {
    const w = (CW - 3 * 24) / 4;
    const x = X + i * (w + 24);
    els.push(
      card(at(x, 760, w, 120), { shadow: 'sm' }),
      title(at(x, 774, w, 50), n, teal, 36, { textAlign: 'center' }),
      text('caption', at(x, 830, w, 22), cap, { color: soft, fontSize: 14, textAlign: 'center' }),
    );
  });

  // Services.
  let [h, y] = head(SERVICES, 'DỊCH VỤ', 'Đầy đủ dịch vụ cho các bé', { align: 'center' });
  els.push(...h);
  ;[
    ['search', 'Khám tổng quát', 'Kiểm tra sức khoẻ định kỳ, xét nghiệm máu, siêu âm, X-quang.'],
    ['shield', 'Tiêm phòng & tẩy giun', 'Lịch tiêm theo độ tuổi, nhắc lịch qua Zalo trước mỗi mũi.'],
    ['plus', 'Phẫu thuật & triệt sản', 'Phòng mổ vô trùng, gây mê an toàn, theo dõi sau mổ.'],
    ['smile', 'Nha khoa thú cưng', 'Cạo vôi, nhổ răng, điều trị hôi miệng và viêm nướu.'],
    ['sparkles', 'Spa & cắt tỉa', 'Tắm, sấy, cắt tỉa lông, cắt móng, vệ sinh tai nhẹ nhàng.'],
    ['home', 'Lưu chuồng & khách sạn', 'Phòng riêng cho chó và mèo, camera theo dõi từ xa.'],
  ].forEach(([ic, t, desc], i) => {
    const c = col3(i % 3, 32);
    const top = y + 30 + Math.floor(i / 3) * 236;
    els.push(
      card(at(c.x, top, c.w, 212)),
      icon(ic, at(c.x + 28, top + 28, 56, 56), teal, { background: mint, radius: 18 }, 'icon', { iconSize: 48 }),
      text('subheading', at(c.x + 28, top + 100, c.w - 56, 30), t, { color: ink, fontSize: 20, fontWeight: 700 }),
      para(at(c.x + 28, top + 136, c.w - 56, 56), desc, soft, { fontSize: 15, lineHeight: 1.6 }),
    );
  });

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 1660, W, 420), props: { src: unsplash('1548199973-03cce0bbc87b', 1600, 1100), alt: 'Hai chú chó chạy trên đường' }, style: { radius: 0 } }),
    box(at(0, 1660, W, 420), { background: 'linear-gradient(90deg, rgba(15,118,110,0.85) 0%, rgba(15,118,110,0.35) 70%, rgba(15,118,110,0.1) 100%)', radius: 0 }),
    title(at(X, 1770, 640, 150), 'Mỗi bé đều xứng đáng\nđược khoẻ mạnh và vui vẻ.', '#ffffff', 46, { lineHeight: 1.3 }),
    para(at(X, 1934, 560, 56), 'Chúng tôi lắng nghe bé bằng sự kiên nhẫn, và lắng nghe bạn bằng sự thấu hiểu.', '#e6fffa', { fontSize: 17 }),
  );

  // Why us.
  els.push(framed('arch', at(X, 2160, 440, 480), '1628009368231-7bb7cfcb0def', 'Bác sĩ khám cho mèo'));
  ;[h, y] = head(2170, 'VÌ SAO CHỌN CHÚNG TÔI', 'Nhẹ với bé, rõ với bạn', { x: 600, w: 520 });
  els.push(...h);
  ;[
    ['Bác sĩ có chứng chỉ hành nghề', 'Hơn 10 năm kinh nghiệm điều trị chó, mèo và thú cưng nhỏ.'],
    ['Máy móc chẩn đoán hiện đại', 'Xét nghiệm máu, siêu âm, X-quang kỹ thuật số ngay tại chỗ.'],
    ['Khu chờ riêng cho chó và mèo', 'Giúp các bé bớt căng thẳng, hạn chế lây bệnh chéo.'],
    ['Báo giá trước khi điều trị', 'Bảng giá công khai, không phát sinh chi phí bất ngờ.'],
  ].forEach(([t, desc], i) => {
    const top = y + 10 + i * 94;
    els.push(
      icon('check', at(600, top, 40, 40), '#ffffff', { background: teal, radius: 999 }, 'icon', { iconSize: 50 }),
      text('subheading', at(656, top - 2, 464, 28), t, { color: ink, fontSize: 18, fontWeight: 700 }),
      para(at(656, top + 28, 464, 50), desc, soft, { fontSize: 15 }),
    );
  });

  // Doctors.
  ;[h, y] = head(DOCTORS, 'ĐỘI NGŨ BÁC SĨ', 'Những người bạn của các bé', { align: 'center' });
  els.push(...h);
  ;[
    ['1559839734-2b71ea197ec2', 'BS. Nguyễn Minh Thư', 'Giám đốc chuyên môn · Nội khoa', '14 năm kinh nghiệm, từng tu nghiệp tại Đại học Thú y Kasetsart (Thái Lan).'],
    ['1612349317150-e413f6a5b16d', 'BS. Trần Hoàng Nam', 'Trưởng khoa Ngoại · Phẫu thuật', 'Chuyên phẫu thuật chỉnh hình và mô mềm, hơn 3.000 ca mổ thành công.'],
  ].forEach(([id, name, role, desc], i) => {
    const w = (CW - 32) / 2;
    const x = X + i * (w + 32);
    const top = y + 30;
    els.push(
      card(at(x, top, w, 240)),
      shape('circle', at(x + 28, top + 30, 180, 180), { background: mint }, { src: unsplash(id, 600, 600), imgW: 600, imgH: 600, alt: name, rim: 6, rimColor: mint }),
      text('subheading', at(x + 232, top + 44, w - 260, 32), name, { color: ink, fontFamily: round, fontSize: 22, fontWeight: 800, lineHeight: 1.3 }),
      text('caption', at(x + 232, top + 82, w - 260, 22), role, { color: coral, fontSize: 14, fontWeight: 700 }),
      para(at(x + 232, top + 116, w - 260, 80), desc, soft, { fontSize: 15 }),
    );
  });

  // Prices.
  ;[h, y] = head(PRICES, 'BẢNG GIÁ THAM KHẢO', 'Minh bạch từ đầu', { align: 'center' });
  els.push(...h);
  const prices = [
    ['Khám tổng quát', '150.000đ'],
    ['Tiêm phòng 7 bệnh (chó)', '180.000đ'],
    ['Tiêm phòng 4 bệnh (mèo)', '220.000đ'],
    ['Xét nghiệm máu tổng quát', '350.000đ'],
    ['Siêu âm ổ bụng', '250.000đ'],
    ['Triệt sản mèo đực', '500.000đ'],
    ['Cạo vôi răng', '400.000đ'],
    ['Tắm & cắt tỉa', 'từ 150.000đ'],
  ];
  els.push(card(at(X, y + 30, CW, 336)));
  prices.forEach(([t, price], i) => {
    const w = (CW - 56 * 2 - 64) / 2;
    const x = X + 56 + (i % 2) * (w + 64);
    const top = y + 66 + Math.floor(i / 2) * 68;
    els.push(
      text('paragraph', at(x, top, w - 140, 28), t, { color: ink, fontSize: 16, fontWeight: 600 }),
      text('paragraph', at(x + w - 140, top, 140, 28), price, { color: teal, fontSize: 16, fontWeight: 700, textAlign: 'right' }),
      line(at(x, top + 32, w, 20), '#e2ece9'),
    );
  });
  els.push(text('caption', at(X, y + 386, CW, 22), 'Giá có thể thay đổi theo cân nặng và tình trạng của bé. Bác sĩ luôn báo giá trước khi làm.', { color: soft, fontSize: 14, textAlign: 'center' }));

  // Happy patients.
  ;[h, y] = head(3880, 'BỆNH NHÂN ĐÁNG YÊU', 'Các bé đã khoẻ và về nhà', { align: 'center' });
  els.push(...h);
  ;[
    ['1514888286974-6c03e2ca1dba', 'Mướp · 3 tuổi'],
    ['1537151608828-ea2b11777ee8', 'Lu · 2 tuổi'],
    ['1592194996308-7b43878e84a6', 'Bông · 1 tuổi'],
    ['1608096299210-db7e38487075', 'Mochi · 4 tuổi'],
    ['1596492784531-6e6eb5ea9993', 'Tuyết · 5 tuổi'],
    ['1625316708582-7c38734be31d', 'Râu · 6 tuổi'],
  ].forEach(([id, name], i) => {
    const size = (CW - 5 * 16) / 6;
    const x = X + i * (size + 16);
    els.push(
      photo(at(x, y + 30, size, size), id, name, { radius: 24, ...(i % 2 ? {} : { shadow: 'sm' }) }),
      text('caption', at(x, y + 30 + size + 12, size, 22), name, { color: ink, fontSize: 14, fontWeight: 600, textAlign: 'center' }),
    );
  });
  els.push(
    text('quote', at(200, 4260, 800, 140), '“Bé Lu nhà mình sợ đi khám lắm, nhưng các bác sĩ ở đây rất kiên nhẫn. Sau ca mổ bé hồi phục nhanh, ngày nào cũng được nhắn hỏi thăm.”\n— Chị Hạnh, chủ của bé Lu', { background: mint, color: ink, fontSize: 18, padding: 28, radius: 22, italic: false, lineHeight: 1.6 }),
  );

  // Booking.
  els.push(
    box(at(X, BOOKING, CW, 380), { background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)', radius: 28 }),
    title(at(X + 56, BOOKING + 50, 600, 64), 'Đặt lịch khám cho bé', '#ffffff', 44),
    para(at(X + 56, BOOKING + 124, 540, 56), 'Gọi hoặc nhắn Zalo, lễ tân sẽ xếp giờ phù hợp để bé không phải chờ lâu.', '#e6fffa', { fontSize: 17 }),
    solid(at(X + 56, BOOKING + 206, 230, 56), 'Gọi 0901 234 567', 'tel:0901234567', { fontSize: 16 }),
    outline(at(X + 302, BOOKING + 206, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567', '#ffffff'),
    text('caption', at(X + 56, BOOKING + 290, 560, 22), 'Cấp cứu ngoài giờ: 1900 1234 (bác sĩ trực 24/7)', { color: '#ccfbf1', fontSize: 14, fontWeight: 600 }),
    card(at(720, BOOKING + 48, 344, 284), { shadow: 'lg' }),
    text('subheading', at(752, BOOKING + 76, 280, 30), 'Giờ làm việc', { color: ink, fontFamily: round, fontSize: 22, fontWeight: 800, lineHeight: 1.3 }),
    text('list', at(752, BOOKING + 120, 280, 150), 'Thứ 2 – Thứ 6:   7:30 – 21:00\nThứ 7 – Chủ nhật:   8:00 – 20:00\nNgày lễ:   8:00 – 17:00\nCấp cứu:   24/7', { color: ink, fontSize: 15, lineHeight: 2 }),
    moving(text('paragraph', at(1010, BOOKING + 262, 44, 44), '🐶', { fontSize: 34, textAlign: 'center', lineHeight: 1 }), 'bounce', 1.8),
  );

  // Footer.
  els.push(
    line(at(X, 4950, CW, 20), '#d6e6e2'),
    icon('heart', at(X, 5000, 40, 40), '#ffffff', { background: teal, radius: 12 }, 'icon', { iconSize: 52 }),
    title(at(X + 52, 5002, 300, 44), 'Thú Y An Tâm', teal, 24),
    text('paragraph', at(X, 5056, 560, 84), '📍 45 Nguyễn Văn Thủ, Đa Kao, Quận 1, TP. Hồ Chí Minh\n📞 0901 234 567 · Cấp cứu 1900 1234\n✉️ lienhe@thuyantam.vn', { color: soft, fontSize: 15, lineHeight: 1.75 }),
    ...contactIcons(rightAligned(W - X, 3, 36, 12), 5004, teal, 36, 12),
    text('caption', at(640, 5116, W - X - 640, 22), '© 2026 Bệnh viện Thú y An Tâm', { color: '#8aa3a0', textAlign: 'right' }),
  );

  return {
    name: 'Bệnh viện Thú y',
    description: 'Nền sáng, xanh ngọc và cam: đặt lịch khám, dịch vụ, ảnh cuộn, bác sĩ, bảng giá, bệnh nhân đáng yêu',
    page: { title: 'Bệnh viện Thú y An Tâm – Chăm sóc thú cưng', width: W, height: H, background: cream },
    elements: els,
  };
}
