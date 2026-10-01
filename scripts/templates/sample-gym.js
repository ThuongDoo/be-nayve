import { W, X, CW, at, text, button, icon, box, line, shape, contactIcons, rightAligned, col3, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 19;

// ---------------------------------------------------------------- 14: gym (dark + lime, scrolling-image hero)

export default function gym() {
  const ink = '#0b0b0c';
  const card = '#17171a';
  const lime = '#c6f432';
  const white = '#f5f5f4';
  const muted = '#a1a1aa';
  const heading = 'anton';
  const H = 4560;
  const els = [];
  /** A frame whose photo stays put on screen while the page scrolls past (see parallax.js). */
  const parallax = (b, id, alt) => createElement('parallax', { ...b, props: { src: unsplash(id, 1600, 1200), alt }, style: { radius: 0 } });
  const round = (b, id, alt) =>
    shape('circle', b, { background: card }, { src: unsplash(id, 600, 600), imgW: 600, imgH: 600, alt, rim: 4, rimColor: lime });
  const big = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heading, fontSize, fontWeight: 400, lineHeight: 1.3, letterSpacing: 1, ...extra });
  /** Lime label + big title, left or centred. Returns [elements, bottomY]. */
  const head = (y, label, title, { x = X, w = CW, align = 'left' } = {}) => [
    [
      text('label', at(x, y, w, 22), label, { color: lime, textAlign: align, letterSpacing: 3 }),
      big(at(x, y + 30, w, 64), title, white, 46, { textAlign: align, letterSpacing: 0.5 }),
    ],
    y + 120,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: lime, color: ink, fontWeight: 700, radius: 999, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = white) =>
    button('outline', b, t, { color, borderColor: color, radius: 999, fontWeight: 600 }, { href, newTab: href.startsWith('http') });

  // Section tops, also the targets of the menu's in-page links.
  const PROGRAMS = 1000;
  const TRAINERS = 2720;
  const PRICING = 3260;
  const CONTACT = 3960;

  // Hero: the photo stays still while the page scrolls over it.
  els.push(
    parallax(at(0, 0, W, 780), '1605296867304-46d5465a13f1', 'Tập deadlift trong phòng gym'),
    box(at(0, 0, W, 780), { background: 'linear-gradient(90deg, rgba(11,11,12,0.94) 0%, rgba(11,11,12,0.6) 55%, rgba(11,11,12,0.15) 100%)', radius: 0 }),
    big(at(X, 30, 300, 40), 'IRON PULSE', lime, 30, { letterSpacing: 3 }),
    ...[
      ['Chương trình', PROGRAMS, 104],
      ['Huấn luyện viên', TRAINERS, 128],
      ['Bảng giá', PRICING, 76],
      ['Liên hệ', CONTACT, 64],
    ].map(([t, y, w], i, all) => {
      // Laid out right to left from the button, 28px apart.
      const right = 962 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 28, 0);
      return button('link', at(right - w, 34, w, 32), t, { color: white, underline: false, fontSize: 15, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(990, 26, 130, 46), 'Tập thử', scrollYHref(CONTACT), { fontSize: 15 }),

    text('label', at(X, 160, 500, 22), 'PHÒNG TẬP GYM · HÀ NỘI', { color: lime, letterSpacing: 4 }),
    big(at(X, 190, 700, 122), 'ĐỐT CHÁY', white, 92),
    big(at(X, 310, 700, 122), 'GIỚI HẠN', lime, 92),
    big(at(X, 430, 700, 122), 'CỦA BẠN', white, 92),
    text('paragraph', at(X, 572, 540, 60), 'Hơn 2.000m² thiết bị hiện đại, huấn luyện viên tận tâm và một cộng đồng luôn tiếp lửa. Tập thử 7 ngày miễn phí.', { color: '#d4d4d8', fontSize: 17 }),
    solid(at(X, 660, 220, 56), 'Đăng ký tập thử', scrollYHref(CONTACT), { fontSize: 17 }),
    outline(at(X + 236, 660, 180, 56), 'Xem bảng giá', scrollYHref(PRICING)),
  );

  // Stats band.
  els.push(box(at(0, 780, W, 140), { background: lime, radius: 0 }));
  ;[
    ['2.000m²', 'Không gian tập'],
    ['25+', 'Huấn luyện viên'],
    ['40+', 'Lớp nhóm mỗi tuần'],
    ['6:00–22:00', 'Mở cửa mỗi ngày'],
  ].forEach(([n, cap], i) => {
    const w = CW / 4;
    els.push(
      big(at(X + i * w, 798, w, 60), n, ink, 44, { textAlign: 'center' }),
      text('caption', at(X + i * w, 862, w, 24), cap, { color: '#27272a', fontSize: 15, fontWeight: 600, textAlign: 'center' }),
    );
  });

  // Programs.
  let [h, y] = head(PROGRAMS, 'CHƯƠNG TRÌNH TẬP', 'CHỌN CÁCH BẠN MUỐN MẠNH LÊN');
  els.push(...h);
  ;[
    ['1581009146145-b5ef050c2e1e', 'Tăng cơ – Sức mạnh', 'Giáo án tạ bài bản cho từng nhóm cơ, đo tiến độ mỗi tuần.', '60 phút · Từ cơ bản tới nâng cao'],
    ['1599058917212-d750089bc07e', 'HIIT – Đốt mỡ', 'Cường độ cao ngắt quãng, đốt tối đa calo trong thời gian ngắn.', '45 phút · 5 buổi mỗi tuần'],
    ['1518611012118-696072aa579a', 'Yoga – Giãn cơ', 'Tăng độ dẻo, giảm đau mỏi và cân bằng lại cơ thể sau giờ làm.', '60 phút · Sáng và tối'],
  ].forEach(([id, title, desc, meta], i) => {
    const c = col3(i);
    const top = y + 40;
    els.push(
      box(at(c.x, top, c.w, 430), { background: card, radius: 18 }),
      createElement('image', { ...at(c.x + 12, top + 12, c.w - 24, 210), props: { src: unsplash(id, 640, 420), alt: title, fit: 'cover' }, style: { radius: 12 } }),
      text('subheading', at(c.x + 24, top + 240, c.w - 48, 32), title, { color: white, fontSize: 22, fontWeight: 700 }),
      text('paragraph', at(c.x + 24, top + 280, c.w - 48, 72), desc, { color: muted, fontSize: 15 }),
      text('caption', at(c.x + 24, top + 356, c.w - 48, 22), meta, { color: lime, fontSize: 14, fontWeight: 600 }),
      button('link', at(c.x + 24, top + 386, 160, 28), 'Đăng ký lớp →', { color: white, underline: false, fontSize: 15, fontWeight: 600, textAlign: 'left' }, { href: scrollYHref(CONTACT) }),
    );
  });

  // Scrolling-image band with a motto.
  els.push(
    parallax(at(0, 1680, W, 400), '1576678927484-cc907957088c', 'Giá tạ đơn trong phòng tập'),
    box(at(0, 1680, W, 400), { background: 'rgba(11,11,12,0.62)', radius: 0 }),
    big(at(X, 1766, CW, 164), 'KHÔNG CÓ ĐƯỜNG TẮT.\nCHỈ CÓ MỖI NGÀY MỘT CHÚT.', white, 56, { textAlign: 'center', lineHeight: 1.45 }),
    text('label', at(X, 1950, CW, 22), '— IRON PULSE', { color: lime, textAlign: 'center', letterSpacing: 4 }),
  );

  // Why us.
  els.push(createElement('image', { ...at(X, 2160, 500, 456), props: { src: unsplash('1540497077202-7c8a3999166f', 1000, 912), alt: 'Khu tập của phòng gym', fit: 'cover' }, style: { radius: 18 } }));
  ;[h, y] = head(2160, 'VÌ SAO CHỌN CHÚNG TÔI', 'NƠI BẠN MUỐN QUAY LẠI', { x: 640, w: 480 });
  els.push(...h);
  ;[
    ['award', 'Thiết bị chuẩn quốc tế', 'Máy tập nhập khẩu, được bảo dưỡng hằng tuần.'],
    ['user', 'HLV cá nhân 1 kèm 1', 'Lộ trình riêng theo thể trạng, mục tiêu và lịch của bạn.'],
    ['utensils', 'Tư vấn dinh dưỡng', 'Thực đơn đơn giản, dễ theo, đi cùng giáo án tập.'],
    ['clock', 'Mở cửa 6:00 – 22:00', 'Cả cuối tuần và ngày lễ, có tủ đồ và phòng tắm.'],
  ].forEach(([ic, title, desc], i) => {
    const top = y + 16 + i * 84;
    els.push(
      icon(ic, at(640, top, 52, 52), ink, { background: lime, radius: 14 }, 'icon', { iconSize: 46 }),
      text('subheading', at(712, top, 408, 28), title, { color: white, fontSize: 18, fontWeight: 700 }),
      text('paragraph', at(712, top + 30, 408, 24), desc, { color: muted, fontSize: 15 }),
    );
  });

  // Trainers.
  ;[h, y] = head(TRAINERS, 'ĐỘI NGŨ HUẤN LUYỆN VIÊN', 'NGƯỜI ĐỒNG HÀNH CÙNG BẠN', { align: 'center' });
  els.push(...h);
  ;[
    ['1567013127542-490d757e51fc', 'Trần Đức Mạnh', 'HLV trưởng · Sức mạnh'],
    ['1594381898411-846e7d193883', 'Nguyễn Thu Hà', 'HLV HIIT · Giảm mỡ'],
    ['1597452485669-2c7bb5fef90d', 'Lê Quang Huy', 'HLV cá nhân · Tăng cơ'],
  ].forEach(([id, name, role], i) => {
    const c = col3(i);
    els.push(
      round(at(c.x + (c.w - 220) / 2, y + 30, 220, 220), id, name),
      text('subheading', at(c.x, y + 270, c.w, 30), name, { color: white, fontSize: 21, fontWeight: 700, textAlign: 'center' }),
      text('caption', at(c.x, y + 306, c.w, 22), role, { color: lime, fontSize: 15, textAlign: 'center' }),
    );
  });

  // Pricing.
  ;[h, y] = head(PRICING, 'BẢNG GIÁ', 'GÓI TẬP PHÙ HỢP VỚI BẠN', { align: 'center' });
  els.push(...h);
  ;[
    ['1 THÁNG', '599.000đ', 'Thanh toán theo tháng', ['Tập không giới hạn giờ', 'Tủ đồ và phòng tắm', '1 buổi đo InBody'], false],
    ['6 THÁNG', '2.990.000đ', 'Tiết kiệm 17%', ['Mọi quyền lợi gói 1 tháng', '40+ lớp nhóm mỗi tuần', '2 buổi PT miễn phí', 'Bảo lưu 30 ngày'], true],
    ['12 THÁNG', '4.990.000đ', 'Tiết kiệm 30%', ['Mọi quyền lợi gói 6 tháng', '4 buổi PT miễn phí', 'Tư vấn dinh dưỡng', 'Bảo lưu 60 ngày'], false],
  ].forEach(([name, price, note, perks, hot], i) => {
    const c = col3(i);
    const top = y + 44;
    const fg = hot ? ink : white;
    els.push(
      box(at(c.x, top, c.w, 410), { background: hot ? lime : card, radius: 20, ...(hot && { shadow: 'lg' }) }),
      text('label', at(c.x + 28, top + 34, c.w - 56, 22), name, { color: hot ? ink : lime, letterSpacing: 3 }),
      big(at(c.x + 28, top + 62, c.w - 56, 62), price, fg, 46),
      text('caption', at(c.x + 28, top + 132, c.w - 56, 22), note, { color: hot ? '#3f3f46' : muted, fontSize: 14, fontWeight: 600 }),
      line(at(c.x + 28, top + 162, c.w - 56, 20), hot ? 'rgba(11,11,12,0.25)' : '#3f3f46'),
      text('list', at(c.x + 28, top + 194, c.w - 56, 120), perks.map((s) => `✓  ${s}`).join('\n'), { color: fg, fontSize: 15, lineHeight: 1.9 }),
      hot
        ? solid(at(c.x + 28, top + 330, c.w - 56, 52), 'Đăng ký ngay', scrollYHref(CONTACT), { background: ink, color: lime })
        : outline(at(c.x + 28, top + 330, c.w - 56, 52), 'Đăng ký ngay', scrollYHref(CONTACT)),
    );
    if (hot) els.push(button('pill', at(c.x + c.w - 150, top - 16, 136, 32), 'PHỔ BIẾN NHẤT', { background: ink, color: lime, fontSize: 12, fontWeight: 700, letterSpacing: 1 }));
  });

  // Free trial call to action.
  els.push(
    box(at(X, CONTACT, CW, 300), { background: lime, radius: 24 }),
    big(at(X + 56, CONTACT + 42, 680, 68), 'TẬP THỬ 7 NGÀY MIỄN PHÍ', ink, 50),
    text('paragraph', at(X + 56, CONTACT + 122, 560, 56), 'Gọi hoặc nhắn Zalo cho chúng tôi, nhân viên sẽ liên hệ lại trong 15 phút để xếp lịch tập thử.', { color: '#27272a', fontSize: 17 }),
    solid(at(X + 56, CONTACT + 200, 230, 56), 'Gọi 0901 234 567', 'tel:0901234567', { background: ink, color: lime }),
    outline(at(X + 302, CONTACT + 200, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567', ink),
    createElement('image', { ...at(800, CONTACT + 30, 300, 240), props: { src: unsplash('1571019614242-c5c5dee9f50b', 600, 480), alt: 'Huấn luyện viên hướng dẫn tập', fit: 'cover' }, style: { radius: 16 } }),
  );

  // Footer.
  els.push(
    line(at(X, 4330, CW, 20), '#27272a'),
    big(at(X, 4380, 300, 40), 'IRON PULSE', lime, 30, { letterSpacing: 3 }),
    text('paragraph', at(X, 4430, 520, 84), '📍 123 Nguyễn Trãi, Thanh Xuân, Hà Nội\n🕕 6:00 – 22:00, tất cả các ngày\n📞 0901 234 567', { color: muted, fontSize: 15, lineHeight: 1.75 }),
    ...contactIcons(rightAligned(W - X, 3, 36, 12), 4384, white, 36, 12),
    text('caption', at(640, 4490, W - X - 640, 22), '© 2026 Iron Pulse Gym', { color: '#52525b', textAlign: 'right' }),
  );

  return {
    name: 'Phòng tập Gym',
    description: 'Nền tối, xanh chanh: ảnh cuộn ở đầu trang, chương trình tập, huấn luyện viên, bảng giá, đăng ký tập thử',
    page: { title: 'Iron Pulse Gym – Phòng tập Hà Nội', width: W, height: H, background: ink },
    elements: els,
  };
}
