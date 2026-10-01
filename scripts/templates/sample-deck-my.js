import { at, icon, contactIcons, SH, pic, fill, big, para, tag, bullets, onePage } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 8;

// ---------------------------------------------------------------- 7: light / charcoal with bold colours (mau-portfolio-marketing)

export default function deckMy() {
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
