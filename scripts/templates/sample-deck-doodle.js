import { at, icon, contactIcons, rightAligned, pic, big, para, tag, bullets, doodle, onePage, LOREM, LOREM2, shot } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 14;

// ---------------------------------------------------------------- 1: taupe & wine with doodles (mau-portfolio-1)

export default function deckDoodle() {
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
