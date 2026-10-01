import { W, X, CW, at, text, button, icon, box, shape, image, socials, centred, sectionHead, col3, createElement } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 5;

// ---------------------------------------------------------------- 5. Pastel poster (graphic designer)

/**
 * The hero is a pastel poster: "PORT FOLIO" over a peach → pink wash, a white photo frame edged by a
 * pink bar and a pink → cyan bar, a see-through pink card with the name over the photo's corner, and
 * two columns of dots. The rest of the page follows the same palette.
 */
export default function pastel() {
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
