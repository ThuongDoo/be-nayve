import { W, X, CW, at, text, button, icon, box, shape, image, photoShape, socials, centred, sectionHead, col3 } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 1;

// ---------------------------------------------------------------- 4. Content creator / writer

export default function creator() {
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
