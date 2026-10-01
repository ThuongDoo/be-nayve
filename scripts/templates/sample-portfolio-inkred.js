import { at, shape, contactIcons, rightAligned, pic, big, para, tag, bullets, doodle, onePage } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 9;

// ---------------------------------------------------------------- 6: white & red ink (mau-portfolio-content-marketing)

export default function deckInk() {
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
