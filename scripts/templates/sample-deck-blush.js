import { at, text, contactIcons, pic, fill, big, para, tag, onePage, LOREM } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 13;

// ---------------------------------------------------------------- 2: blush pink, serif (mau-portfolio-2)

export default function deckBlush() {
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
