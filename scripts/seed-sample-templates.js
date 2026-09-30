/**
 * Sample full-page portfolio templates (hero, about, services/skills, projects, experience,
 * testimonials, contact, footer), written to the `templates` collection so every user sees them under
 * "Tạo trang mới". Fixed ids: running it again updates them instead of adding copies, and retired
 * samples are removed. Admins can still delete them from the admin screen.
 *
 *   npm run seed:templates                 write to Firestore
 *   npm run seed:templates -- --preview D   only write D/<id>.html (+ D/templates.json) for a look, touch nothing
 *
 * Names, contacts and photos (picsum.photos) are placeholders the user replaces.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createElement, createFromKey, normalizeDoc } from '../src/lib/render/elements.js';
import { exportHtml } from '../src/lib/render/exportHtml.js';

const W = 1200;
const X = 80; // page margin
const CW = W - X * 2; // content width

// ---------------------------------------------------------------- building blocks

const at = (x, y, w, h) => ({ x, y, ...(w && { w }), ...(h && { h }) });
const text = (preset, box, t, style = {}) => createFromKey(`text:${preset}`, { ...box, props: { text: t }, style });
const button = (preset, box, t, style = {}, props = {}) => createFromKey(`button:${preset}`, { ...box, props: { text: t, ...props }, style });
const icon = (name, box, color, style = {}, preset = 'iconPlain', props = {}) =>
  createFromKey(`button:${preset}`, { ...box, props: { icon: name, iconColor: color, label: '', ...props }, style });
const box = (b, style) => createElement('box', { ...b, style });
const line = (b, color, lineWidth = 1) => createElement('divider', { ...b, style: { color, lineWidth } });
const shape = (kind, b, style = {}, props = {}) => createFromKey(`shape:${kind}`, { ...b, style, props: { shadow: false, texture: false, rim: 0, ...props } });
const photo = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const image = (b, seed, alt, style = {}) =>
  createElement('image', { ...b, props: { src: photo(seed, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style });
/** A shape filled with a placeholder photo, framed from its known natural size. */
const photoShape = (kind, b, seed, extra = {}) =>
  shape(kind, b, { background: '#e7e5e4' }, { src: photo(seed, 800, 1000), imgW: 800, imgH: 1000, alt: 'Ảnh minh hoạ', ...extra });
/** Placeholder links for the social icons: the user swaps in their own account. */
const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/tentaikhoan',
  zaloApp: 'https://zalo.me/0901234567',
  threads: 'https://www.threads.com/@tentaikhoan',
  instagram: 'https://www.instagram.com/tentaikhoan',
  tiktok: 'https://www.tiktok.com/@tentaikhoan',
  linkedin: 'https://www.linkedin.com/in/tentaikhoan',
  github: 'https://github.com/tentaikhoan',
  mail: 'mailto:hello@example.com',
};
const socials = (x, y, color, size = 44, gap = 12, names = ['facebook', 'zaloApp', 'threads', 'instagram']) =>
  names.map((n, i) => {
    const href = SOCIAL_LINKS[n];
    return icon(n, at(x + i * (size + gap), y, size, size), color, {}, 'iconPlain', href ? { href, newTab: !href.startsWith('mailto:') } : {});
  });
/** The contact icons every template carries: Facebook, Zalo, Threads. */
const contactIcons = (x, y, color, size = 32, gap = 10) => socials(x, y, color, size, gap, ['facebook', 'zaloApp', 'threads']);
/** Left edge that ends `count` icons of `size` with `gap` between them at `right`. */
const rightAligned = (right, count = 3, size = 32, gap = 10) => right - (count * size + (count - 1) * gap);
/** Left edge that centres `count` items of `size` with `gap` between them. */
const centred = (count, size, gap) => (W - (count * size + (count - 1) * gap)) / 2;

/** Small caps label + big title (+ optional intro), left or centred. Returns [elements, bottomY]. */
function sectionHead(y, label, title, { color, labelColor, intro, introColor, align = 'left', font } = {}) {
  const els = [
    text('label', at(X, y, CW, 22), label, { color: labelColor, textAlign: align }),
    text('heading', at(X, y + 30, CW, 54), title, { color, fontSize: 40, textAlign: align, ...(font && { fontFamily: font }) }),
  ];
  let bottom = y + 96;
  if (intro) {
    const w = align === 'center' ? 720 : 640;
    els.push(text('paragraph', at(align === 'center' ? (W - w) / 2 : X, bottom, w, 56), intro, { color: introColor, textAlign: align, fontSize: 17 }));
    bottom += 70;
  }
  return [els, bottom];
}

/** Three evenly spaced columns across the content width. */
const col3 = (i, gap = 40) => {
  const w = (CW - gap * 2) / 3;
  return { x: X + i * (w + gap), w };
};

// ---------------------------------------------------------------- 1. Designer (dark)

