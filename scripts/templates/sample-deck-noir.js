import { W, at, box, contactIcons, SH, pic, fill, big, para, tag, onePage, LOREM, LOREM2 } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 12;

// ---------------------------------------------------------------- 3: black & white, huge condensed type (mau-portfolio-3)

export default function deckNoir() {
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
