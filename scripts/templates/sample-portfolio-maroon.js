import { at, shape, contactIcons, SH, pic, fill, big, para, tag, onePage, LOREM2, shot } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 10;

// ---------------------------------------------------------------- 5: maroon / green / cream (mau-portfolio-5)

export default function deckCahaya() {
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
