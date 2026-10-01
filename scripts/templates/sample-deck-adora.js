import { at, icon, line, contactIcons, rightAligned, SH, pic, fill, big, para, tag, bullets, doodle, onePage, shot } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 6;

// ---------------------------------------------------------------- 9: grey & orange graphic designer (mau-thiet-ke-do-hoa)

export default function deckAdora() {
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
