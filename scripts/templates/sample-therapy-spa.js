import { W, X, CW, at, text, button, box, doodle, contactIcons, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 23;

// ---------------------------------------------------------------- therapy spa (editorial: split hero, zigzag rows, timeline)

export default function therapySpa() {
  const sand = '#efe7dc';
  const sandDeep = '#e4d8c6';
  const olive = '#2f2a22';
  const clay = '#a8623f';
  const ink = '#3b3428';
  const soft = '#7a6f60';
  const pale = '#d6c6b0';
  const serif = 'cormorant';
  const H = 6120;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 0, ...style } });
  const serifText = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: serif, fontSize, fontWeight: 600, lineHeight: 1.25, letterSpacing: 0, ...extra });
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.75, ...extra });
  const small = (b, t, color = clay, extra = {}) => text('label', b, t, { color, fontSize: 12, letterSpacing: 4, ...extra });
  /** An underlined text link with an arrow, the page's only kind of call to action. */
  const cta = (b, t, href, color = clay, extra = {}) =>
    button('link', b, `${t}  →`, { color, underline: true, fontSize: 16, fontWeight: 600, textAlign: 'left', ...extra }, { href, newTab: href.startsWith('http') });
  const dotted = (b, color = pale) => createElement('divider', { ...b, style: { color, lineWidth: 2, lineStyle: 'dotted' } });

  // Section tops, also the targets of the menu's in-page links.
  const TREATMENTS = 1360;
  const JOURNEY = 3720;
  const PRICES = 4480;
  const CONTACT = 5560;

  // Split hero: a tall photo that stays put while the page scrolls, and the words beside it.
  els.push(
    createElement('parallax', { ...at(0, 0, 560, 900), props: { src: unsplash('1560750588-73207b1ef5b8', 1200, 1600), alt: 'Không gian thư giãn của spa' }, style: { radius: 0 } }),
    doodle('watercolor', at(820, 90, 420, 320), pale, { seed: 4, blend: true }, { opacity: 0.6 }),
    serifText(at(640, 34, 260, 50), 'An Nhiên', ink, 36, { italic: true }),
    ...[
      ['LIỆU TRÌNH', TREATMENTS, 100],
      ['HÀNH TRÌNH', JOURNEY, 104],
      ['BẢNG GIÁ', PRICES, 88],
    ].map(([t, y, w], i, all) => {
      // Laid out right to left from the page's right margin, 12px apart.
      const right = W - X - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 12, 0);
      return button('link', at(right - w, 44, w, 28), t, { color: ink, underline: false, fontSize: 12, fontWeight: 600, letterSpacing: 2, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    small(at(640, 250, 480, 22), 'TRỊ LIỆU · THƯ GIÃN · CÂN BẰNG'),
    serifText(at(636, 286, 520, 250), 'Chạm để\nchữa lành', ink, 100, { fontWeight: 500, lineHeight: 1.2 }),
    para(at(640, 556, 430, 90), 'Massage trị liệu, bấm huyệt và thảo dược Việt, trong một căn nhà gỗ yên tĩnh giữa phố cổ. Ở đây, bạn chỉ cần thở chậm lại.', soft, { fontSize: 17 }),
    cta(at(640, 674, 260, 32), 'Đặt lịch trị liệu', scrollYHref(CONTACT), clay, { fontSize: 17 }),
    box(at(640, 790, 480, 1), { background: pale, radius: 0 }),
    text('caption', at(640, 812, 480, 22), 'Mở cửa 9:00 – 22:00 · 12 Trần Hưng Đạo, Hội An', { color: soft, fontSize: 14 }),
  );

  // Manifesto.
  els.push(
    doodle('sparkle', at(584, 980, 32, 32), clay, { seed: 2 }),
    serifText(at(160, 1036, 880, 180), '“Cơ thể biết cách tự chữa lành.\nChúng tôi chỉ giúp nó được lắng nghe.”', ink, 42, { italic: true, fontWeight: 500, textAlign: 'center', lineHeight: 1.4 }),
    small(at(X, 1232, CW, 22), '— TRIẾT LÝ CỦA AN NHIÊN', soft, { textAlign: 'center' }),
  );

  // Treatments: alternating rows, photo on one side and a big numeral on the other.
  els.push(
    small(at(X, TREATMENTS, 400, 22), 'LIỆU TRÌNH'),
    serifText(at(X, TREATMENTS + 30, 760, 70), 'Bốn cách để cơ thể nghỉ ngơi', ink, 54, { fontWeight: 500 }),
  );
  ;[
    ['1544161515-4ab6ce6db874', 'Massage tinh dầu trị liệu', '60 – 90 phút · từ 450.000đ', 'Tinh dầu sả chanh, oải hương hoặc gừng ấm pha theo thể trạng. Những động tác dài, chậm giúp giãn cơ và ngủ sâu hơn.'],
    ['1519824145371-296894a0daa9', 'Bấm huyệt cổ vai gáy', '45 phút · 350.000đ', 'Dành cho dân văn phòng: tác động đúng huyệt đạo vùng cổ, vai, lưng trên để giảm đau mỏi và căng cứng.'],
    ['1600334129128-685c5582fd35', 'Đá nóng Himalaya', '75 phút · 590.000đ', 'Đá bazan làm ấm đặt dọc sống lưng, kết hợp massage giúp máu lưu thông và thả lỏng những nhóm cơ sâu.'],
    ['1515377905703-c4788e51af15', 'Xông thảo dược & ngâm chân', '40 phút · 280.000đ', 'Lá bưởi, sả, gừng, quế nấu theo công thức nhà. Xông hơi rồi ngâm chân muối khoáng, nhẹ người ngay sau buổi đầu.'],
  ].forEach(([id, t, meta, desc], i) => {
    const top = TREATMENTS + 160 + i * 460;
    const left = i % 2 === 0;
    const tx = left ? X + 580 : X;
    els.push(
      photo(at(left ? X : W - X - 520, top, 520, 360), id, t),
      serifText(at(tx, top - 14, 200, 130), String(i + 1).padStart(2, '0'), pale, 110, { fontWeight: 500, lineHeight: 1.15 }),
      serifText(at(tx, top + 116, 460, 50), t, ink, 36),
      small(at(tx, top + 172, 460, 20), meta.toUpperCase(), clay, { letterSpacing: 2 }),
      para(at(tx, top + 206, 440, 84), desc),
      cta(at(tx, top + 300, 220, 30), 'Đặt liệu trình này', scrollYHref(CONTACT)),
    );
  });

  // Three photos edge to edge.
  ;[
    ['1540555700478-4be289fbecef', 'Khăn bông và hoa tươi'],
    ['1570172619644-dfd03ed5d881', 'Đắp mặt nạ thảo mộc'],
    ['1616394584738-fc6e612e71b9', 'Chăm sóc da mặt'],
  ].forEach(([id, alt], i) => els.push(photo(at(i * 400, 3300, 400, 340), id, alt)));

  // Journey: a vertical timeline, time on one side, step on the other.
  els.push(
    small(at(X, JOURNEY, CW, 22), 'HÀNH TRÌNH 90 PHÚT', clay, { textAlign: 'center' }),
    serifText(at(X, JOURNEY + 30, CW, 70), 'Một buổi tại An Nhiên', ink, 54, { fontWeight: 500, textAlign: 'center' }),
  );
  const steps = [
    ['Phút 0', 'Trà thảo mộc chào đón', 'Một tách trà gừng sả ấm, trò chuyện để hiểu cơ thể bạn hôm nay.'],
    ['Phút 10', 'Ngâm chân muối khoáng', 'Nước ấm, muối hồng và lá bưởi giúp thả lỏng từ gót chân.'],
    ['Phút 25', 'Trị liệu chính', 'Massage, bấm huyệt hoặc đá nóng theo liệu trình đã chọn.'],
    ['Phút 75', 'Chườm thảo dược & xông', 'Túi thảo mộc nóng chườm lưng, xông hơi sả chanh.'],
    ['Phút 85', 'Nghỉ ngơi', 'Nằm thư giãn trong phòng trà với trà hoa cúc và bánh nhỏ.'],
  ];
  const stepTop = JOURNEY + 150;
  els.push(box(at(W / 2 - 1, stepTop + 10, 2, (steps.length - 1) * 120), { background: pale, radius: 0 }));
  steps.forEach(([time, t, desc], i) => {
    const top = stepTop + i * 120;
    const textLeft = i % 2 === 0;
    els.push(
      box(at(W / 2 - 10, top + 2, 20, 20), { background: i === 2 ? clay : sand, radius: 999, borderWidth: 2, borderColor: clay }),
      serifText(at(textLeft ? W / 2 + 40 : W / 2 - 240, top - 8, 200, 40), time, clay, 26, { italic: true, textAlign: textLeft ? 'left' : 'right' }),
      text('subheading', at(textLeft ? X + 60 : W / 2 + 40, top - 4, 420, 30), t, { color: ink, fontSize: 19, fontWeight: 700, textAlign: textLeft ? 'right' : 'left' }),
      para(at(textLeft ? X + 60 : W / 2 + 40, top + 28, 420, 56), desc, soft, { fontSize: 15, lineHeight: 1.6, textAlign: textLeft ? 'right' : 'left' }),
    );
  });

  // Prices: one narrow, centred column on a deeper band.
  els.push(
    box(at(0, PRICES, W, 620), { background: sandDeep, radius: 0 }),
    small(at(X, PRICES + 60, CW, 22), 'BẢNG GIÁ', clay, { textAlign: 'center' }),
    serifText(at(X, PRICES + 90, CW, 70), 'Giá trị liệu', ink, 54, { fontWeight: 500, textAlign: 'center' }),
  );
  ;[
    ['Massage tinh dầu', '60 phút', '450.000đ'],
    ['Massage tinh dầu', '90 phút', '620.000đ'],
    ['Bấm huyệt cổ vai gáy', '45 phút', '350.000đ'],
    ['Đá nóng Himalaya', '75 phút', '590.000đ'],
    ['Xông thảo dược & ngâm chân', '40 phút', '280.000đ'],
    ['Hành trình An Nhiên (trọn gói)', '120 phút', '890.000đ'],
  ].forEach(([t, time, price], i) => {
    const top = PRICES + 200 + i * 60;
    els.push(
      text('paragraph', at(300, top, 340, 28), t, { color: ink, fontSize: 17, fontWeight: 600 }),
      text('paragraph', at(640, top, 120, 28), time, { color: soft, fontSize: 15, textAlign: 'center' }),
      serifText(at(760, top - 6, 140, 36), price, clay, 24, { textAlign: 'right' }),
      dotted(at(300, top + 34, 600, 12)),
    );
  });
  els.push(text('caption', at(X, PRICES + 572, CW, 22), 'Mua gói 5 buổi được tặng thêm 1 buổi cùng loại · Có thẻ quà tặng', { color: soft, fontSize: 14, textAlign: 'center', italic: true }));

  // One big testimonial.
  els.push(
    serifText(at(X, 5150, CW, 200), '“', clay, 220, { textAlign: 'center', lineHeight: 1 }),
    serifText(at(190, 5300, 820, 130), 'Sau ba năm đau vai gáy vì ngồi máy tính, đây là nơi đầu tiên mình thấy nhẹ hẳn ngay sau buổi đầu. Giờ mỗi tuần mình đều quay lại.', ink, 30, { italic: true, fontWeight: 500, textAlign: 'center', lineHeight: 1.45 }),
    small(at(X, 5450, CW, 22), 'CHỊ MAI PHƯƠNG · KHÁCH QUEN 3 NĂM', soft, { textAlign: 'center' }),
  );

  // Contact on a dark block, with the name set huge underneath.
  els.push(
    box(at(0, CONTACT, W, H - CONTACT), { background: olive, radius: 0 }),
    small(at(X, CONTACT + 80, 300, 22), 'ĐẶT LỊCH', pale),
    serifText(at(X, CONTACT + 110, 340, 50), '0901 234 567', sand, 38),
    cta(at(X, CONTACT + 176, 200, 30), 'Gọi ngay', 'tel:0901234567', '#e7b89a'),
    cta(at(X + 140, CONTACT + 176, 200, 30), 'Nhắn Zalo', 'https://zalo.me/0901234567', '#e7b89a'),
    small(at(470, CONTACT + 80, 300, 22), 'GIỜ MỞ CỬA', pale),
    text('list', at(470, CONTACT + 114, 280, 110), 'Thứ 2 – Thứ 6:  9:00 – 22:00\nThứ 7 – Chủ nhật:  8:00 – 22:00\nNhận khách cuối lúc 20:30', { color: sand, fontSize: 15, lineHeight: 1.9 }),
    small(at(840, CONTACT + 80, 280, 22), 'ĐỊA CHỈ', pale),
    text('paragraph', at(840, CONTACT + 114, 280, 56), '12 Trần Hưng Đạo, Minh An,\nHội An, Quảng Nam', { color: sand, fontSize: 15, lineHeight: 1.75 }),
    ...contactIcons(840, CONTACT + 186, sand, 30, 12),
    box(at(X, CONTACT + 270, CW, 1), { background: '#4a4337', radius: 0 }),
    serifText(at(0, CONTACT + 290, W, 250), 'An Nhiên', '#4a4337', 230, { italic: true, fontWeight: 500, textAlign: 'center', lineHeight: 1.05 }),
    text('caption', at(X, H - 40, CW, 20), '© 2026 An Nhiên Spa · Trị liệu & thư giãn', { color: '#8a7f6e', fontSize: 12, textAlign: 'center' }),
  );

  return {
    name: 'Spa trị liệu',
    description: 'Kiểu tạp chí, tông đất: hero chia đôi với ảnh cuộn, liệu trình so le, dải ảnh liền, hành trình dạng timeline, bảng giá một cột',
    page: { title: 'An Nhiên – Spa trị liệu & thư giãn', width: W, height: H, background: sand },
    elements: els,
  };
}
