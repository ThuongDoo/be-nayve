import { W, X, CW, at, text, button, icon, box, line, shape, image, photoShape, socials, centred, sectionHead, col3 } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 4;

// ---------------------------------------------------------------- 1. Designer (dark)

export default function designer() {
  const grad = 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)';
  const textGrad = 'linear-gradient(90deg, #a5b4fc 0%, #f0abfc 100%)';
  const white = '#f8fafc';
  const muted = '#94a3b8';
  const card = '#1e293b';
  const els = [];
  const H = 3620;

  // Nav
  els.push(
    text('label', at(X, 36, 200, 22), 'MINH AN', { color: '#e0e7ff', letterSpacing: 4, fontSize: 14 }),
    text('paragraph', at(600, 34, 360, 26), 'Giới thiệu     Dịch vụ     Dự án     Liên hệ', { color: '#cbd5e1', textAlign: 'right', fontSize: 15 }),
    button('gradient', at(1000, 26, 120, 42), 'Thuê tôi', { fontSize: 14, background: grad }, { href: 'mailto:hello@example.com' }),
  );

  // Hero
  els.push(
    shape('blob', at(760, 120, 380, 380), { background: grad, opacity: 0.9 }),
    photoShape('circle', at(810, 170, 280, 280), 'nayva-designer-hero'),
    shape('star', at(1090, 110, 50, 50), { background: '#fde68a' }),
    text('label', at(X, 150, 400, 22), 'NHÀ THIẾT KẾ UI/UX', { color: '#a5b4fc' }),
    text('title', at(X, 184, 640, 200), 'Tôi thiết kế những trải nghiệm số đáng nhớ.', { color: textGrad, fontSize: 56, lineHeight: 1.15 }),
    text('paragraph', at(X, 400, 560, 60), 'Xin chào, tôi là Minh An. Tôi giúp startup và doanh nghiệp nhỏ biến ý tưởng thành sản phẩm đẹp, dễ dùng.', { color: muted, fontSize: 17 }),
    button('gradient', at(X, 490, 190, 54), 'Xem dự án', { background: grad }),
    button('outline', at(X + 206, 490, 150, 54), 'Tải CV', { radius: 999, color: '#e2e8f0', borderColor: '#e2e8f0' }),
  );

  // Stats
  ;[
    ['6+', 'năm kinh nghiệm'],
    ['40+', 'dự án hoàn thành'],
    ['25', 'khách hàng hài lòng'],
  ].forEach(([n, cap], i) => {
    const c = col3(i);
    els.push(
      text('title', at(c.x, 620, c.w, 60), n, { color: textGrad, fontSize: 48, textAlign: 'center' }),
      text('caption', at(c.x, 684, c.w, 22), cap, { color: muted, textAlign: 'center', fontSize: 15 }),
    );
  });
  els.push(line(at(X, 740, CW, 20), '#334155'));

  // About
  let [head, y] = sectionHead(810, 'GIỚI THIỆU', 'Xin chào, tôi là Minh An', { color: white, labelColor: '#a5b4fc' });
  els.push(
    ...head,
    photoShape('arch', at(X, y + 10, 340, 420), 'nayva-designer-about'),
    text('paragraph', at(480, y + 20, 640, 110), 'Tôi bắt đầu với thiết kế đồ hoạ, rồi say mê cách con người dùng sản phẩm số. Sáu năm qua tôi làm cùng các đội sản phẩm ở Hà Nội và Singapore, từ nghiên cứu người dùng tới giao diện hoàn chỉnh.', { color: '#cbd5e1', fontSize: 17, lineHeight: 1.7 }),
    text('paragraph', at(480, y + 150, 640, 84), 'Tôi tin một thiết kế tốt là thiết kế mà người dùng không cần suy nghĩ khi dùng nó.', { color: muted, fontSize: 17, italic: true }),
    text('subheading', at(480, y + 260, 640, 30), 'Công cụ tôi dùng hằng ngày', { color: white, fontSize: 18 }),
    ...['Figma', 'Framer', 'Illustrator', 'Webflow', 'Notion'].map((t, i) =>
      button('soft', at(480 + i * 126, y + 306, 114, 40), t, { background: card, color: '#c7d2fe', radius: 999, fontSize: 14 }),
    ),
    button('gradient', at(480, y + 380, 200, 50), 'Nói chuyện với tôi', { background: grad, fontSize: 15 }, { href: 'mailto:hello@example.com' }),
  );

  // Services
  ;[head, y] = sectionHead(1420, 'DỊCH VỤ', 'Tôi có thể giúp gì cho bạn', { color: white, labelColor: '#a5b4fc', intro: 'Từ ý tưởng tới sản phẩm hoàn chỉnh, tôi đồng hành ở mọi bước.', introColor: muted });
  els.push(...head);
  ;[
    ['sparkles', 'Thiết kế UI/UX', 'Giao diện web và ứng dụng đẹp, rõ ràng, dựa trên nghiên cứu người dùng.'],
    ['award', 'Nhận diện thương hiệu', 'Logo, bảng màu, phông chữ và bộ nhận diện nhất quán cho thương hiệu.'],
    ['globe', 'Thiết kế website', 'Website giới thiệu, landing page tối ưu chuyển đổi, dễ tự cập nhật.'],
  ].forEach(([ic, title, desc], i) => {
    const c = col3(i);
    els.push(
      box(at(c.x, y, c.w, 240), { background: card, radius: 18 }),
      icon(ic, at(c.x + 28, y + 28, 56, 56), '#ffffff', { background: grad, radius: 16 }, 'icon', { iconSize: 48 }),
      text('subheading', at(c.x + 28, y + 106, c.w - 56, 30), title, { color: white, fontSize: 20 }),
      text('paragraph', at(c.x + 28, y + 146, c.w - 56, 80), desc, { color: muted, fontSize: 15 }),
    );
  });

  // Projects
  ;[head, y] = sectionHead(1920, 'DỰ ÁN', 'Dự án tiêu biểu', { color: white, labelColor: '#a5b4fc' });
  els.push(...head);
  ;[
    ['Ứng dụng đặt lịch spa', 'UI/UX · Mobile'],
    ['Thương hiệu Cà phê Gió', 'Nhận diện thương hiệu'],
    ['Website du lịch Hội An', 'Website · 2025'],
    ['Dashboard quản lý kho', 'SaaS · Web app'],
    ['Ví điện tử cho sinh viên', 'Fintech · Mobile'],
    ['Landing page khoá học', 'Landing page'],
  ].forEach(([title, tag], i) => {
    const c = col3(i % 3);
    const top = y + Math.floor(i / 3) * 300;
    els.push(
      box(at(c.x, top, c.w, 276), { background: card, radius: 18 }),
      image(at(c.x + 12, top + 12, c.w - 24, 170), `nayva-dp${i}`, title, { radius: 12 }),
      text('subheading', at(c.x + 20, top + 196, c.w - 40, 28), title, { color: white, fontSize: 18 }),
      text('caption', at(c.x + 20, top + 228, c.w - 40, 22), tag, { color: '#a5b4fc', fontSize: 14 }),
    );
  });

  // Experience
  ;[head, y] = sectionHead(2660, 'KINH NGHIỆM', 'Hành trình làm nghề', { color: white, labelColor: '#a5b4fc' });
  els.push(...head);
  ;[
    ['2023 – nay', 'Lead Product Designer', 'Công ty Sóng Xanh · Hà Nội'],
    ['2020 – 2023', 'UI/UX Designer', 'Agency Mây Trắng · Singapore (từ xa)'],
    ['2018 – 2020', 'Graphic Designer', 'Studio Nắng · Hà Nội'],
  ].forEach(([years, role, place], i) => {
    const top = y + i * 96;
    els.push(
      text('paragraph', at(X, top + 4, 200, 26), years, { color: '#a5b4fc', fontWeight: 600 }),
      text('subheading', at(320, top, 800, 30), role, { color: white, fontSize: 20 }),
      text('caption', at(320, top + 34, 800, 22), place, { color: muted, fontSize: 15 }),
      line(at(X, top + 66, CW, 20), '#334155'),
    );
  });

  // Testimonial
  els.push(
    text('quote', at(200, 3070, 800, 150), '“Minh An hiểu sản phẩm như một người trong đội. Thiết kế mới giúp tỉ lệ đăng ký tăng gấp đôi chỉ sau một tháng.”\n— Chị Lan, CEO Sóng Xanh', { background: card, color: '#e2e8f0', fontSize: 19, padding: 28, radius: 18 }),
  );

  // Contact + footer
  els.push(
    text('title', at(X, 3290, CW, 64), 'Cùng làm dự án tiếp theo?', { color: textGrad, fontSize: 48, textAlign: 'center' }),
    text('paragraph', at(260, 3366, 680, 30), 'hello@minhan.design · 0901 234 567', { color: '#cbd5e1', textAlign: 'center', fontSize: 17 }),
    button('gradient', at(W / 2 - 206, 3420, 200, 54), 'Gửi email', { background: grad }, { href: 'mailto:hello@minhan.design' }),
    button('outline', at(W / 2 + 6, 3420, 200, 54), 'Gọi điện', { radius: 999, color: '#e2e8f0', borderColor: '#e2e8f0' }, { href: 'tel:0901234567' }),
    ...socials(centred(4, 40, 16), 3504, '#c7d2fe', 40, 16, ['facebook', 'zaloApp', 'threads', 'linkedin']),
    text('caption', at(X, 3570, CW, 22), '© 2026 Minh An · Thiết kế bằng Web Siêu Lỏ', { color: '#64748b', textAlign: 'center' }),
  );

  return {
    name: 'Portfolio – Nhà thiết kế',
    description: 'Nền tối, chữ chuyển màu: giới thiệu, dịch vụ, 6 dự án, kinh nghiệm, liên hệ',
    page: { title: 'Minh An – UI/UX Designer', width: W, height: H, background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' },
    elements: els,
  };
}
