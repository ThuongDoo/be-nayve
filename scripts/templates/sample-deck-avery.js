import { at, text, line, contactIcons, rightAligned, SH, pic, fill, big, para, tag, doodle, onePage, LOREM } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 11;

// ---------------------------------------------------------------- 4: light / black with red-orange and script (mau-portfolio-4)

export default function deckAvery() {
  const light = '#efeeec';
  const dark = '#0e0e0e';
  const red = '#ff3b1f';
  const ink = '#1a1a1a';
  const f = 'anton';
  const caps = (b, t, color) => para(b, t.toUpperCase(), color, { fontSize: 11, fontWeight: 600, lineHeight: 1.5 });
  return onePage('Portfolio – Cam đỏ năng động', '1 màn hình: nền sáng + mảng đen, chữ cam đỏ khổng lồ, chữ viết tay', 'Vũ An Nhiên – Portfolio', light, [
    fill(at(760, 0, 440, SH), dark),
    tag(at(40, 26, 300, 16), 'CREATIVE / VŨ AN NHIÊN', ink, { fontSize: 11 }),
    tag(at(400, 26, 200, 16), 'THÁNG 8 / 2026', ink, { fontSize: 11, textAlign: 'center' }),
    big(at(40, 60, 420, 200), "I'M VŨ AN\nNHIÊN", ink, f, 76, { lineHeight: 1.25 }),
    caps(at(40, 270, 300, 110), `${LOREM}`, ink),
    pic(836, at(40, 390, 90, 90)),
    pic(646, at(140, 390, 90, 90)),
    pic(823, at(390, 60, 330, 470)),
    doodle('arrow', at(330, 400, 60, 100), red, { strokeWidth: 5, seed: 7 }),
    big(at(10, 520, 750, 200), 'PORTFOLIO', red, f, 164),
    text('title', { ...at(520, 690, 300, 100), rotation: -8 }, 'project', { color: ink, fontFamily: 'moon-dance', fontSize: 84, fontWeight: 400 }),
    big(at(800, 40, 360, 80), 'EDUCATION', red, f, 64),
    ...[['Thiết kế đa phương tiện', '2015 – 2019'], ['Nhiếp ảnh thời trang', '2019 – 2020'], ['Marketing nội dung', '2021 – 2022']].flatMap(([t, y], k) => [
      para(at(800, 132 + k * 44, 250, 22), t, '#ffffff', { fontSize: 14 }),
      para(at(1060, 132 + k * 44, 100, 22), y, '#ffffff', { fontSize: 12, textAlign: 'right', opacity: 0.7 }),
      line(at(800, 158 + k * 44, 360, 4), '#444444', 1),
    ]),
    big(at(800, 280, 360, 70), 'EXPERIENCE', '#ffffff', f, 58),
    ...[[823, 'LICERIA & CO.'], [836, 'STUDIO GIÓ'], [646, 'LARANA INC.']].flatMap(([id, t], k) => [
      pic(id, at(800 + k * 124, 360, 112, 120)),
      fill(at(800 + k * 124, 480, 112, 22), red),
      tag(at(800 + k * 124, 484, 112, 16), t, '#ffffff', { fontSize: 10, textAlign: 'center' }),
    ]),
    big(at(800, 560, 360, 80), "LET'S WORK", '#ffffff', f, 70),
    text('title', at(930, 620, 240, 90), 'together', { color: red, fontFamily: 'moon-dance', fontSize: 70, fontWeight: 400 }),
    para(at(800, 700, 360, 70), '+84 901 234 567\nhello@annhien.vn', '#ffffff', { fontSize: 14 }),
    ...contactIcons(rightAligned(1160), 744, '#ffffff'),
  ]);
}
