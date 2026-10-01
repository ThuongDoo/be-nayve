import { at, shape, contactIcons, rightAligned, pic, big, para, tag, bullets, onePage } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 7;

// ---------------------------------------------------------------- 8: mint & deep teal (mau-portfolio-social-media)

export default function deckTeal() {
  const blob = '#dcefec';
  const teal = '#0f5a57';
  const f = 'anton';
  return onePage('Portfolio – Xanh ngọc mạng xã hội', '1 màn hình: nền bạc hà có mảng cong, chữ xanh ngọc đậm khổng lồ', 'Nguyễn Thảo Linh – Social Media Executive', '#eef6f5', [
    shape('blob', at(-140, 420, 560, 480), { background: blob }, { seed: 11 }),
    shape('blob', at(860, -140, 520, 460), { background: blob }, { seed: 31 }),
    tag(at(40, 40, 200, 18), 'CREATIVE', teal, { fontSize: 14, fontWeight: 800 }),
    tag(at(860, 40, 300, 18), 'NGUYỄN THẢO LINH', teal, { fontSize: 14, fontWeight: 800, textAlign: 'right' }),
    big(at(20, 60, 1160, 250), 'PORTFOLIO', teal, f, 240, { textAlign: 'center' }),
    pic(1011, at(470, 40, 250, 480)),
    para(at(40, 330, 380, 34), 'Social Media Executive', teal, { fontSize: 22 }),
    para(at(40, 370, 380, 90), 'Xin chào, mình là Thảo Linh – 3 năm quản lý fanpage, sáng tạo nội dung và phát triển cộng đồng trên nền tảng số.', teal),
    para(at(780, 330, 380, 90), '"Xây dựng thương hiệu mạnh mẽ bằng từng chiến dịch nội dung sáng tạo và chỉ số đo lường cụ thể."', teal, { fontSize: 15, italic: true, textAlign: 'right' }),
    big(at(40, 470, 380, 56), 'EDUCATION', teal, f, 40),
    bullets(at(40, 526, 400, 70), ['ĐH Thương mại – Marketing (2016 – 2020)', 'Facebook Ads Manager (Meta Blueprint)'], teal),
    big(at(780, 430, 380, 56), 'PERSONAL SKILLS', teal, f, 40, { textAlign: 'right' }),
    bullets(at(820, 486, 340, 110), ['Facebook, Instagram, TikTok', 'Content planning & Ads', 'Canva, CapCut, Premiere', 'Meta Insights, GA'], teal),
    big(at(40, 610, 380, 56), 'BEST PROJECT', teal, f, 40),
    pic(1059, at(40, 670, 170, 100)),
    pic(669, at(222, 670, 170, 100)),
    pic(22, at(404, 670, 170, 100)),
    big(at(700, 610, 460, 90), 'CONTACT ME', teal, f, 80, { textAlign: 'right' }),
    para(at(700, 700, 460, 50), 'thaolinh.socialmedia@gmail.com\n0987 456 123 · @thaolinh.content', teal, { fontSize: 14, textAlign: 'right' }),
    ...contactIcons(rightAligned(1160, 3, 30, 10), 758, teal, 30, 10),
  ]);
}
