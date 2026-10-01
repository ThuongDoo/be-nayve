import { W, X, CW, at, text, button, box, line, image, photoShape, socials, centred, sectionHead, col3 } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 2;

// ---------------------------------------------------------------- 3. Photographer

export default function photographer() {
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