function designer() {
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

// ---------------------------------------------------------------- 2. Developer (light)

function developer() {
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

// ---------------------------------------------------------------- 3. Photographer

function photographer() {
  const ink = '#1c1917';
  const muted = '#78716c';
  const gold = '#a16207';
  const els = [];
  const H = 3560;

  // Hero banner
  els.push(
    image(at(0, 0, W, 620), 'nayva-photo-hero', 'Ảnh bìa'),
    box(at(0, 0, W, 620), { background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.55) 100%)' }),
    text('subheading', at(X, 30, 300, 34), 'Thu Hà Photography', { color: '#ffffff', fontFamily: 'playfair', fontSize: 22 }),
    text('paragraph', at(600, 34, 520, 26), 'Giới thiệu     Tác phẩm     Bảng giá     Liên hệ', { color: '#f5f5f4', textAlign: 'right', fontSize: 15 }),
    text('label', at(X, 360, 500, 22), 'NHIẾP ẢNH CHÂN DUNG · CƯỚI · SẢN PHẨM', { color: '#fde68a' }),
    text('title', at(X, 392, 800, 90), 'Lưu giữ khoảnh khắc thật', { color: '#ffffff', fontFamily: 'playfair', fontSize: 64 }),
    button('raised', at(X, 510, 190, 54), 'Đặt lịch chụp', { color: ink, radius: 999 }, { href: 'tel:0901234567' }),
    button('outline', at(X + 206, 510, 170, 54), 'Xem tác phẩm', { color: '#ffffff', borderColor: '#ffffff', radius: 999 }),
  );

  // About
  els.push(
    photoShape('arch', at(X, 720, 380, 480), 'nayva-photo-portrait'),
    text('label', at(540, 760, 400, 22), 'VỀ TÔI', { color: gold }),
    text('heading', at(540, 790, 580, 60), 'Xin chào, tôi là Thu Hà', { color: ink, fontFamily: 'playfair', fontSize: 42 }),
    text('paragraph', at(540, 870, 580, 140), 'Tôi cầm máy từ năm 2015 và chụp hơn 300 cặp đôi, gia đình và thương hiệu. Tôi thích ánh sáng tự nhiên, màu phim và những khoảnh khắc không cần tạo dáng.', { color: '#57534e', fontSize: 17, lineHeight: 1.75 }),
  );
  ;[
    ['300+', 'buổi chụp'],
    ['9', 'năm kinh nghiệm'],
    ['4.9★', 'đánh giá'],
  ].forEach(([n, cap], i) => {
    els.push(
      text('title', at(540 + i * 190, 1040, 170, 56), n, { color: ink, fontFamily: 'playfair', fontSize: 44 }),
      text('caption', at(540 + i * 190, 1100, 170, 22), cap, { color: muted, fontSize: 15 }),
    );
  });

  // Gallery
  let [head, y] = sectionHead(1300, 'TÁC PHẨM', 'Một vài khoảnh khắc', { color: ink, labelColor: gold, font: 'playfair', align: 'center' });
  els.push(...head);
  const g = (b, seed) => image(b, seed, 'Ảnh tác phẩm', { radius: 14 });
  els.push(
    g(at(X, y, 330, 420), 'nayva-g1'),
    g(at(X + 355, y, 330, 200), 'nayva-g2'),
    g(at(X + 355, y + 220, 330, 200), 'nayva-g3'),
    g(at(X + 710, y, 330, 280), 'nayva-g4'),
    g(at(X + 710, y + 300, 330, 380), 'nayva-g5'),
    g(at(X, y + 440, 330, 240), 'nayva-g6'),
    g(at(X + 355, y + 440, 330, 240), 'nayva-g7'),
  );

  // Packages
  ;[head, y] = sectionHead(2170, 'BẢNG GIÁ', 'Gói chụp', { color: ink, labelColor: gold, font: 'playfair', align: 'center', intro: 'Giá đã gồm chỉnh màu toàn bộ ảnh và giao ảnh online trong 7 ngày.', introColor: muted });
  els.push(...head);
  ;[
    ['Chân dung', '1.500.000đ', '•  1 giờ chụp, 1 địa điểm\n•  30 ảnh chỉnh màu\n•  Tư vấn trang phục', false],
    ['Cưới hỏi', '12.000.000đ', '•  Cả ngày cưới, 2 thợ chụp\n•  500+ ảnh chỉnh màu\n•  Album in 30×30cm', true],
    ['Sản phẩm', '3.000.000đ', '•  Tối đa 20 sản phẩm\n•  Nền trắng + bối cảnh\n•  Ảnh sẵn sàng đăng bán', false],
  ].forEach(([name, price, list, featured], i) => {
    const c = col3(i, 30);
    const bg = featured ? ink : '#ffffff';
    const fg = featured ? '#fafaf9' : ink;
    els.push(
      box(at(c.x, y, c.w, 380), { background: bg, radius: 20, shadow: featured ? 'lg' : 'sm' }),
      text('label', at(c.x + 30, y + 32, c.w - 60, 22), featured ? 'PHỔ BIẾN NHẤT' : 'GÓI', { color: featured ? '#fde68a' : gold }),
      text('subheading', at(c.x + 30, y + 60, c.w - 60, 36), name, { color: fg, fontFamily: 'playfair', fontSize: 28 }),
      text('title', at(c.x + 30, y + 104, c.w - 60, 50), price, { color: fg, fontSize: 32 }),
      text('list', at(c.x + 30, y + 170, c.w - 60, 110), list, { color: featured ? '#d6d3d1' : '#57534e', fontSize: 15 }),
      button(featured ? 'raised' : 'pill', at(c.x + 30, y + 300, c.w - 60, 50), 'Chọn gói này', featured ? { color: ink, radius: 999 } : { background: ink }, { href: 'tel:0901234567' }),
    );
  });

  // Testimonials
  ;[head, y] = sectionHead(2790, 'KHÁCH HÀNG NÓI', 'Những lời cảm ơn', { color: ink, labelColor: gold, font: 'playfair', align: 'center' });
  els.push(...head);
  ;[
    ['“Ảnh cưới đẹp hơn cả mong đợi. Hà rất tinh tế, bắt được những khoảnh khắc chúng tôi không hề để ý.”', '— Linh & Nam'],
    ['“Bộ ảnh sản phẩm giúp shop tăng đơn rõ rệt. Làm việc nhanh, đúng hẹn.”', '— Shop Gốm Mộc'],
  ].forEach(([quote, who], i) => {
    els.push(text('quote', at(X + i * 530, y, 510, 140), `${quote}\n${who}`, { background: '#ffffff', color: '#44403c', fontSize: 17, padding: 26, radius: 16 }));
  });

  // Contact + footer
  els.push(
    line(at(X, 3160, CW, 20), '#d6d3d1'),
    text('heading', at(X, 3220, CW, 60), 'Hẹn gặp bạn trong buổi chụp tới', { color: ink, fontFamily: 'playfair', fontSize: 40, textAlign: 'center' }),
    text('paragraph', at(X, 3290, CW, 30), 'hello@thuha.vn · 0901 234 567 · Quận 3, TP. Hồ Chí Minh', { color: muted, textAlign: 'center', fontSize: 17 }),
    button('pill', at(W / 2 - 110, 3350, 220, 54), 'Đặt lịch ngay', { background: ink }, { href: 'tel:0901234567' }),
    ...socials(centred(4, 40, 16), 3436, ink, 40, 16, ['facebook', 'zaloApp', 'threads', 'instagram']),
    text('caption', at(X, 3510, CW, 22), '© 2026 Thu Hà Photography', { textAlign: 'center' }),
  );

  return {
    name: 'Portfolio – Nhiếp ảnh',
    description: 'Ảnh bìa lớn, bộ ảnh tác phẩm, bảng giá gói chụp, cảm nhận, liên hệ',
    page: { title: 'Thu Hà Photography', width: W, height: H, background: '#f5f5f4' },
    elements: els,
  };
}

// ---------------------------------------------------------------- 4. Content creator / writer

function creator() {
  const orange = '#ea580c';
  const grad = 'linear-gradient(135deg, #fb923c 0%, #ec4899 100%)';
  const ink = '#431407';
  const muted = '#9a3412';
  const soft = '#7c2d12';
  const els = [];
  const H = 3140;

  els.push(
    text('subheading', at(X, 30, 300, 34), 'Khánh Vy.', { color: ink, fontFamily: 'lora', fontSize: 24, fontWeight: 700 }),
    text('paragraph', at(600, 34, 360, 26), 'Về tôi     Bài viết     Dịch vụ     Liên hệ', { color: soft, textAlign: 'right', fontSize: 15 }),
    button('gradient', at(1000, 24, 120, 44), 'Hợp tác', { background: grad, fontSize: 14 }, { href: 'mailto:hello@example.com' }),
  );

  // Hero
  els.push(
    shape('blob', at(700, 110, 440, 420), { background: '#fed7aa' }),
    photoShape('heart', at(770, 170, 300, 280), 'nayva-creator-hero'),
    shape('star', at(700, 440, 70, 70), { background: grad }),
    text('label', at(X, 170, 500, 22), 'COPYWRITER · CONTENT CREATOR', { color: orange }),
    text('title', at(X, 204, 580, 200), 'Viết những câu chuyện khiến thương hiệu được nhớ tới.', { color: ink, fontFamily: 'lora', fontSize: 50, lineHeight: 1.15 }),
    text('paragraph', at(X, 420, 540, 60), 'Tôi là Khánh Vy, viết nội dung cho thương hiệu F&B, làm đẹp và du lịch từ 2018.', { color: soft, fontSize: 17 }),
    button('gradient', at(X, 500, 200, 54), 'Đọc bài viết', { background: grad }),
    button('outline', at(X + 216, 500, 160, 54), 'Nhận báo giá', { color: orange, borderColor: orange, radius: 999 }, { href: 'mailto:hello@example.com' }),
  );

  // Brands
  els.push(
    text('caption', at(X, 640, CW, 22), 'ĐÃ ĐỒNG HÀNH CÙNG', { color: muted, textAlign: 'center', letterSpacing: 2, fontSize: 13, fontWeight: 700 }),
    ...['Cà phê Gió', 'Mộc Spa', 'Hội An Travel', 'Bếp Nhà Mình', 'Gốm Mộc'].map((b, i) =>
      text('subheading', at(X + i * 208, 676, 208, 36), b, { color: '#c2410c', fontFamily: 'lora', fontSize: 22, textAlign: 'center', opacity: 0.7 }),
    ),
  );

  // Featured work
  let [head, y] = sectionHead(800, 'BÀI VIẾT NỔI BẬT', 'Những dự án tôi tự hào', { color: ink, labelColor: orange, font: 'lora' });
  els.push(...head);
  ;[
    ['Chiến dịch “Sáng nay uống gì?”', 'Cà phê Gió · Mạng xã hội', 'Chuỗi 30 bài đăng tăng 45% lượt tương tác trong một tháng.'],
    ['Cẩm nang 3 ngày ở Hội An', 'Hội An Travel · Blog', 'Bài viết đứng top 3 Google cho từ khoá “du lịch Hội An 3 ngày”.'],
    ['Câu chuyện thương hiệu Mộc Spa', 'Mộc Spa · Website', 'Viết lại toàn bộ nội dung website, tăng 30% lượt đặt lịch.'],
  ].forEach(([title, client, result], i) => {
    const top = y + i * 250;
    els.push(
      image(at(X, top, 380, 220), `nayva-cr${i}`, title, { radius: 18 }),
      text('caption', at(500, top + 30, 620, 22), client, { color: orange, fontSize: 14, fontWeight: 600 }),
      text('subheading', at(500, top + 58, 620, 40), title, { color: ink, fontFamily: 'lora', fontSize: 26 }),
      text('paragraph', at(500, top + 108, 620, 56), result, { color: soft, fontSize: 16 }),
      button('link', at(500, top + 172, 140, 30), 'Đọc bài →', { color: orange, textAlign: 'left' }),
    );
  });

  // Services
  ;[head, y] = sectionHead(1740, 'DỊCH VỤ', 'Tôi có thể viết gì cho bạn', { color: ink, labelColor: orange, font: 'lora', align: 'center' });
  els.push(...head);
  ;[
    ['file', 'Bài viết blog & SEO', 'Bài chuẩn SEO, dễ đọc, mang lại khách hàng từ Google.'],
    ['message', 'Nội dung mạng xã hội', 'Lịch đăng bài, caption và ý tưởng hình ảnh cho cả tháng.'],
    ['sparkles', 'Câu chuyện thương hiệu', 'Giọng văn, thông điệp và nội dung website cho thương hiệu.'],
  ].forEach(([ic, title, desc], i) => {
    const c = col3(i);
    els.push(
      box(at(c.x, y, c.w, 240), { background: '#ffffff', radius: 20, shadow: 'sm' }),
      icon(ic, at(c.x + 28, y + 28, 56, 56), '#ffffff', { background: grad, radius: 999 }, 'icon', { iconSize: 46 }),
      text('subheading', at(c.x + 28, y + 104, c.w - 56, 32), title, { color: ink, fontFamily: 'lora', fontSize: 21 }),
      text('paragraph', at(c.x + 28, y + 144, c.w - 56, 80), desc, { color: soft, fontSize: 15 }),
    );
  });

  // Testimonial
  els.push(
    shape('circle', at(W / 2 - 40, 2200, 80, 80), { background: grad }),
    text('title', at(W / 2 - 40, 2212, 80, 56), '“', { color: '#ffffff', fontSize: 64, textAlign: 'center', verticalAlign: 'middle', fontFamily: 'lora' }),
    text('paragraph', at(200, 2310, 800, 110), 'Vy nắm bắt giọng thương hiệu rất nhanh. Nội dung vừa có cảm xúc vừa bán được hàng, đúng thứ chúng tôi cần.', { color: ink, fontFamily: 'lora', fontSize: 24, italic: true, textAlign: 'center', lineHeight: 1.5 }),
    text('caption', at(200, 2430, 800, 22), '— Anh Tùng, Giám đốc Marketing Cà phê Gió', { color: muted, textAlign: 'center', fontSize: 15 }),
  );

  // Contact + footer
  els.push(
    box(at(X, 2560, CW, 340), { background: grad, radius: 28 }),
    shape('blob', at(960, 2590, 140, 130), { background: '#ffffff', opacity: 0.18 }),
    text('title', at(X, 2620, CW, 64), 'Cùng kể câu chuyện của bạn nhé?', { color: '#ffffff', fontFamily: 'lora', fontSize: 44, textAlign: 'center' }),
    text('paragraph', at(X, 2700, CW, 30), 'Nhận viết theo bài hoặc theo tháng. Gửi mình vài dòng về thương hiệu của bạn.', { color: '#ffedd5', textAlign: 'center', fontSize: 17 }),
    button('raised', at(W / 2 - 110, 2770, 220, 54), 'hello@khanhvy.vn', { color: ink, fontSize: 15, radius: 999 }, { href: 'mailto:hello@khanhvy.vn' }),
    ...socials(centred(4, 40, 16), 2960, soft, 40, 16, ['facebook', 'zaloApp', 'threads', 'tiktok']),
    text('caption', at(X, 3030, CW, 22), '© 2026 Khánh Vy · Viết bằng cả trái tim', { textAlign: 'center', color: muted }),
  );

  return {
    name: 'Portfolio – Sáng tạo nội dung',
    description: 'Tông cam ấm: bài viết nổi bật, thương hiệu đã hợp tác, dịch vụ, liên hệ',
    page: { title: 'Khánh Vy – Copywriter', width: W, height: H, background: '#fff7ed' },
    elements: els,
  };
}

// ---------------------------------------------------------------- 5. Pastel poster (graphic designer)

/**
 * The hero is a pastel poster: "PORT FOLIO" over a peach → pink wash, a white photo frame edged by a
 * pink bar and a pink → cyan bar, a see-through pink card with the name over the photo's corner, and
 * two columns of dots. The rest of the page follows the same palette.
 */
function pastel() {
  const ink = '#3f3f46';
  const muted = '#71717a';
  const pink = '#f472b6';
  const pinkSoft = '#fbcfe8';
  const cyan = '#22d3ee';
  const cardGrad = 'linear-gradient(160deg, #f9a8d4 0%, #f472b6 100%)';
  const wash = 'linear-gradient(135deg, #fdba74 0%, #f9a8d4 100%)';
  const font = 'montserrat';
  const els = [];
  const H = 3960;

  // Hero poster
  els.push(
    box(at(0, 0, W, 560), { background: 'linear-gradient(180deg, #fdc590 0%, #f9c9d6 65%, #ffffff 100%)', radius: 0 }),
    text('title', at(X, 56, CW, 140), 'PORT FOLIO', { color: ink, fontFamily: font, fontSize: 124, fontWeight: 800, letterSpacing: 4, lineHeight: 1, textAlign: 'center', verticalAlign: 'middle' }),
    // Frame: pink bar on top, pink → cyan bar down the left, the white card and the photo inside it.
    box(at(144, 229, 871, 14), { background: '#f9a8c9', radius: 0 }),
    box(at(144, 229, 20, 962), { background: 'linear-gradient(180deg, #f9a8c9 0%, #22d3ee 100%)', radius: 0 }),
    box(at(170, 250, 871, 962), { background: '#ffffff', shadow: 'md', radius: 0 }),
    box(at(222, 289, 767, 793), { background: pinkSoft, radius: 0 }),
    // A fixed portrait (picsum id 64), not a random seed: the poster needs a person.
    createElement('image', { ...at(222, 289, 767, 793), props: { src: 'https://picsum.photos/id/64/1200/1240', alt: 'Ảnh chân dung', fit: 'cover' }, style: { radius: 0 } }),
    // See-through name card over the photo's lower corner, a lighter band where it overlaps.
    box(at(339, 835, 780, 663), { background: cardGrad, opacity: 0.84, radius: 0 }),
    box(at(339, 835, 650, 247), { background: '#fce7f3', opacity: 0.35, radius: 0 }),
    text('subheading', at(404, 880, 640, 64), 'XIN CHÀO, TÔI LÀ', { color: '#ffffff', fontFamily: font, fontSize: 46, fontWeight: 600, lineHeight: 1.2 }),
    text('title', at(404, 950, 640, 112), 'MAI ANH', { color: '#ffffff', fontFamily: font, fontSize: 84, fontWeight: 700, lineHeight: 1.3 }),
    text('title', at(560, 1050, 500, 112), 'NGUYỄN', { color: '#ffffff', fontFamily: font, fontSize: 84, fontWeight: 700, lineHeight: 1.3, textAlign: 'right' }),
    text('subheading', at(417, 1270, 640, 36), 'THIẾT KẾ ĐỒ HOẠ (TỪ 2016)', { color: '#ffffff', fontFamily: font, fontSize: 24, fontWeight: 600 }),
    text('paragraph', at(417, 1318, 640, 110), 'Mình thiết kế nhận diện thương hiệu, poster và nội dung mạng xã hội bằng màu sắc tươi sáng, bố cục gọn gàng và thật nhiều cảm xúc.', { color: '#fff1f7', fontSize: 17, lineHeight: 1.6 }),
    // Dots: pink down the right of the frame, pink → cyan under the left bar.
    ...[0.35, 0.5, 0.65, 0.8, 1].map((o, i) => shape('circle', at(1070, 419 + i * 52, 20, 20), { background: pink, opacity: o })),
    ...['#fbcfe8', '#c4b5fd', '#67e8f9', cyan, '#06b6d4'].map((c, i) => shape('circle', at(206, 1277 + i * 52, 20, 20), { background: c })),
  );

  // About
  let [head, y] = sectionHead(1620, 'VỀ MÌNH', 'Thiết kế bằng màu sắc & cảm xúc', {
    color: ink,
    labelColor: pink,
    font,
    align: 'center',
    intro: '8 năm làm việc cùng các thương hiệu thời trang, mỹ phẩm và F&B. Mình tin một thiết kế đẹp phải khiến người xem mỉm cười trước khi kịp đọc chữ.',
    introColor: muted,
  });
  els.push(...head);
  ;[
    ['120+', 'Dự án hoàn thành'],
    ['45', 'Thương hiệu đồng hành'],
    ['8', 'Năm kinh nghiệm'],
  ].forEach(([n, label], i) => {
    const c = col3(i);
    els.push(
      text('title', at(c.x, y + 10, c.w, 70), n, { color: pink, fontFamily: font, fontSize: 56, fontWeight: 800, textAlign: 'center' }),
      text('paragraph', at(c.x, y + 84, c.w, 28), label, { color: muted, textAlign: 'center', fontSize: 16 }),
    );
  });

  // Services
  ;[head, y] = sectionHead(2070, 'DỊCH VỤ', 'Mình có thể giúp gì cho bạn', { color: ink, labelColor: pink, font, align: 'center' });
  els.push(...head);
  ;[
    ['sparkles', 'Nhận diện thương hiệu', 'Logo, bảng màu, font chữ và bộ quy chuẩn để thương hiệu luôn nhất quán.'],
    ['image', 'Poster & ấn phẩm', 'Poster sự kiện, bao bì, menu, catalogue… in ấn hay đăng online đều đẹp.'],
    ['heart', 'Nội dung mạng xã hội', 'Bộ khung bài đăng, story và ảnh bìa theo đúng tông màu của bạn.'],
  ].forEach(([ic, title, desc], i) => {
    const c = col3(i);
    els.push(
      box(at(c.x, y, c.w, 250), { background: '#ffffff', radius: 20, shadow: 'md' }),
      box(at(c.x, y, c.w, 8), { background: i === 1 ? 'linear-gradient(90deg, #f9a8d4 0%, #22d3ee 100%)' : wash, radius: 4 }),
      icon(ic, at(c.x + 28, y + 36, 56, 56), '#ffffff', { background: cardGrad, radius: 999 }, 'icon', { iconSize: 46 }),
      text('subheading', at(c.x + 28, y + 112, c.w - 56, 32), title, { color: ink, fontFamily: font, fontSize: 20, fontWeight: 700 }),
      text('paragraph', at(c.x + 28, y + 152, c.w - 56, 80), desc, { color: muted, fontSize: 15 }),
    );
  });

  // Projects: photos on offset pink / cyan / peach plates, like the hero frame.
  ;[head, y] = sectionHead(2520, 'DỰ ÁN', 'Tác phẩm nổi bật', { color: ink, labelColor: pink, font, align: 'center' });
  els.push(...head);
  ;[
    ['Nhận diện “Hoa Mộc Tea”', 'Thương hiệu · 2025', pinkSoft],
    ['Poster Lễ hội Âm nhạc Mùa hè', 'Poster · 2024', '#a5f3fc'],
    ['Bộ bao bì Mỹ phẩm Lam', 'Bao bì · 2024', '#fed7aa'],
  ].forEach(([title, meta, plate], i) => {
    const c = col3(i);
    els.push(
      box(at(c.x + 14, y + 14, c.w, 300), { background: plate, radius: 0 }),
      image(at(c.x, y, c.w, 300), `nayva-pastel-p${i}`, title, { radius: 0 }),
      text('caption', at(c.x, y + 334, c.w, 22), meta, { color: pink, fontSize: 14, fontWeight: 600 }),
      text('subheading', at(c.x, y + 360, c.w, 32), title, { color: ink, fontFamily: font, fontSize: 20, fontWeight: 700 }),
    );
  });

  // Experience timeline
  ;[head, y] = sectionHead(3080, 'KINH NGHIỆM', 'Hành trình của mình', { color: ink, labelColor: pink, font });
  els.push(...head, box(at(X, y + 6, 6, 330), { background: 'linear-gradient(180deg, #f9a8c9 0%, #22d3ee 100%)', radius: 3 }));
  ;[
    ['2021 – nay', 'Trưởng nhóm thiết kế', 'Studio Hồng Đào · TP. Hồ Chí Minh'],
    ['2018 – 2021', 'Thiết kế đồ hoạ', 'Agency Mây Trắng · Hà Nội'],
    ['2016 – 2018', 'Thiết kế tự do', 'Hơn 30 khách hàng nhỏ và vừa'],
  ].forEach(([years, role, place], i) => {
    const top = y + i * 115;
    els.push(
      shape('circle', at(X - 7, top + 6, 20, 20), { background: i === 2 ? cyan : pink }),
      text('caption', at(X + 36, top, 200, 24), years, { color: pink, fontSize: 15, fontWeight: 700 }),
      text('subheading', at(X + 36, top + 28, 700, 32), role, { color: ink, fontFamily: font, fontSize: 22, fontWeight: 700 }),
      text('paragraph', at(X + 36, top + 64, 700, 26), place, { color: muted, fontSize: 16 }),
    );
  });

  // Contact + footer
  els.push(
    box(at(X, 3520, CW, 300), { background: 'linear-gradient(135deg, #fdba74 0%, #f9a8d4 55%, #67e8f9 100%)', radius: 28 }),
    ...[0.5, 0.7, 1].map((o, i) => shape('circle', at(X + 40, 3560 + i * 34, 16, 16), { background: '#ffffff', opacity: o })),
    text('title', at(X, 3570, CW, 64), 'Cùng tạo điều gì đó thật xinh nhé!', { color: '#ffffff', fontFamily: font, fontSize: 42, fontWeight: 800, textAlign: 'center' }),
    text('paragraph', at(X, 3646, CW, 30), 'Nhận dự án mới mỗi tháng · phản hồi trong 24 giờ', { color: '#ffffff', textAlign: 'center', fontSize: 17 }),
    button('raised', at(W / 2 - 120, 3706, 240, 56), 'hello@maianh.vn', { color: pink, fontSize: 16, fontWeight: 700, radius: 999 }, { href: 'mailto:hello@maianh.vn' }),
    ...socials(centred(4, 40, 16), 3856, pink, 40, 16, ['facebook', 'zaloApp', 'threads', 'instagram']),
    text('caption', at(X, 3916, CW, 22), '© 2026 Mai Anh Nguyễn · Graphic Designer', { textAlign: 'center', color: muted }),
  );

  return {
    name: 'Portfolio – Poster pastel',
    description: 'Hero kiểu poster hồng – đào – xanh ngọc, dịch vụ, dự án, kinh nghiệm, liên hệ',
    page: { title: 'Mai Anh Nguyễn – Graphic Designer', width: W, height: H, background: '#ffffff' },
    elements: els,
  };
}

// ---------------------------------------------------------------- slide-deck portfolios (src/assets/tl)
// Each reference is a 9-slide deck, condensed here into one screen (1200 × 800): the deck's look — its
// giant type, photos over the title, colours and doodles — with the essentials of every slide.

const SH = 800; // the one screen
/** A picsum photo (fixed id) cropped to the box; `gray` for black-and-white decks. */
const pic = (id, b, { gray = false, ...style } = {}) =>
  createElement('image', {
    ...b,
    props: { src: `https://picsum.photos/id/${id}/${Math.round(b.w * 1.5)}/${Math.round(b.h * 1.5)}${gray ? '?grayscale' : ''}`, alt: 'Ảnh minh hoạ', fit: 'cover' },
    style: { radius: 0, ...style },
  });
const fill = (b, background, extra = {}) => box(b, { background, radius: 0, ...extra });
/** Display type: Anton has a single weight; other fonts are set extra bold. */
const big = (b, t, color, font, fontSize, extra = {}) =>
  text('title', b, t, { color, fontFamily: font, fontSize, fontWeight: font === 'anton' ? 400 : 800, lineHeight: 1.15, letterSpacing: 0, ...extra });
const para = (b, t, color, extra = {}) => text('paragraph', b, t, { color, fontSize: 14, lineHeight: 1.6, ...extra });
const tag = (b, t, color, extra = {}) => text('caption', b, t, { color, fontSize: 12, fontWeight: 700, letterSpacing: 1, ...extra });
const bullets = (b, items, color, extra = {}) => text('list', b, items.map((s) => `•  ${s}`).join('\n'), { color, fontSize: 13, lineHeight: 1.7, ...extra });
/** A decoration (hand-drawn arrow, brush stroke, ink blot…) in the given colour. */
const doodle = (key, b, color, props = {}, style = {}) => createFromKey(`decor:${key}`, { ...b, props: { color, ...props }, style });
const onePage = (name, description, title, background, elements) => ({ name, description, page: { title, width: W, height: SH, background }, elements });
const LOREM = 'Mình yêu thích kể chuyện bằng hình ảnh, luôn bắt đầu từ việc lắng nghe khách hàng và kết thúc bằng những sản phẩm gọn gàng, có cá tính.';
const LOREM2 = 'Hơn 5 năm làm việc cùng các thương hiệu thời trang, F&B và giáo dục, từ ý tưởng, chụp ảnh đến triển khai trên mạng xã hội.';
/** Photo with a caption under it (project thumbnails). */
const shot = (id, b, caption, color, opts = {}) => [pic(id, b, opts), tag(at(b.x, b.y + b.h + 8, b.w, 18), caption, color, { fontSize: 11 })];

// ---------------------------------------------------------------- 1: taupe & wine with doodles (mau-portfolio-1)

function deckDoodle() {
  const wine = '#5b1a2c';
  const ink = '#3d3636';
  const f = 'anton';
  const heart = (x, y) => icon('heart', at(x, y, 40, 40), wine, { background: 'transparent' }, 'iconPlain', { iconSize: 90, strokeWidth: 1.6 });
  return onePage('Portfolio – Nâu rượu & nét vẽ tay', '1 màn hình: chữ nâu rượu khổng lồ, ảnh đen trắng đè lên chữ, mũi tên – trái tim vẽ tay', 'Lê Thu Hà – Portfolio', '#e8e3de', [
    big(at(36, 20, 1000, 200), 'PORTFOLIO', wine, f, 190),
    pic(64, at(560, 110, 300, 430), { gray: true }),
    doodle('arrow', at(470, 170, 90, 70), wine, { strokeWidth: 3, seed: 3 }),
    tag(at(40, 232, 420, 20), 'L Ê   T H U   H À   ·   N H I Ế P   Ả N H   &   T H I Ế T   K Ế', ink, { fontWeight: 500 }),
    para(at(40, 268, 460, 90), `${LOREM} ${LOREM2}`, ink),
    big(at(40, 372, 480, 60), 'PERSONAL SKILLS', wine, f, 44),
    icon('zap', at(318, 372, 36, 36), wine, { background: 'transparent' }, 'iconPlain', { iconSize: 90, strokeWidth: 1.6 }),
    bullets(at(40, 432, 460, 90), ['Nhiếp ảnh chân dung & lookbook', 'Quay dựng video ngắn', 'Chỉ đạo hình ảnh cho thương hiệu'], ink),
    big(at(900, 120, 260, 60), 'WORK', wine, f, 50, { textAlign: 'right' }),
    tag(at(900, 190, 260, 18), 'QUẢN LÝ DỰ ÁN · 2022 – NAY', ink, { textAlign: 'right' }),
    para(at(900, 210, 260, 70), 'Agency Gió Nam – 30+ chiến dịch hình ảnh.', ink, { fontSize: 13, textAlign: 'right' }),
    tag(at(900, 290, 260, 18), 'NHÂN VIÊN KINH DOANH · 2020', ink, { textAlign: 'right' }),
    para(at(900, 310, 260, 70), 'Mộc Studio – 200+ khách hàng doanh nghiệp.', ink, { fontSize: 13, textAlign: 'right' }),
    heart(1120, 400),
    big(at(40, 560, 400, 60), 'BEST PROJECT', wine, f, 44),
    ...shot(1005, at(40, 624, 200, 120), 'STUDIO MỘC · LOOKBOOK', ink, { gray: true }),
    ...shot(838, at(256, 624, 200, 120), 'CHIẾN DỊCH MÙA HÈ', ink, { gray: true }),
    ...shot(1, at(472, 624, 200, 120), 'BỘ NHẬN DIỆN', ink, { gray: true }),
    big(at(740, 560, 420, 90), 'CONTACT ME', wine, f, 70, { textAlign: 'right' }),
    doodle('arrow', at(700, 680, 70, 70), wine, { strokeWidth: 3, seed: 21 }),
    para(at(780, 660, 380, 90), 'hello@lethuha.vn\n0901 234 567  ·  @lethuha.design', ink, { fontSize: 15, textAlign: 'right' }),
    ...contactIcons(rightAligned(1160), 722, wine),
  ]);
}

// ---------------------------------------------------------------- 2: blush pink, serif (mau-portfolio-2)

function deckBlush() {
  const mauve = '#bf979f';
  const ink = '#2b2326';
  const serif = 'playfair';
  const card = (b, title, t) => [
    fill(b, mauve),
    tag(at(b.x + 20, b.y + 16, b.w - 40, 22), title, '#fbf4f5', { fontFamily: serif, fontSize: 18, fontWeight: 400, letterSpacing: 2 }),
    para(at(b.x + 20, b.y + 48, b.w - 40, b.h - 60), t, '#fbf4f5', { fontFamily: 'lora', fontSize: 13 }),
  ];
  return onePage('Portfolio – Hồng phấn cổ điển', '1 màn hình: nền hồng phấn, chữ có chân thanh lịch, khung chữ tím hồng, chữ viết tay', 'Phạm Ngọc Anh – Photography', '#e2cdd1', [
    tag(at(40, 26, 300, 18), 'PHẠM NGỌC ANH', ink, { fontFamily: 'lora', fontWeight: 400, letterSpacing: 3 }),
    tag(at(860, 26, 300, 18), 'PHOTOGRAPHY · 2026', ink, { fontFamily: 'lora', fontWeight: 400, letterSpacing: 3, textAlign: 'right' }),
    pic(64, at(470, 50, 260, 460)),
    text('subheading', at(120, 150, 300, 36), 'CREATIVE', { color: ink, fontFamily: serif, fontSize: 26, fontWeight: 400 }),
    big(at(40, 170, 1120, 170), 'PORTFOLIO', ink, serif, 160, { fontWeight: 400, textAlign: 'center', letterSpacing: -4 }),
    ...card(at(40, 360, 380, 150), 'ABOUT ME', `${LOREM}`),
    ...card(at(780, 360, 380, 150), 'EXPERIENCE', 'Studio Hồng Đào · 2019 – 2022\nAgency Mây Trắng · 2022 – nay\nĐH Mỹ thuật · Học viện Nhiếp ảnh'),
    ...[[10, 'FIRST PROJECT'], [1027, 'SECOND PROJECT'], [646, 'LOOKBOOK'], [526, 'BRANDING']].flatMap(([id, t], k) => [
      pic(id, at(40 + k * 285, 540, 265, 140), { gray: id === 1027 }),
      tag(at(40 + k * 285, 688, 265, 18), t, ink, { fontFamily: 'lora', fontWeight: 400, letterSpacing: 2, textAlign: 'center' }),
    ]),
    text('title', at(40, 712, 560, 80), "Let's work together", { color: ink, fontFamily: 'great-vibes', fontSize: 54, fontWeight: 400 }),
    ...contactIcons(636, 738, ink),
    fill(at(770, 734, 390, 40), mauve),
    tag(at(780, 745, 370, 20), '0901 234 567   ·   hello@ngocanh.vn', '#fbf4f5', { fontFamily: 'lora', textAlign: 'center', letterSpacing: 1 }),
  ]);
}

// ---------------------------------------------------------------- 3: black & white, huge condensed type (mau-portfolio-3)

function deckNoir() {
  const white = '#f5f5f5';
  const grey = '#bdbdbd';
  const f = 'anton';
  const pill = (x, y, t) => [box(at(x, y, 170, 32), { background: 'transparent', radius: 999, borderWidth: 1.5, borderColor: white }), tag(at(x, y + 8, 170, 18), t, white, { textAlign: 'center' })];
  return onePage('Portfolio – Đen trắng chữ lớn', '1 màn hình: nền đen, chữ trắng khổng lồ, ảnh đen trắng đè lên chữ', 'Trần Đức Huy – Portfolio', '#101010', [
    fill(at(0, 0, W, SH), 'radial-gradient(circle at 50% 35%, #2e2e2e 0%, #101010 70%)'),
    tag(at(40, 30, 300, 30), 'CREATIVE', white, { fontSize: 24, fontFamily: 'montserrat', fontWeight: 700 }),
    tag(at(860, 30, 300, 36), 'THÁNG 12 / 2026\nTRẦN ĐỨC HUY', grey, { textAlign: 'right', lineHeight: 1.5 }),
    big(at(20, 60, 1160, 290), 'PORTFOLIO', white, f, 270, { textAlign: 'center' }),
    pic(91, at(460, 40, 280, 520), { gray: true }),
    tag(at(40, 390, 360, 22), 'Giới thiệu', white, { fontSize: 16, letterSpacing: 0 }),
    para(at(40, 418, 380, 110), `${LOREM} ${LOREM2}`, grey, { fontSize: 13 }),
    ...pill(40, 540, 'NHIẾP ẢNH'),
    ...pill(226, 540, 'QUAY PHIM'),
    big(at(780, 380, 380, 60), 'WORK EXPERIENCE', white, f, 44, { textAlign: 'right' }),
    tag(at(780, 446, 380, 20), 'QUẢN LÝ DỰ ÁN · 2022 – NAY', white, { textAlign: 'right' }),
    para(at(780, 468, 380, 44), 'Studio Mono – lookbook cho 15 thương hiệu.', grey, { fontSize: 13, textAlign: 'right' }),
    tag(at(780, 516, 380, 20), 'NHÂN VIÊN KINH DOANH · 2020', white, { textAlign: 'right' }),
    para(at(780, 538, 380, 44), 'Cửa hàng Gió – trưng bày & mạng xã hội.', grey, { fontSize: 13, textAlign: 'right' }),
    big(at(40, 600, 500, 60), 'BEST PROJECT', white, f, 44),
    pic(1059, at(40, 664, 170, 110), { gray: true }),
    pic(758, at(222, 664, 170, 110), { gray: true }),
    pic(473, at(404, 664, 170, 110), { gray: true }),
    big(at(640, 610, 520, 100), 'CONTACT ME', white, f, 90, { textAlign: 'right' }),
    para(at(640, 714, 520, 60), 'hello@ducuy.vn  ·  0987 654 321\n@ducuy.studio', grey, { fontSize: 14, textAlign: 'right' }),
    ...contactIcons(640, 722, white),
  ]);
}

// ---------------------------------------------------------------- 4: light / black with red-orange and script (mau-portfolio-4)

function deckAvery() {
  const light = '#efeeec';
  const dark = '#0e0e0e';
  const red = '#ff3b1f';
  const ink = '#1a1a1a';
  const f = 'anton';
  const caps = (b, t, color) => para(b, t.toUpperCase(), color, { fontSize: 11, fontWeight: 600, lineHeight: 1.5 });
  return onePage('Portfolio – Cam đỏ năng động', '1 màn hình: nền sáng + mảng đen, chữ cam đỏ khổng lồ, chữ viết tay', 'Vũ An Nhiên – Portfolio', light, [
    fill(at(760, 0, 440, SH), dark),
    tag(at(40, 26, 300, 16), 'CREATIVE / VŨ AN NHIÊN', ink, { fontSize: 11 }),
    tag(at(400, 26, 200, 16), 'THÁNG 8 / 2026', ink, { fontSize: 11, textAlign: 'center' }),
    big(at(40, 60, 420, 200), "I'M VŨ AN\nNHIÊN", ink, f, 76, { lineHeight: 1.25 }),
    caps(at(40, 270, 300, 110), `${LOREM}`, ink),
    pic(836, at(40, 390, 90, 90)),
    pic(646, at(140, 390, 90, 90)),
    pic(823, at(390, 60, 330, 470)),
    doodle('arrow', at(330, 400, 60, 100), red, { strokeWidth: 5, seed: 7 }),
    big(at(10, 520, 750, 200), 'PORTFOLIO', red, f, 164),
    text('title', { ...at(520, 690, 300, 100), rotation: -8 }, 'project', { color: ink, fontFamily: 'moon-dance', fontSize: 84, fontWeight: 400 }),
    big(at(800, 40, 360, 80), 'EDUCATION', red, f, 64),
    ...[['Thiết kế đa phương tiện', '2015 – 2019'], ['Nhiếp ảnh thời trang', '2019 – 2020'], ['Marketing nội dung', '2021 – 2022']].flatMap(([t, y], k) => [
      para(at(800, 132 + k * 44, 250, 22), t, '#ffffff', { fontSize: 14 }),
      para(at(1060, 132 + k * 44, 100, 22), y, '#ffffff', { fontSize: 12, textAlign: 'right', opacity: 0.7 }),
      line(at(800, 158 + k * 44, 360, 4), '#444444', 1),
    ]),
    big(at(800, 280, 360, 70), 'EXPERIENCE', '#ffffff', f, 58),
    ...[[823, 'LICERIA & CO.'], [836, 'STUDIO GIÓ'], [646, 'LARANA INC.']].flatMap(([id, t], k) => [
      pic(id, at(800 + k * 124, 360, 112, 120)),
      fill(at(800 + k * 124, 480, 112, 22), red),
      tag(at(800 + k * 124, 484, 112, 16), t, '#ffffff', { fontSize: 10, textAlign: 'center' }),
    ]),
    big(at(800, 560, 360, 80), "LET'S WORK", '#ffffff', f, 70),
    text('title', at(930, 620, 240, 90), 'together', { color: red, fontFamily: 'moon-dance', fontSize: 70, fontWeight: 400 }),
    para(at(800, 700, 360, 70), '+84 901 234 567\nhello@annhien.vn', '#ffffff', { fontSize: 14 }),
    ...contactIcons(rightAligned(1160), 744, '#ffffff'),
  ]);
}

// ---------------------------------------------------------------- 5: maroon / green / cream (mau-portfolio-5)

function deckCahaya() {
  const maroon = '#a12a37';
  const green = '#3e8e50';
  const cream = '#efe9df';
  const ink = '#2a2a2a';
  const f = 'anton';
  const caps = (b, t, color) => para(b, t.toUpperCase(), color, { fontSize: 11, fontWeight: 500, lineHeight: 1.55 });
  return onePage('Portfolio – Bìa tạp chí đỏ rượu', '1 màn hình: mảng đỏ rượu – kem – xanh lá, chữ khổng lồ, ảnh vòm, nhiều ảnh thời trang', 'Khánh Linh – Creative Worker', cream, [
    fill(at(0, 0, 580, SH), maroon),
    big(at(20, 10, 540, 150), 'PORTFOLIO', '#ffffff', f, 140, { textAlign: 'center' }),
    shape('arch', at(150, 170, 280, 480), { background: '#7a1f2b' }, { src: 'https://picsum.photos/id/823/800/1200', imgW: 800, imgH: 1200, alt: 'Ảnh chân dung' }),
    fill(at(36, 430, 150, 110), '#ffffff', { shadow: 'lg' }),
    pic(1027, at(42, 436, 138, 98)),
    tag(at(380, 170, 180, 30), 'KHÁNH LINH', '#ffffff', { fontFamily: 'oswald', fontSize: 22, letterSpacing: 3, textAlign: 'right' }),
    caps(at(36, 670, 320, 100), 'Người mẫu & nhà sáng tạo nội dung thời trang, chuyên lookbook và chiến dịch mạng xã hội.', '#fde2e4'),
    tag(at(380, 700, 180, 60), 'NHÀ SÁNG TẠO\nTHÁNG 8 / 2026', '#ffffff', { fontFamily: 'oswald', fontSize: 18, textAlign: 'right', lineHeight: 1.4 }),
    big(at(620, 30, 540, 100), "I'M KHÁNH LINH", green, f, 72),
    caps(at(620, 128, 540, 60), `${LOREM2}`, ink),
    big(at(620, 200, 260, 60), 'MY SKILLS', green, f, 40),
    ...[['CATWALK', 'Dáng đi chuẩn, tự tin'], ['TẠO DÁNG', 'Studio & ngoài trời'], ['BIỂU CẢM', 'Cảm xúc tinh tế']].flatMap(([t, d], k) => [
      tag(at(620, 262 + k * 42, 150, 18), t, ink, { fontSize: 12 }),
      caps(at(770, 262 + k * 42, 150, 36), d, ink),
    ]),
    big(at(940, 200, 220, 60), 'EDUCATION', maroon, f, 40, { textAlign: 'right' }),
    caps(at(940, 262, 220, 120), 'Đại học Mỹ thuật 2019 – 2023\nKhoá catwalk 2022\nWorkshop trang điểm 2023', ink),
    big(at(620, 400, 540, 70), 'LATEST PROJECT', maroon, f, 56),
    ...[[21, 'DỰ ÁN 01'], [838, 'DỰ ÁN 02'], [758, 'DỰ ÁN 03'], [836, 'DỰ ÁN 04']].flatMap(([id, t], k) => shot(id, at(620 + k * 138, 480, 126, 150), t, ink)),
    fill(at(580, 690, 620, 110), green),
    big(at(620, 702, 380, 80), "LET'S WORK TOGETHER", '#ffffff', f, 40, { lineHeight: 1.2 }),
    caps(at(960, 706, 210, 40), 'hello@khanhlinh.vn\n0901 234 567', '#e8f5ea'),
    ...contactIcons(960, 752, '#ffffff', 28, 10),
  ]);
}

// ---------------------------------------------------------------- 6: white & red ink (mau-portfolio-content-marketing)

function deckInk() {
  const red = '#e3262e';
  const ink = '#1c1917';
  const f = 'anton';
  const stain = (n, b, color = red, props = {}, style = {}) => doodle(`stain-${n}`, b, color, props, style);
  const rbullets = (b, items) => bullets(b, items, red, { fontSize: 13, lineHeight: 1.6 });
  return onePage('Portfolio – Mực đỏ', '1 màn hình: nền trắng, chữ đỏ khổng lồ, ảnh trên vết mực đỏ thật', 'Nguyễn Minh Trang – Content Writer', '#ffffff', [
    tag(at(40, 26, 200, 18), 'CREATIVE', red, { fontSize: 15, fontWeight: 800 }),
    tag(at(860, 26, 300, 18), 'CONTENT WRITER · 2026', red, { fontSize: 15, fontWeight: 800, textAlign: 'right' }),
    big(at(20, 44, 1160, 230), 'PORTFOLIO', red, f, 220, { textAlign: 'center', lineHeight: 1.05 }),
    stain(15, at(330, 250, 560, 378)),
    stain(2, at(300, 520, 60, 62)),
    shape('arch', at(470, 150, 260, 470), { background: '#e7e5e4' }, { src: 'https://picsum.photos/id/1027/800/1400', imgW: 800, imgH: 1400, alt: 'Ảnh chân dung' }),
    stain(0, at(640, 520, 130, 132), red, { blend: true }),
    big(at(40, 290, 400, 120), 'NGUYỄN\nMINH TRANG', red, 'montserrat', 40, { lineHeight: 1.3 }),
    para(at(40, 410, 400, 70), 'Content Writer 4 năm kinh nghiệm trong truyền thông số, cho các ngành F&B, giáo dục và làm đẹp.', red),
    rbullets(at(40, 486, 400, 80), ['Viết nội dung theo chiến lược', 'Tối ưu SEO – nghiên cứu từ khoá']),
    tag(at(800, 300, 360, 20), 'HỌC VẤN', red, { fontSize: 14, textAlign: 'right' }),
    para(at(800, 322, 360, 44), 'Học viện Báo chí & Tuyên truyền\nNgành Quan hệ công chúng (2016 – 2020)', ink, { fontSize: 13, textAlign: 'right' }),
    tag(at(800, 390, 360, 20), 'KINH NGHIỆM', red, { fontSize: 14, textAlign: 'right' }),
    para(at(800, 412, 360, 66), 'Content Executive – Agency XYZ (2021 – nay)\nFreelancer Content SEO (2020 – 2021)', ink, { fontSize: 13, textAlign: 'right' }),
    tag(at(800, 490, 360, 20), 'KỸ NĂNG', red, { fontSize: 14, textAlign: 'right' }),
    para(at(800, 512, 360, 44), 'Facebook, blog, landing page · SEO · Canva, Notion', ink, { fontSize: 13, textAlign: 'right' }),
    big(at(40, 610, 400, 60), 'PROJECT PORTFOLIO', red, f, 40),
    ...[[1060, 'CÀ PHÊ GIÓ · 30 BÀI + 5 VIDEO'], [0, 'LANDING PAGE IELTS · 7,8% CHUYỂN ĐỔI']].flatMap(([id, t], k) => [
      pic(id, at(40 + k * 220, 664, 200, 96)),
      tag(at(40 + k * 220, 766, 200, 18), t, red, { fontSize: 10 }),
    ]),
    stain(3, at(420, 700, 30, 48)),
    big(at(720, 640, 440, 90), 'CONTACT ME', red, f, 80, { textAlign: 'right' }),
    para(at(720, 730, 440, 24), 'trang@trangwrites.com · 0981 123 456 · @trangwritesdaily', ink, { fontSize: 13, textAlign: 'right' }),
    ...contactIcons(rightAligned(1160, 3, 28, 10), 762, red, 28, 10),
  ]);
}

// ---------------------------------------------------------------- 7: light / charcoal with bold colours (mau-portfolio-marketing)

function deckMy() {
  const dark = '#3b3b3b';
  const green = '#5a9a4e';
  const magenta = '#b0344d';
  const blue = '#6f93e8';
  const yellow = '#f5c542';
  const orange = '#f59a23';
  const f = 'anton';
  const globes = (x, y, color) => [0, 1].map((k) => icon('globe', at(x + k * 32, y, 32, 32), color, { background: 'transparent' }, 'iconPlain', { iconSize: 90, strokeWidth: 1.5 }));
  return onePage('Portfolio – Marketing sắc màu', '1 màn hình: nền sáng + mảng xám đậm, tiêu đề nhiều màu, icon quả địa cầu', 'Nguyễn Hà My – Creative Marketer', '#ecebe9', [
    fill(at(640, 0, 560, SH), dark),
    tag(at(40, 26, 260, 16), 'CREATIVE MARKETER', dark, { fontSize: 12 }),
    tag(at(380, 26, 220, 16), 'THÁNG 10 / 2025', dark, { fontSize: 12, textAlign: 'right' }),
    big(at(14, 80, 626, 170), 'PORTFOLIO', green, f, 146, { textAlign: 'center' }),
    pic(823, at(230, 40, 200, 560)),
    ...globes(40, 300, green),
    para(at(40, 350, 170, 110), '"Biến dữ liệu thành câu chuyện, câu chuyện thành doanh số."', dark, { fontSize: 13, italic: true }),
    tag(at(450, 300, 170, 40), 'NGUYỄN\nHÀ MY', dark, { fontSize: 16, textAlign: 'right', lineHeight: 1.3 }),
    big(at(40, 610, 300, 60), 'EDUCATION', magenta, f, 44),
    para(at(40, 672, 560, 90), 'Đại học Kinh tế Quốc dân – Marketing (2014 – 2018)\nDigital Marketing – Google · Data Driven Marketing – Coursera', dark, { fontSize: 13 }),
    tag(at(680, 36, 480, 26), 'ABOUT ME', '#ffffff', { fontSize: 20, fontWeight: 500 }),
    para(at(680, 70, 480, 90), 'Yêu storytelling và hành vi người tiêu dùng; lên chiến lược, quản lý team và làm nội dung bằng dữ liệu.', '#ffffff', { fontSize: 15 }),
    big(at(680, 170, 480, 60), 'PERSONAL SKILLS', green, f, 44),
    bullets(at(680, 232, 230, 90), ['Content strategy', 'Facebook & Google Ads', 'SEO, Email'], '#ffffff'),
    bullets(at(920, 232, 240, 90), ['Google Analytics', 'Canva, Figma', 'Quản lý dự án'], '#ffffff'),
    big(at(680, 330, 480, 60), 'WORK EXPERIENCE', blue, f, 44),
    para(at(680, 392, 480, 60), 'Marketing Executive – Công ty ABC (2020 – nay): 12+ chiến dịch, doanh số +45%.', '#ffffff', { fontSize: 13 }),
    big(at(680, 460, 480, 60), 'BEST PROJECT', orange, f, 44),
    pic(21, at(680, 524, 230, 130), { radius: 10 }),
    pic(838, at(930, 524, 230, 130), { radius: 10 }),
    big(at(680, 668, 300, 70), 'CONTACT ME', yellow, f, 52),
    ...contactIcons(680, 744, '#ffffff'),
    para(at(960, 680, 200, 90), 'hamy.mkt@gmail.com\n0987 654 321\n@hanguyenhamy', '#ffffff', { fontSize: 13, textAlign: 'right' }),
  ]);
}

// ---------------------------------------------------------------- 8: mint & deep teal (mau-portfolio-social-media)

function deckTeal() {
  const blob = '#dcefec';
  const teal = '#0f5a57';
  const f = 'anton';
  return onePage('Portfolio – Xanh ngọc mạng xã hội', '1 màn hình: nền bạc hà có mảng cong, chữ xanh ngọc đậm khổng lồ', 'Nguyễn Thảo Linh – Social Media Executive', '#eef6f5', [
    shape('blob', at(-140, 420, 560, 480), { background: blob }, { seed: 11 }),
    shape('blob', at(860, -140, 520, 460), { background: blob }, { seed: 31 }),
    tag(at(40, 40, 200, 18), 'CREATIVE', teal, { fontSize: 14, fontWeight: 800 }),
    tag(at(860, 40, 300, 18), 'NGUYỄN THẢO LINH', teal, { fontSize: 14, fontWeight: 800, textAlign: 'right' }),
    big(at(20, 60, 1160, 250), 'PORTFOLIO', teal, f, 240, { textAlign: 'center' }),
    pic(1011, at(470, 40, 250, 480)),
    para(at(40, 330, 380, 34), 'Social Media Executive', teal, { fontSize: 22 }),
    para(at(40, 370, 380, 90), 'Xin chào, mình là Thảo Linh – 3 năm quản lý fanpage, sáng tạo nội dung và phát triển cộng đồng trên nền tảng số.', teal),
    para(at(780, 330, 380, 90), '"Xây dựng thương hiệu mạnh mẽ bằng từng chiến dịch nội dung sáng tạo và chỉ số đo lường cụ thể."', teal, { fontSize: 15, italic: true, textAlign: 'right' }),
    big(at(40, 470, 380, 56), 'EDUCATION', teal, f, 40),
    bullets(at(40, 526, 400, 70), ['ĐH Thương mại – Marketing (2016 – 2020)', 'Facebook Ads Manager (Meta Blueprint)'], teal),
    big(at(780, 430, 380, 56), 'PERSONAL SKILLS', teal, f, 40, { textAlign: 'right' }),
    bullets(at(820, 486, 340, 110), ['Facebook, Instagram, TikTok', 'Content planning & Ads', 'Canva, CapCut, Premiere', 'Meta Insights, GA'], teal),
    big(at(40, 610, 380, 56), 'BEST PROJECT', teal, f, 40),
    pic(1059, at(40, 670, 170, 100)),
    pic(669, at(222, 670, 170, 100)),
    pic(22, at(404, 670, 170, 100)),
    big(at(700, 610, 460, 90), 'CONTACT ME', teal, f, 80, { textAlign: 'right' }),
    para(at(700, 700, 460, 50), 'thaolinh.socialmedia@gmail.com\n0987 456 123 · @thaolinh.content', teal, { fontSize: 14, textAlign: 'right' }),
    ...contactIcons(rightAligned(1160, 3, 30, 10), 758, teal, 30, 10),
  ]);
}

// ---------------------------------------------------------------- 9: grey & orange graphic designer (mau-thiet-ke-do-hoa)

function deckAdora() {
  const orange = '#ef5a2a';
  const ink = '#111111';
  const f = 'montserrat';
  return onePage('Portfolio – Thiết kế đồ hoạ cam xám', '1 màn hình: xám – cam, chữ đen đậm, tia bắn làm nền ảnh, dòng thời gian, dự án', 'Đỗ Minh Anh – Graphic Designer', '#d6d6d6', [
    fill(at(760, 0, 440, SH), orange),
    big(at(700, -30, 560, 180), 'CREATIVE', '#f4876a', 'anton', 170),
    doodle('ink', at(760, 140, 440, 440), '#ffffff', { inkStyle: 'splash', seed: 13 }),
    pic(832, at(820, 170, 320, 480), { gray: true }),
    doodle('sparkle', at(40, 36, 36, 36), ink, { seed: 3 }),
    tag(at(90, 44, 400, 18), 'ĐỖ MINH ANH · GRAPHIC DESIGNER', ink, { fontSize: 12, fontWeight: 500, letterSpacing: 2 }),
    big(at(40, 80, 200, 90), 'HI!', ink, f, 80),
    big(at(40, 170, 700, 160), 'CREATIVE\nPORTFOLIO', ink, f, 66, { lineHeight: 1.1 }),
    para(at(40, 340, 420, 90), 'Mình biến ý tưởng thành hình ảnh ấn tượng: kết hợp tinh thần mỹ thuật và kỹ thuật số, gọn gàng và có cá tính.', ink),
    doodle('ink', at(470, 320, 140, 120), orange, { inkStyle: 'splash', seed: 21 }),
    big(at(490, 350, 200, 50), 'SKILLS', ink, f, 30),
    bullets(at(470, 420, 280, 110), ['Illustrator, Photoshop, Figma', 'Branding & layout', 'Typography & màu sắc', 'Animation 2D'], ink),
    line(at(40, 520, 420, 4), ink, 1.5),
    ...[['2021', 'Studio Showe', 'Art Director'], ['2020', 'Salford & Co.', 'Lead Designer'], ['2018', 'Larana Inc.', 'Designer']].flatMap(([y, co, role], k) => [
      tag(at(40 + k * 140, 494, 120, 16), y, ink, { fontSize: 11, fontWeight: 500 }),
      icon('star', at(40 + k * 140, 514, 14, 14), ink, { background: 'transparent' }, 'iconPlain', { iconSize: 100 }),
      tag(at(40 + k * 140, 536, 130, 18), co.toUpperCase(), ink, { fontSize: 11 }),
      para(at(40 + k * 140, 554, 130, 20), role, ink, { fontSize: 12 }),
    ]),
    tag(at(40, 596, 300, 18), 'PROJECTS AND CASES', ink, { fontSize: 12 }),
    ...[[1060, 'RIMBERIO CAFE'], [180, 'FITNESS WEBSITE'], [526, 'BRAND IDENTITY']].flatMap(([id, t], k) => shot(id, at(40 + k * 235, 620, 220, 130), t, ink)),
    tag(at(780, 690, 400, 18), "LET'S CREATE SOMETHING GREAT", ink, { fontSize: 13, textAlign: 'right' }),
    para(at(780, 712, 400, 24), 'hello@minhanh.design · 0901 234 567', ink, { fontSize: 13, textAlign: 'right' }),
    ...contactIcons(rightAligned(1180, 3, 30, 10), 744, ink, 30, 10),
  ]);
}

// ---------------------------------------------------------------- 10: spinning record (music artist)

/** Gives an element a looping motion (see motion.js). */
const moving = (el, kind, duration, delay = 0, reverse = false) => ({ ...el, motion: { kind, duration, delay, reverse } });

function musicDisc() {
  const bg = '#0c0a1d';
  const pink = '#f472b6';
  const violet = '#a78bfa';
  const soft = '#c4b5fd';
  const grad = `linear-gradient(135deg, ${pink} 0%, ${violet} 100%)`;
  const f = 'anton';
  // The record: centre, diameter, one turn every SPIN seconds.
  const cx = 820;
  const cy = 390;
  const D = 420;
  const SPIN = 8;
  const round = (d, style) => box(at(cx - d / 2, cy - d / 2, d, d), { radius: 999, ...style });
  // Vinyl grooves: rings of slightly lighter black, out from the label.
  const grooves = [];
  for (let p = 34; p <= 70; p += 3) grooves.push(`#141218 ${p}%`, `#26232e ${p + 1}%`, `#141218 ${p + 2}%`);
  const vinyl = `radial-gradient(circle, #141218 0%, ${grooves.join(', ')}, #141218 71%)`;

  return onePage('Âm nhạc – Đĩa than xoay', '1 màn hình: đĩa than có avatar xoay tròn, sóng nhạc (thành phần Âm thanh) nhảy quanh đĩa và sóng âm toả ra', 'Minh Khang – Ca sĩ & Producer', bg, [
    // Glow behind the record and sound rings spreading out from it.
    round(640, { background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(12, 10, 29, 0) 70%)' }),
    ...[0, 1, 2].map((k) => moving(round(D + 20, { borderWidth: 3, borderColor: k === 1 ? violet : pink, background: 'rgba(244, 114, 182, 0.06)' }), 'ripple', 3, k)),
    // The record and its label spin; the avatar sits on the label.
    moving(round(D, { background: vinyl, shadow: 'lg' }), 'spin', SPIN),
    moving(round(190, { background: grad }), 'spin', SPIN),
    moving(shape('circle', at(cx - 80, cy - 80, 160, 160), { background: '#1f1b2e' }, { src: 'https://picsum.photos/id/64/600/600', imgW: 600, imgH: 600, alt: 'Ảnh đại diện' }), 'spin', SPIN),
    // Light on the vinyl stays put while it turns.
    round(D, { background: 'linear-gradient(135deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.12) 48%, rgba(255, 255, 255, 0) 62%)' }),
    // The music: an audio element whose round visualizer hugs the record. It dances to a steady beat
    // until the user uploads their song; then its play button sits on the avatar.
    createFromKey('audio:circle', {
      ...at(cx - 340, cy - 340, 680, 680),
      props: { color: pink, color2: violet, bars: 72, inner: 33, always: true, loop: true, autoplay: false, name: '' },
    }),
    // Tone arm resting on the edge of the record.
    box(at(1068, 118, 56, 56), { radius: 999, background: 'linear-gradient(135deg, #e5e7eb 0%, #6b7280 100%)', shadow: 'md' }),
    { ...box(at(1014, 170, 10, 250), { radius: 5, background: 'linear-gradient(90deg, #d1d5db 0%, #9ca3af 100%)' }), rotation: 24 },
    { ...box(at(950, 394, 28, 44), { radius: 6, background: '#d1d5db', shadow: 'md' }), rotation: 24 },
    // Now playing, under the record.
    icon('music', at(cx - 118, 742, 22, 22), pink, { background: 'transparent' }, 'iconPlain', { iconSize: 100 }),
    tag(at(cx - 90, 744, 300, 20), 'ĐANG PHÁT · "ĐÊM THÀNH PHỐ"', soft, { fontSize: 13, letterSpacing: 2 }),
    box(at(cx - 118, 776, 236, 4), { radius: 2, background: '#2e2a45' }),
    box(at(cx - 118, 776, 96, 4), { radius: 2, background: grad }),

    // Artist, on the left.
    moving(icon('music', at(70, 70, 40, 40), '#ffffff', { background: grad, radius: 999 }, 'iconPlain', { iconSize: 55 }), 'pulse', 1.2),
    tag(at(124, 80, 300, 20), 'NOW PLAYING', pink, { fontSize: 14, letterSpacing: 4 }),
    big(at(70, 140, 520, 220), 'MINH\nKHANG','#ffffff', f, 110, { lineHeight: 1 }),
    para(at(70, 370, 480, 34), 'Ca sĩ · Nhạc sĩ · Producer', soft, { fontSize: 22 }),
    para(at(70, 414, 440, 76), 'Mình viết những bản nhạc về thành phố về đêm, những chuyến xe muộn và các cuộc trò chuyện chưa kịp nói hết.', '#a5a1c2', { fontSize: 15 }),
    ...[['12', 'bài hát'], ['2', 'album'], ['1,2 triệu', 'lượt nghe']].flatMap(([n, cap], k) => [
      big(at(70 + k * 150, 510, 140, 44), n, '#ffffff', f, 34),
      tag(at(70 + k * 150, 556, 140, 18), cap.toUpperCase(), '#8b86ad', { fontSize: 11, letterSpacing: 2 }),
    ]),
    button('gradient', at(70, 610, 180, 52), 'Nghe nhạc', { background: grad, fontSize: 15 }, { href: 'https://www.youtube.com/', newTab: true }),
    button('outline', at(266, 610, 210, 52), 'Mời biểu diễn', { radius: 999, color: '#e9d5ff', borderColor: '#e9d5ff', fontSize: 15 }, { href: 'mailto:booking@minhkhang.vn' }),
    para(at(70, 694, 440, 22), 'booking@minhkhang.vn · 0901 234 567', '#8b86ad', { fontSize: 13 }),
    ...socials(70, 728, '#e9d5ff', 34, 12, ['facebook', 'zaloApp', 'threads', 'tiktok']),
  ]);
}

// ---------------------------------------------------------------- 11: meme / early-2000s homepage (ugly on purpose)

/** Left edge that centres `count` items of `size` with `gap` inside a column from `x`, `width` wide. */
const centredIn = (x, width, count, size, gap) => Math.round(x + (width - (count * size + (count - 1) * gap)) / 2);

function memeHome() {
  const yellow = '#fff200';
  const red = '#ff1f1f';
  const blue = '#1e3cff';
  const lime = '#39ff14';
  const magenta = '#ff00e6';
  const ink = '#111111';
  const comic = 'pangolin'; // the Comic Sans of this template
  // No yellow in it: it would vanish into the page.
  const rainbow = 'linear-gradient(90deg, #ff1f1f 0%, #ff00e6 30%, #1e3cff 60%, #00a650 100%)';
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  const say = (b, t, color, extra = {}) => text('paragraph', b, t, { color, fontFamily: comic, fontSize: 18, lineHeight: 1.35, ...extra });
  const sticker = (b, t, bg, color, deg, motionKind, dur) =>
    moving(tilt(button('primary', b, t, { background: bg, color, fontFamily: 'bangers', fontSize: 26, radius: 999, borderWidth: 3, borderColor: ink, shadow: 'none', letterSpacing: 1 }), deg), motionKind, dur);
  const winButton = (b, t) =>
    button('primary', b, t, { background: '#c0c0c0', color: ink, fontFamily: 'roboto', fontSize: 14, radius: 0, borderWidth: 2, borderColor: '#404040', shadow: 'none' }, { href: 'https://zalo.me/0901234567', newTab: true });

  return onePage('Meme – Trang chủ cợt nhả', '1 màn hình: phong cách web năm 2005, cố tình xấu – chữ WordArt cầu vồng, ảnh meme, hộp thoại lỗi, bộ đếm lượt xem', 'Tuấn Đẹp Trai – Trang chủ chính thức', yellow, [
    // A blinking banner, like it's 2005.
    fill(at(0, 0, W, 44), red),
    moving(say(at(0, 8, W, 30), '⚠️ TRANG WEB ĐANG XÂY DỰNG TỪ NĂM 2019 – VUI LÒNG QUAY LẠI SAU (HOẶC ĐỪNG) ⚠️', yellow, { fontSize: 20, fontWeight: 700, textAlign: 'center' }), 'blink', 1.2),

    // WordArt title.
    tilt(say(at(40, 58, 520, 34), 'Xin chào, tôi là', blue, { fontSize: 28, fontWeight: 700 }), -3),
    moving(tilt(text('title', at(36, 104, 340, 176),'TUẤN\nĐẸP TRAI', { color: rainbow, fontFamily: 'bangers', fontSize: 92, lineHeight: 0.95, letterSpacing: 3 }), -5), 'swing', 3),
    tilt(say(at(370, 214, 220, 30), '(đẹp trai là tên thật)', ink, { fontSize: 15, italic: true }), 6),
    say(at(40, 298, 560, 56), 'Lập trình viên kiêm chuyên gia tắt cam khi họp. Code chạy được nhưng đừng hỏi tại sao.', ink, { fontSize: 19 }),

    // Meme: caption bar + pug.
    tilt(box(at(690, 70, 440, 420), { background: '#ffffff', radius: 0, borderWidth: 4, borderColor: ink, shadow: 'lg' }), 2),
    tilt(text('paragraph', at(706, 84, 408, 84), 'Khi sếp bảo "sửa nhẹ thôi em, 5 phút là xong":', { color: ink, fontFamily: 'roboto', fontSize: 22, fontWeight: 700, lineHeight: 1.3 }), 2),
    tilt(pic(1025, at(714, 172, 392, 300)), 2),
    tilt(text('title', at(714, 408, 392, 60), 'OK SẾP 🙂', { color: '#ffffff', fontFamily: 'anton', fontSize: 44, textAlign: 'center', letterSpacing: 2 }), 2),

    // Stickers.
    sticker(at(1040, 36, 140, 64), 'HOT!!! 🔥', red, yellow, 12, 'pulse', 0.8),
    sticker(at(610, 470, 150, 60), 'MỚI 100%', lime, ink, -10, 'heartbeat', 1.2),
    moving(say(at(560, 90, 80, 80), '😂', ink, { fontSize: 64, textAlign: 'center' }), 'spin', 3),
    moving(say(at(1110, 470, 70, 70), '💯', ink, { fontSize: 52, textAlign: 'center' }), 'bounce', 1.3),
    moving(doodle('sparkle', at(640, 250, 50, 50), magenta, { seed: 5 }), 'spin', 4),

    // Skills nobody asked for.
    tilt(text('title', at(40, 356, 400, 44), 'KỸ NĂNG ĐẶC BIỆT:', { color: magenta, fontFamily: 'bangers', fontSize: 38, letterSpacing: 2 }), -2),
    ...[
      ['Ngủ nướng', 100, red],
      ['Làm deadline lúc 3h sáng', 99, blue],
      ['Họp mà tắt cam', 100, '#22c55e'],
      ['Hiểu code mình viết tuần trước', 7, '#ff9900'],
    ].flatMap(([name, pct, color], k) => {
      const y = 410 + k * 50;
      return [
        say(at(40, y, 300, 24), name, ink, { fontSize: 17, fontWeight: 700 }),
        box(at(40, y + 26, 340, 16), { background: '#ffffff', radius: 0, borderWidth: 2, borderColor: ink }),
        box(at(42, y + 28, Math.max(8, Math.round(3.36 * pct)), 12), { background: color, radius: 0 }),
        say(at(390, y + 18, 80, 28), `${pct}%`, color, { fontSize: 20, fontWeight: 700 }),
      ];
    }),

    // Fake Windows 98 error.
    box(at(490, 560, 360, 176), { background: '#c0c0c0', radius: 0, borderWidth: 3, borderColor: '#ffffff', shadow: 'md' }),
    box(at(494, 564, 352, 30), { background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)', radius: 0 }),
    text('paragraph', at(504, 568, 280, 24), 'Loi.exe', { color: '#ffffff', fontFamily: 'roboto', fontSize: 15, fontWeight: 700 }),
    box(at(818, 568, 22, 20), { background: '#c0c0c0', radius: 0, borderWidth: 2, borderColor: '#ffffff' }),
    text('paragraph', at(818, 566, 22, 22), '×', { color: ink, fontFamily: 'roboto', fontSize: 16, fontWeight: 700, textAlign: 'center' }),
    say(at(510, 604, 60, 50), '⛔', ink, { fontSize: 34 }),
    text('paragraph', at(566, 606, 270, 64), 'Tuấn đã ngừng hoạt động.\nLý do: đói. Vui lòng gửi trà sữa.', { color: ink, fontFamily: 'roboto', fontSize: 15, lineHeight: 1.45 }),
    winButton(at(600, 684, 96, 34), 'OK'),
    winButton(at(708, 684, 120, 34), 'Cũng OK'),

    // Clickbait button + arrow + begging.
    moving(
      button('primary', at(40, 624, 380, 64), 'BẤM VÀO ĐÂY ĐỂ NHẬN IPHONE 📱', { background: 'linear-gradient(90deg, #39ff14 0%, #ff00e6 100%)', color: ink, fontFamily: 'bangers', fontSize: 26, radius: 6, borderWidth: 4, borderStyle: 'dashed', borderColor: red, shadow: 'none', letterSpacing: 1 }, { href: 'https://www.facebook.com/tentaikhoan', newTab: true }),
      'shake',
      0.6,
    ),
    say(at(40, 694, 380, 26), '(không có iPhone đâu, nhưng có tôi 👉👈)', blue, { fontSize: 15 }),
    doodle('arrow', at(420, 610, 70, 60), red, { strokeWidth: 4, seed: 9 }),

    // Visitor counter and contact.
    box(at(880, 540, 290, 90), { background: ink, radius: 0, borderWidth: 3, borderColor: lime }),
    text('paragraph', at(890, 548, 270, 22), 'BẠN LÀ NGƯỜI THỨ', { color: lime, fontFamily: 'vt323', fontSize: 20, textAlign: 'center' }),
    moving(text('title', at(890, 570, 270, 50), '000069', { color: lime, fontFamily: 'vt323', fontSize: 48, textAlign: 'center', letterSpacing: 6 }), 'blink', 2),
    say(at(880, 642, 290, 24), 'Liên hệ (tôi rep chậm nha):', ink, { fontSize: 16, fontWeight: 700, textAlign: 'center' }),
    ...socials(centredIn(880, 290, 4, 38, 12), 676, ink, 38, 12, ['facebook', 'zaloApp', 'threads', 'tiktok']),
    say(at(880, 724, 290, 60), 'Website tối ưu cho Internet Explorer 6, độ phân giải 800×600', '#6b6b00', { fontSize: 12, textAlign: 'center' }),
  ]);
}

// ---------------------------------------------------------------- 12: a cat's profile (one screen)

/** An Unsplash photo cropped to w × h (placeholders the user swaps for their own pet). */
const unsplash = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

function catProfile() {
  const cream = '#fff6ea';
  const peach = '#ffd9b8';
  const orange = '#f0802f';
  const brown = '#4a3222';
  const soft = '#8a6a55';
  const pink = '#f6a5b5';
  const hand = 'mali'; // round, handwritten-looking
  const round = 'baloo';
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  const note = (b, t, color, extra = {}) => text('paragraph', b, t, { color, fontFamily: hand, fontSize: 16, lineHeight: 1.55, ...extra });
  const card = (b, extra = {}) => box(b, { background: '#ffffff', radius: 22, shadow: 'md', ...extra });
  /** A polaroid: white frame, photo, handwritten caption, all at the same slant. */
  const polaroid = (x, y, id, caption, deg) => [
    tilt(card(at(x, y, 170, 168), { radius: 6 }), deg),
    tilt(createElement('image', { ...at(x + 10, y + 10, 150, 118), props: { src: unsplash(id, 300, 236), alt: 'Ảnh mèo', fit: 'cover' }, style: { radius: 2 } }), deg),
    tilt(note(at(x + 6, y + 132, 158, 28), caption, brown, { fontSize: 15, textAlign: 'center' }), deg),
  ];
  const paw = (b, deg, delay) => moving(tilt(text('paragraph', b, '🐾', { fontSize: Math.round(b.w * 0.8), textAlign: 'center', lineHeight: 1 }), deg), 'float', 3, delay);

  return onePage('Thú cưng – Hồ sơ Boss mèo', '1 màn hình: trang riêng cho bé mèo – ảnh vòm, thẻ thông tin, thích / ghét, ảnh polaroid, số của sen khi bé đi lạc', 'Mít – Hồ sơ Boss mèo', cream, [
    // Right: the star of the page.
    shape('blob', at(640, 30, 540, 540), { background: peach }, { seed: 7 }),
    shape('arch', at(700, 70, 400, 470), { background: '#f3e3d3' }, { src: unsplash('1518791841217-8f162f1e1131', 800, 1000), imgW: 800, imgH: 1000, alt: 'Ảnh của Mít' }),
    moving(tilt(button('primary', at(640, 96, 150, 54), 'Meo~ 😽', { background: '#ffffff', color: brown, fontFamily: hand, fontSize: 20, fontWeight: 700, radius: 999, shadow: 'md' }), -8), 'float', 2.6),
    moving(icon('heart', at(1090, 70, 54, 54), '#ffffff', { background: pink, radius: 999 }, 'iconPlain', { iconSize: 55 }), 'heartbeat', 1.4),
    paw(at(1110, 440, 46, 46), 20, 0),
    paw(at(596, 470, 38, 38), -15, 1),
    paw(at(560, 40, 34, 34), 10, 0.5),

    // Polaroids.
    ...polaroid(640, 590, '1495360010541-f48722b34f7d', 'Ngồi canh cầu thang', -6),
    ...polaroid(820, 606, '1574158622682-e40e69881006', 'Nhìn gì đấy sen?', 3),
    ...polaroid(1000, 588, '1518791841217-8f162f1e1131', 'Ngủ ca 3 trong ngày', -3),

    // Left: who.
    tag(at(48, 42, 400, 20), 'HỒ SƠ BOSS MÈO', orange, { fontSize: 13, letterSpacing: 4 }),
    note(at(48, 74, 400, 34), 'Xin chào, tui là', soft, { fontSize: 24 }),
    tilt(text('title', at(40, 100, 420, 140), 'MÍT', { color: orange, fontFamily: round, fontSize: 132, fontWeight: 800, lineHeight: 1, letterSpacing: 2 }), -3),
    note(at(48, 242, 520, 80), 'Boss mèo mướp 3 tuổi, chuyên gia ngủ trưa và phá hộp giấy. Sen của tui dựng trang này để khoe tui với cả thế giới.', brown, { fontSize: 17 }),

    // Profile card.
    card(at(40, 334, 540, 176)),
    text('subheading', at(66, 352, 300, 30), 'Thông tin cơ bản', { color: brown, fontFamily: round, fontSize: 20, fontWeight: 700 }),
    note(at(66, 390, 250, 110), '🎂  Sinh nhật: 12/05/2023\n⚖️  Cân nặng: 4,2 kg\n🐱  Giống: Mèo mướp', brown, { fontSize: 15, lineHeight: 1.75 }),
    note(at(320, 390, 250, 110), '💉  Tiêm phòng: Đủ\n🏠  Ở: Hà Nội\n😴  Ngủ: ~16 tiếng/ngày', brown, { fontSize: 15, lineHeight: 1.75 }),

    // Likes and dislikes.
    card(at(40, 528, 262, 176), { background: '#fff0e0' }),
    text('subheading', at(62, 544, 220, 30), '💛 Tui thích', { color: orange, fontFamily: round, fontSize: 19, fontWeight: 700 }),
    note(at(62, 580, 230, 116), '• Pate cá ngừ\n• Hộp giấy (mọi cỡ)\n• Nắng buổi sáng\n• Được gãi cằm', brown, { fontSize: 15, lineHeight: 1.65 }),
    card(at(318, 528, 262, 176), { background: '#fde8ec' }),
    text('subheading', at(340, 544, 220, 30), '💢 Tui ghét', { color: '#d9536f', fontFamily: round, fontSize: 19, fontWeight: 700 }),
    note(at(340, 580, 230, 116), '• Bị tắm\n• Máy hút bụi\n• Bát cơm lưng lưng\n• Bị gọi dậy', brown, { fontSize: 15, lineHeight: 1.65 }),

    // If found.
    note(at(48, 722, 340, 26), 'Thấy tui đi lạc? Gọi sen giúp nha:', soft, { fontSize: 15 }),
    text('subheading', at(48, 746, 300, 34), '📞 0901 234 567', { color: brown, fontFamily: round, fontSize: 22, fontWeight: 700 }),
    ...contactIcons(rightAligned(580, 3, 34, 10), 740, brown, 34, 10),
  ]);
}

// ---------------------------------------------------------------- 13: "everything's fine 👍" meme (manga halftone)

function okMeme() {
  const mint = '#9fbeb6';
  const pink = '#f4b9c8';
  const blush = '#e8859f';
  const ink = '#161b1b';
  const hand = 'mali';
  const comic = 'bangers';
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  const panel = (b, background, extra = {}) => box(b, { background, radius: 0, borderWidth: 4, borderColor: ink, ...extra });
  // Manga rain / speed lines: thin dark strokes at a steep slant, lengths and weights varied (seeded, so stable).
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const streaks = Array.from({ length: 46 }, () => {
    const h = Math.round(120 + rand() * 320);
    const w = rand() < 0.25 ? 5 : rand() < 0.6 ? 3 : 2;
    return tilt(box(at(Math.round(rand() * 1240 - 40), Math.round(rand() * 900 - 160), w, h), { background: ink, radius: 0, opacity: Math.round((0.25 + rand() * 0.45) * 100) / 100 }), 18);
  });
  const status = (k, icon, what, verdict) => {
    const y = 438 + k * 62;
    const deg = k % 2 ? 1 : -1;
    return [
      tilt(panel(at(40, y, 560, 52), '#ffffff', { borderWidth: 3 }), deg),
      tilt(text('paragraph', at(58, y + 12, 400, 30), `${icon}  ${what}`, { color: ink, fontFamily: hand, fontSize: 17, fontWeight: 700 }), deg),
      tilt(button('primary', at(470, y + 9, 116, 34), verdict, { background: pink, color: ink, fontFamily: comic, fontSize: 20, radius: 999, borderWidth: 3, borderColor: ink, shadow: 'none', letterSpacing: 1 }), deg),
    ];
  };

  return onePage('Meme – Mọi thứ đều ổn 👍', '1 màn hình: phong cách truyện tranh – chấm lưới, vệt mưa, thỏ hồng giơ ngón cái; thả ảnh meme của bạn vào khung hồng', 'Mọi thứ đều ổn 👍', mint, [
    // Halftone and rain behind everything.
    doodle('dots', at(640, 0, 560, 800), ink, { spacing: 11, dotSize: 1.6 }, { opacity: 0.45 }),
    doodle('dots', at(0, 600, 620, 200), ink, { spacing: 11, dotSize: 1.6 }, { opacity: 0.3 }),
    ...streaks,

    // The meme spot: a pink blob with a thick outline and a big thumbs up (drop the meme picture onto the shape).
    shape('blob', at(660, 90, 500, 560), { background: pink }, { seed: 23, rim: 7, rimColor: ink }),
    doodle('dots', at(700, 380, 180, 200), ink, { spacing: 8, dotSize: 1.4 }, { opacity: 0.35 }),
    moving(tilt(text('title', at(760, 200, 300, 300), '👍', { fontSize: 220, textAlign: 'center', lineHeight: 1 }), -8), 'bounce', 1.8),
    tilt(box(at(780, 470, 60, 18), { background: blush, radius: 999, opacity: 0.8 }), -8),
    tilt(box(at(990, 470, 60, 18), { background: blush, radius: 999, opacity: 0.8 }), -8),
    tilt(panel(at(900, 60, 250, 64), '#ffffff', { radius: 999, borderWidth: 4 }), 6),
    tilt(text('title', at(906, 72, 238, 42), 'ỔN MÀ 👍', { color: ink, fontFamily: comic, fontSize: 34, textAlign: 'center', letterSpacing: 2 }), 6),

    // Comic title panel.
    tilt(panel(at(40, 60, 560, 236), pink, { borderWidth: 5, shadow: 'lg' }), -2),
    tilt(text('label', at(62, 76, 300, 22), 'TRẠM ỔN ÁP · EST. 2026', { color: ink, fontSize: 13, letterSpacing: 3 }), -2),
    tilt(text('title', at(56, 100, 540, 190), 'MỌI THỨ\nĐỀU ỔN 👍', { color: ink, fontFamily: comic, fontSize: 90, lineHeight: 0.98, letterSpacing: 3 }), -2),

    // Speech bubble.
    tilt(panel(at(60, 318, 520, 92), '#ffffff', { radius: 28 }), 1),
    tilt(text('paragraph', at(84, 332, 480, 66), 'Deadline dí? Ổn. Lương chưa về? Ổn.\nCrush xem mà không rep? …Cũng ổn.', { color: ink, fontFamily: hand, fontSize: 18, lineHeight: 1.5 }), 1),

    // Today's status.
    ...status(0, '⏰', 'Deadline: dí sát gáy', 'ỔN 👍'),
    ...status(1, '💸', 'Ví tiền: 12.000đ', 'ỔN 👍'),
    ...status(2, '😴', 'Ngủ: 4 tiếng', 'ỔN 👍'),
    ...status(3, '📱', 'Crush: đã xem', '…ỔN 👍'),

    // Bottom.
    moving(button('primary', at(40, 700, 300, 60), 'BẤM ĐỂ ĐƯỢC KHEN 👍', { background: ink, color: pink, fontFamily: comic, fontSize: 26, radius: 999, shadow: 'none', letterSpacing: 1 }, { href: 'https://www.facebook.com/tentaikhoan', newTab: true }), 'pulse', 1.4),
    ...contactIcons(362, 712, ink, 36, 12),
    tilt(panel(at(700, 686, 440, 64), '#ffffff', { borderWidth: 4 }), -1),
    tilt(text('paragraph', at(716, 700, 410, 40), 'Kun Kun · chuyên gia giả vờ ổn', { color: ink, fontFamily: comic, fontSize: 28, textAlign: 'center', letterSpacing: 1 }), -1),
  ]);
}

const TEMPLATES = {
  'sample-ok-meme': okMeme,
  'sample-cat-profile': catProfile,
  'sample-meme-home': memeHome,
  'sample-music-disc': musicDisc,
  'sample-deck-doodle': deckDoodle,
  'sample-deck-blush': deckBlush,
  'sample-deck-noir': deckNoir,
  'sample-deck-avery': deckAvery,
  'sample-portfolio-maroon': deckCahaya,
  'sample-portfolio-inkred': deckInk,
  'sample-deck-my': deckMy,
  'sample-deck-teal': deckTeal,
  'sample-deck-adora': deckAdora,
  'sample-portfolio-pastel': pastel,
  'sample-portfolio-designer': designer,
  'sample-portfolio-developer': developer,
  'sample-portfolio-photo': photographer,
  'sample-portfolio-creator': creator,
};
/** Earlier samples replaced by the ones above; removed when seeding. */
const RETIRED = ['sample-portfolio-minimal', 'sample-link-in-bio'];

const args = process.argv.slice(2);
const previewDir = args.includes('--preview') ? args[args.indexOf('--preview') + 1] : null;

// Built once and passed through normalizeDoc, exactly as the app will read them.
const built = Object.entries(TEMPLATES).map(([id, make]) => {
  const { name, description, page, elements } = make();
  return { id, name, description, ...normalizeDoc({ page, elements }) };
});

if (previewDir) {
  fs.mkdirSync(previewDir, { recursive: true });
  for (const t of built) fs.writeFileSync(path.join(previewDir, `${t.id}.html`), exportHtml(t));
  // The same data as JSON, for trying the templates in the editor without Firestore.
  fs.writeFileSync(path.join(previewDir, 'templates.json'), JSON.stringify(built));
  console.log(`Wrote ${built.length} previews to ${previewDir}:`, built.map((t) => `${t.id} ${t.page.height}px`).join(', '));
  process.exit(0);
}

const { FieldValue } = await import('firebase-admin/firestore');
const { db } = await import('../src/config/firebase.js');
for (const id of RETIRED) {
  await db.doc(`templates/${id}`).delete();
  console.log(`templates/${id} removed (retired sample)`);
}
for (const [i, t] of built.entries()) {
  await db.doc(`templates/${t.id}`).set({
    name: t.name,
    description: t.description,
    page: t.page,
    elements: t.elements,
    sourceUid: null,
    sourceDesignId: null,
    createdBy: 'seed-sample-templates',
    // Spaced a second apart so they list in this order (newest first) on the home screen.
    createdAt: new Date(Date.now() - i * 1000),
    updatedAt: FieldValue.serverTimestamp(),
    // Merged, so what admins set on the template (e.g. hiding it) survives a re-seed.
  }, { merge: true });
  console.log(`templates/${t.id} ← ${t.name} (${t.elements.length} phần tử, cao ${t.page.height}px)`);
}
process.exit(0);
