import { W, X, CW, at, text, button, icon, box, shape, image, socials, centred, sectionHead, col3 } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 3;

// ---------------------------------------------------------------- 2. Developer (light)

export default function developer() {
  const accent = '#0ea5e9';
  const grad = 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)';
  const ink = '#0f172a';
  const muted = '#64748b';
  const els = [];
  const H = 3380;

  els.push(
    box(at(0, 0, W, 90), { background: '#ffffff' }),
    text('subheading', at(X, 28, 300, 34), '<QuocBao />', { color: ink, fontFamily: 'mono', fontSize: 20, fontWeight: 700 }),
    text('paragraph', at(560, 32, 400, 26), 'Kỹ năng     Dự án     Kinh nghiệm     Liên hệ', { color: muted, textAlign: 'right', fontSize: 15 }),
    button('primary', at(1000, 24, 120, 42), 'Liên hệ', { background: ink, fontSize: 14, radius: 10 }, { href: 'mailto:hello@example.com' }),
  );

  // Hero
  els.push(
    text('paragraph', at(X, 170, 500, 28), "const dev = { name: 'Bảo', loves: 'React' }", { color: accent, fontFamily: 'mono', fontSize: 15 }),
    text('title', at(X, 210, 640, 140), 'Trần Quốc Bảo\nFrontend Developer', { color: ink, fontSize: 52, lineHeight: 1.15 }),
    text('paragraph', at(X, 370, 560, 84), 'Tôi xây dựng website và ứng dụng web nhanh, dễ dùng, dễ bảo trì. 5 năm làm việc với React, TypeScript và Firebase.', { color: muted, fontSize: 17 }),
    button('primary', at(X, 480, 180, 54), 'Xem dự án', { background: grad, radius: 12 }),
    button('outline', at(X + 196, 480, 170, 54), 'GitHub', { color: ink, borderColor: '#cbd5e1', radius: 12 }, { href: 'https://github.com', newTab: true }),
    shape('circle', at(780, 150, 340, 340), { background: grad }),
    text('title', at(780, 270, 340, 100), 'QB', { color: '#ffffff', fontSize: 96, textAlign: 'center', verticalAlign: 'middle', fontFamily: 'mono' }),
    shape('hexagon', at(740, 440, 90, 80), { background: '#fde68a' }),
    shape('diamond', at(1080, 130, 56, 56), { background: '#bae6fd' }),
  );

  // Skills
  let [head, y] = sectionHead(660, 'KỸ NĂNG', 'Công nghệ tôi dùng', { color: ink, labelColor: accent });
  els.push(...head);
  ;[
    ['Frontend', ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']],
    ['Backend', ['Node.js', 'Express', 'Firebase', 'PostgreSQL']],
    ['Công cụ', ['Git', 'Docker', 'Figma', 'Vercel']],
  ].forEach(([group, tags], i) => {
    const c = col3(i);
    els.push(
      box(at(c.x, y, c.w, 210), { background: '#ffffff', radius: 16, borderWidth: 1, borderColor: '#e2e8f0' }),
      icon(['file', 'zap', 'briefcase'][i], at(c.x + 24, y + 24, 44, 44), accent, { background: '#e0f2fe', radius: 12 }, 'icon', { iconSize: 52 }),
      text('subheading', at(c.x + 84, y + 32, c.w - 100, 30), group, { color: ink, fontSize: 20 }),
      ...tags.map((t, j) => button('soft', at(c.x + 24 + (j % 2) * 138, y + 96 + Math.floor(j / 2) * 52, 126, 40), t, { background: '#f1f5f9', color: '#334155', radius: 999, fontSize: 14 })),
    );
  });

  // Projects: 2 × 2 wide cards
  ;[head, y] = sectionHead(1050, 'DỰ ÁN', 'Một vài dự án gần đây', { color: ink, labelColor: accent, intro: 'Mã nguồn mở và sản phẩm thật cho khách hàng.', introColor: muted });
  els.push(...head);
  ;[
    ['Web Siêu Lỏ', 'Trang web thiết kế web kéo thả, lưu trên Firebase, xuất bản một chạm.'],
    ['Sổ Chi Tiêu', 'Ứng dụng quản lý chi tiêu cá nhân, biểu đồ theo tháng, chạy offline.'],
    ['Bếp Nhà Mình', 'Website bán đồ ăn nhà làm, đặt món và thanh toán trực tuyến.'],
    ['Lịch Họp Nhanh', 'Công cụ đặt lịch họp cho nhóm nhỏ, đồng bộ Google Calendar.'],
  ].forEach(([title, desc], i) => {
    const cx = X + (i % 2) * 530;
    const top = y + Math.floor(i / 2) * 420;
    els.push(
      box(at(cx, top, 510, 396), { background: '#ffffff', radius: 18, shadow: 'md' }),
      image(at(cx + 14, top + 14, 482, 220), `nayva-dev${i}`, title, { radius: 12 }),
      text('subheading', at(cx + 28, top + 252, 450, 30), title, { color: ink, fontSize: 21 }),
      text('paragraph', at(cx + 28, top + 290, 450, 50), desc, { color: muted, fontSize: 15 }),
      button('link', at(cx + 28, top + 348, 110, 30), 'Xem demo →', { color: accent, textAlign: 'left' }),
      icon('github', at(cx + 150, top + 346, 34, 34), ink, {}, 'iconPlain', { href: 'https://github.com', newTab: true }),
    );
  });

  // Experience: vertical timeline
  ;[head, y] = sectionHead(2080, 'KINH NGHIỆM', 'Nơi tôi đã làm việc', { color: ink, labelColor: accent });
  els.push(...head, box(at(X + 9, y + 10, 3, 340), { background: '#e2e8f0' }));
  ;[
    ['2022 – nay', 'Senior Frontend Developer', 'Công ty Phần mềm Sao Mai', 'Dẫn dắt nhóm 5 người xây dựng nền tảng thương mại điện tử.'],
    ['2020 – 2022', 'Frontend Developer', 'Startup Giao Nhanh', 'Xây ứng dụng theo dõi đơn hàng thời gian thực cho 200.000 người dùng.'],
    ['2019 – 2020', 'Web Developer (thực tập)', 'Agency Pixel', 'Làm landing page và website cho khách hàng bán lẻ.'],
  ].forEach(([years, role, place, desc], i) => {
    const top = y + i * 120;
    els.push(
      shape('circle', at(X, top + 6, 21, 21), { background: accent }),
      text('caption', at(X + 44, top, 200, 22), years, { color: accent, fontSize: 14, fontWeight: 600 }),
      text('subheading', at(X + 44, top + 24, 900, 30), `${role} · ${place}`, { color: ink, fontSize: 19 }),
      text('paragraph', at(X + 44, top + 58, 900, 28), desc, { color: muted, fontSize: 15 }),
    );
  });

  // Testimonials
  ;[head, y] = sectionHead(2560, 'CẢM NHẬN', 'Đồng nghiệp nói gì', { color: ink, labelColor: accent, align: 'center' });
  els.push(...head);
  ;[
    ['“Bảo viết code sạch, luôn nghĩ tới người dùng cuối. Làm việc cùng rất yên tâm.”', '— Anh Hùng, CTO Sao Mai'],
    ['“Ứng dụng Bảo làm chạy mượt kể cả trên điện thoại cũ. Khách hàng của chúng tôi rất thích.”', '— Chị Mai, Founder Giao Nhanh'],
  ].forEach(([quote, who], i) => {
    const cx = X + i * 530;
    els.push(text('quote', at(cx, y, 510, 150), `${quote}\n${who}`, { background: '#ffffff', color: '#334155', fontSize: 17, padding: 26, radius: 16, borderWidth: 1, borderColor: '#e2e8f0' }));
  });

  // Contact + footer
  els.push(
    box(at(X, 2920, CW, 300), { background: grad, radius: 24 }),
    text('title', at(X, 2970, CW, 60), 'Bạn có dự án cần làm?', { color: '#ffffff', fontSize: 44, textAlign: 'center' }),
    text('paragraph', at(X, 3040, CW, 30), 'Tôi đang nhận dự án freelance từ tháng này. Trả lời trong vòng 24 giờ.', { color: '#e0f2fe', textAlign: 'center', fontSize: 17 }),
    button('raised', at(W / 2 - 200, 3100, 190, 54), 'hello@quocbao.dev', { fontSize: 15 }, { href: 'mailto:hello@quocbao.dev' }),
    button('outline', at(W / 2 + 10, 3100, 190, 54), 'Gọi 0901 234 567', { color: '#ffffff', borderColor: '#ffffff', fontSize: 15 }, { href: 'tel:0901234567' }),
    ...socials(centred(4, 36, 16), 3264, ink, 36, 16, ['facebook', 'zaloApp', 'threads', 'github']),
    text('caption', at(X, 3320, CW, 22), '© 2026 Trần Quốc Bảo · Làm bằng Web Siêu Lỏ', { textAlign: 'center' }),
  );

  return {
    name: 'Portfolio – Lập trình viên',
    description: 'Nền sáng: kỹ năng, 4 dự án, dòng thời gian kinh nghiệm, cảm nhận, liên hệ',
    page: { title: 'Trần Quốc Bảo – Frontend Developer', width: W, height: H, background: '#f8fafc' },
    elements: els,
  };
}
