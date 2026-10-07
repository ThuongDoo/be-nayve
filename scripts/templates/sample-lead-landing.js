import { W, X, CW, at, text, button, icon, box, col3, contactIcons, rightAligned, doodle, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 30;

// ---------------------------------------------------------------- lead-capture landing page (two contact forms)

export default function leadLanding() {
  const navy = '#0b1d33';
  const teal = '#0e9f8f';
  const tealSoft = '#e3f5f2';
  const sand = '#f7f4ee';
  const ink = '#14212f';
  const soft = '#5d6b7b';
  const mist = '#c9d5e2';
  const heading = 'montserrat';
  const H = 3000;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 18, ...style } });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heading, fontSize, fontWeight: 800, lineHeight: 1.2, letterSpacing: -0.5, ...extra });
  const tint = (el, word, color) => {
    const start = el.props.text.indexOf(word);
    return start < 0 ? el : { ...el, props: { ...el.props, marks: [{ start, end: start + word.length, color }] } };
  };
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.7, ...extra });
  /** A contact form (see lib/render/form.js); where it sends is set in the editor's "Nhận dữ liệu". */
  const form = (b, props, style = {}) =>
    createElement('form', {
      ...b,
      props: { fieldColor: '#ffffff', fieldTextColor: ink, fieldBorderColor: '#d5dde6', fieldRadius: 10, accentColor: teal, accentTextColor: '#ffffff', ...props },
      style: { background: 'transparent', color: ink, fontFamily: 'be-vietnam', fontSize: 15, padding: 0, radius: 0, shadow: 'none', ...style },
    });

  const HERO_FORM = 120;
  const VISIT = 2250;

  // Hero: photo behind, words on the left, the price-list form on the right.
  els.push(
    photo(at(0, 0, W, 780), '1486406146926-c627a92ad1ab', 'Các toà nhà cao tầng', { radius: 0 }),
    box(at(0, 0, W, 780), { background: 'linear-gradient(90deg, rgba(11,29,51,0.94) 0%, rgba(11,29,51,0.78) 55%, rgba(11,29,51,0.35) 100%)', radius: 0 }),
    title(at(X, 30, 400, 40), 'AURORA RIVERSIDE', '#ffffff', 22, { letterSpacing: 3 }),
    button('link', at(400, 34, 260, 30), '☎  Hotline 0901 234 567', { color: '#ffffff', underline: false, fontSize: 15, fontWeight: 600 }, { href: 'tel:0901234567' }),
    text('label', at(X, 170, 560, 22), 'CĂN HỘ VEN SÔNG · TP. THỦ ĐỨC', { color: '#7fe3d6', letterSpacing: 3 }),
    tint(title(at(X, 204, 580, 200), 'Sống ven sông,\ncách trung tâm\nchỉ 15 phút', '#ffffff', 52), 'ven sông', '#7fe3d6'),
    para(at(X, 430, 520, 84), 'Căn hộ 1–3 phòng ngủ, công viên 2 ha, hồ bơi tràn bờ. Thanh toán 15% ký hợp đồng, ngân hàng hỗ trợ vay 70%.', mist),
    ...[
      ['52 tr/m²', 'giá từ'],
      ['15%', 'ký hợp đồng'],
      ['Q4/2027', 'bàn giao'],
    ].flatMap(([n, t], i) => [
      title(at(X + i * 175, 560, 165, 40), n, '#ffffff', 28),
      text('caption', at(X + i * 175, 602, 165, 22), t, { color: mist, fontSize: 13 }),
    ]),
    box(at(700, HERO_FORM, 420, 600), { background: '#ffffff', radius: 22, shadow: 'lg' }),
    title(at(732, HERO_FORM + 30, 360, 34), 'Nhận bảng giá & ưu đãi', ink, 24, { letterSpacing: 0 }),
    para(at(732, HERO_FORM + 70, 360, 48), 'Để lại thông tin, chuyên viên gửi bảng giá và mặt bằng trong 15 phút.', soft, { fontSize: 14, lineHeight: 1.6 }),
    form(at(732, HERO_FORM + 132, 356, 440), {
      formName: 'Nhận bảng giá Aurora Riverside',
      submitText: 'Nhận bảng giá ngay',
      successText: 'Cảm ơn bạn! Chuyên viên sẽ gọi lại trong 15 phút.',
      fields: [
        { id: 'name', label: 'Họ và tên', type: 'text', required: true, placeholder: 'Nguyễn Văn A' },
        { id: 'phone', label: 'Số điện thoại', type: 'tel', required: true, placeholder: '0901 234 567' },
        { id: 'type', label: 'Bạn quan tâm', type: 'select', required: false, options: 'Căn hộ 1 phòng ngủ\nCăn hộ 2 phòng ngủ\nCăn hộ 3 phòng ngủ\nPenthouse' },
        { id: 'email', label: 'Email (không bắt buộc)', type: 'email', required: false, placeholder: 'ban@email.com' },
      ],
    }),
  );

  // Highlights.
  els.push(
    text('label', at(X, 860, CW, 22), 'VÌ SAO NÊN CHỌN AURORA', { color: teal, textAlign: 'center', letterSpacing: 3 }),
    title(at(X, 890, CW, 54), 'Mọi tiện ích ngay dưới nhà', ink, 40, { textAlign: 'center' }),
  );
  ;[
    ['leaf', 'Công viên 2 ha', 'Đường chạy bộ ven sông, khu vui chơi trẻ em và vườn BBQ.'],
    ['graduation', 'Trường học liên cấp', 'Trường mầm non đến THPT ngay trong khu, con đi bộ đến lớp.'],
    ['shield', 'Pháp lý minh bạch', 'Sổ hồng lâu dài, ngân hàng bảo lãnh tiến độ xây dựng.'],
  ].forEach(([ic, t, d], i) => {
    const c = col3(i, 32);
    els.push(
      box(at(c.x, 980, c.w, 230), { background: '#ffffff', radius: 18, borderWidth: 1, borderColor: '#e6e0d4' }),
      icon(ic, at(c.x + 26, 1006, 56, 56), teal, { background: tealSoft, radius: 999 }, 'icon', { iconSize: 46 }),
      text('subheading', at(c.x + 26, 1080, c.w - 52, 30), t, { color: ink, fontSize: 20, fontWeight: 700 }),
      para(at(c.x + 26, 1116, c.w - 52, 80), d, soft, { fontSize: 15 }),
    );
  });

  // Gallery.
  els.push(
    text('label', at(X, 1300, CW, 22), 'HÌNH ẢNH THỰC TẾ', { color: teal, textAlign: 'center', letterSpacing: 3 }),
    title(at(X, 1330, CW, 54), 'Căn hộ mẫu đã hoàn thiện', ink, 40, { textAlign: 'center' }),
    photo(at(X, 1420, 620, 420), '1600607687939-ce8a6c25118c', 'Phòng khách căn hộ mẫu'),
    photo(at(X + 644, 1420, 396, 200), '1560448204-e02f11c3d0e2', 'Phòng khách nhìn ra cửa sổ'),
    photo(at(X + 644, 1640, 396, 200), '1522708323590-d24dbb6b0267', 'Không gian bếp và bàn ăn'),
  );

  // Sales policy.
  els.push(
    box(at(0, 1920, W, 260), { background: tealSoft, radius: 0 }),
    tint(title(at(X, 1966, 560, 100), 'Chính sách bán hàng\ntháng này', ink, 36), 'tháng này', teal),
    para(at(X, 2080, 520, 56), 'Áp dụng cho 50 khách hàng đầu tiên đặt chỗ trong tháng.', soft, { fontSize: 15 }),
    text('list', at(680, 1960, 440, 190), '✓  Chiết khấu 5% khi thanh toán nhanh\n✓  Tặng gói nội thất 150 triệu\n✓  Miễn phí quản lý 2 năm đầu\n✓  Ân hạn nợ gốc và lãi 24 tháng', { color: ink, fontSize: 17, fontWeight: 600, lineHeight: 2.1 }),
  );

  // Visit the show flat: a second form, with a select for the time.
  els.push(
    doodle('sparkle', at(X + 470, VISIT + 60, 40, 40), teal, { seed: 6 }),
    text('label', at(X, VISIT + 20, 520, 22), 'THAM QUAN NHÀ MẪU', { color: teal, letterSpacing: 3 }),
    tint(title(at(X, VISIT + 50, 520, 110), 'Đặt lịch xem\nnhà mẫu miễn phí', ink, 40), 'miễn phí', teal),
    para(at(X, VISIT + 176, 480, 84), 'Xe đưa đón tận nơi, có chuyên viên dẫn tham quan và tư vấn tài chính. Chọn khung giờ phù hợp, chúng tôi gọi xác nhận trước một ngày.'),
    button('primary', at(X, VISIT + 290, 240, 54), '☎  Gọi 0901 234 567', { background: navy, color: '#ffffff', radius: 10, fontWeight: 700 }, { href: 'tel:0901234567' }),
    box(at(640, VISIT, 480, 520), { background: navy, radius: 22, shadow: 'lg' }),
    form(
      at(676, VISIT + 36, 408, 460),
      {
        formName: 'Đặt lịch tham quan nhà mẫu',
        submitText: 'Đặt lịch tham quan',
        successText: 'Đã nhận lịch hẹn! Chúng tôi sẽ gọi xác nhận trước một ngày.',
        fieldColor: '#13294a',
        fieldTextColor: '#ffffff',
        fieldBorderColor: '#2d4a70',
        fields: [
          { id: 'name', label: 'Họ và tên', type: 'text', required: true, placeholder: 'Nguyễn Văn A' },
          { id: 'phone', label: 'Số điện thoại', type: 'tel', required: true, placeholder: '0901 234 567' },
          { id: 'time', label: 'Thời gian muốn tham quan', type: 'select', required: true, options: 'Sáng thứ Bảy\nChiều thứ Bảy\nSáng Chủ nhật\nChiều Chủ nhật\nNgày trong tuần (sẽ hẹn sau)' },
          { id: 'people', label: 'Số người đi cùng', type: 'text', required: false, placeholder: 'VD: 2 người lớn, 1 trẻ em' },
        ],
      },
      { color: '#ffffff' },
    ),
  );

  // Footer.
  els.push(
    box(at(0, 2860, W, 140), { background: navy, radius: 0 }),
    title(at(X, 2900, 400, 30), 'AURORA RIVERSIDE', '#ffffff', 18, { letterSpacing: 3 }),
    text('caption', at(X, 2936, 520, 22), 'Phòng kinh doanh: 12 Nguyễn Văn Hưởng, Thảo Điền, TP. Thủ Đức', { color: mist, fontSize: 13 }),
    ...contactIcons(rightAligned(W - X), 2906, '#ffffff', 32, 10),
  );

  return {
    name: 'Landing thu thông tin khách',
    description: 'Có form gửi về Google Sheet / Telegram: form nhận bảng giá ở đầu trang, form đặt lịch xem nhà mẫu có ô chọn giờ, tiện ích, ảnh thực tế, chính sách bán hàng',
    page: { title: 'Aurora Riverside – Nhận bảng giá & đặt lịch xem nhà mẫu', width: W, height: H, background: sand },
    elements: els,
  };
}
