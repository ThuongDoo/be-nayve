import { W, X, CW, at, text, button, box, line, shape, contactIcons, doodle, moving, unsplash, createElement, scrollYHref } from './_shared.js';

/** Position on the home screen: higher shows first (give a new template the next number). */
export const order = 27;

// ---------------------------------------------------------------- bakery (cream, brown & strawberry: tilted cards, chalkboard menu)

export default function bakery() {
  const cream = '#fff6e9';
  const brown = '#5a3a22';
  const pink = '#f28b9a';
  const pinkSoft = '#fde2e4';
  const butter = '#ffd36e';
  const board = '#2f3b35';
  const chalk = '#f4efe6';
  const soft = '#8a6d58';
  const heading = 'grandstander';
  const hand = 'patrick-hand';
  const H = 4620;
  const els = [];

  const photo = (b, id, alt, style = {}) =>
    createElement('image', { ...b, props: { src: unsplash(id, Math.round(b.w * 2), Math.round(b.h * 2)), alt, fit: 'cover' }, style: { radius: 18, ...style } });
  const round = (b, id, alt, extra = {}) =>
    shape('circle', b, { background: pinkSoft }, { src: unsplash(id, 600, 600), imgW: 600, imgH: 600, alt, ...extra });
  const title = (b, t, color, fontSize, extra = {}) =>
    text('title', b, t, { color, fontFamily: heading, fontSize, fontWeight: 700, lineHeight: 1.3, letterSpacing: 0, ...extra });
  /** Gives `word` (inside the element's text) its own colour, like recolouring it in the editor. */
  const tint = (el, word, color = pink) => {
    const start = el.props.text.indexOf(word);
    return start < 0 ? el : { ...el, props: { ...el.props, marks: [{ start, end: start + word.length, color }] } };
  };
  const para = (b, t, color = soft, extra = {}) => text('paragraph', b, t, { color, fontSize: 16, lineHeight: 1.7, ...extra });
  const tilt = (el, deg) => ({ ...el, rotation: deg });
  /** Pink label + rounded title with one word in pink, centred. Returns [elements, bottomY]. */
  const head = (y, label, t, word) => [
    [
      text('label', at(X, y, CW, 22), label, { color: pink, textAlign: 'center', letterSpacing: 3 }),
      tint(title(at(X, y + 28, CW, 62), t, brown, 44, { textAlign: 'center' }), word),
    ],
    y + 112,
  ];
  const solid = (b, t, href, extra = {}) =>
    button('primary', b, t, { background: brown, color: '#ffffff', fontFamily: heading, fontSize: 17, fontWeight: 700, radius: 999, ...extra }, { href, newTab: href.startsWith('http') });
  const outline = (b, t, href, color = brown) =>
    button('outline', b, t, { color, borderColor: color, borderWidth: 2, fontFamily: heading, fontSize: 17, fontWeight: 700, radius: 999 }, { href, newTab: href.startsWith('http') });
  /** A white instant-photo card, tilted, with a handwritten caption. */
  const polaroid = (x, y, w, id, caption, deg) => [
    tilt(box(at(x, y, w, w + 46), { background: '#ffffff', radius: 8, shadow: 'lg' }), deg),
    tilt(photo(at(x + 10, y + 10, w - 20, w - 20), id, caption, { radius: 4 }), deg),
    tilt(text('paragraph', at(x + 10, y + w - 4, w - 20, 34), caption, { color: brown, fontFamily: hand, fontSize: 20, textAlign: 'center', lineHeight: 1.4 }), deg),
  ];

  // Section tops, also the targets of the menu's in-page links.
  const MENU = 900;
  const CAKES = 2960;
  const CONTACT = 4000;

  // Menu bar.
  els.push(
    text('title', at(X, 22, 340, 60), 'Tiệm Bánh Mây', { color: pink, fontFamily: 'lobster', fontSize: 40, fontWeight: 400, lineHeight: 1.3 }),
    ...[
      ['Menu', MENU, 70],
      ['Bánh sinh nhật', CAKES, 130],
      ['Ghé tiệm', CONTACT, 90],
    ].map(([t, y, w], i, all) => {
      const right = 930 - all.slice(i + 1).reduce((sum, [, , ww]) => sum + ww + 18, 0);
      return button('link', at(right - w, 36, w, 30), t, { color: brown, underline: false, fontFamily: heading, fontSize: 17, fontWeight: 600, textAlign: 'center' }, { href: scrollYHref(y) });
    }),
    solid(at(960, 26, 160, 50), 'Đặt bánh', scrollYHref(CAKES)),
  );

  // Hero: words on the left, the cake in a circle with tilted photo cards around it.
  els.push(
    shape('blob', at(620, 110, 560, 560), { background: pinkSoft }, { seed: 21 }),
    round(at(700, 180, 400, 400), '1621303837174-89787a7d4729', 'Bánh kem dâu hồng', { rim: 10, rimColor: '#ffffff' }),
    ...polaroid(980, 120, 180, '1486427944299-d1955d23e34d', 'cupcake bạc hà', 8),
    ...polaroid(620, 520, 200, '1530610476181-d83430b64dcd', 'croissant bơ Pháp', -7),
    moving(tilt(button('pill', at(1010, 520, 120, 120), 'MỚI!\nBánh dâu', { background: butter, color: brown, fontFamily: heading, fontSize: 18, fontWeight: 700, verticalAlign: 'middle', lineHeight: 1.2 }), 12), 'swing', 2.6),
    doodle('sparkle', at(640, 150, 44, 44), butter, { seed: 6 }),

    button('pill', at(X, 150, 230, 38), '✦ Ra lò mỗi sáng 6:00', { background: butter, color: brown, fontSize: 14, fontWeight: 700 }),
    tint(title(at(X, 206, 540, 270), 'Bánh ngon\nnướng bằng\ncả trái tim', brown, 64, { lineHeight: 1.25 }), 'trái tim'),
    para(at(X, 486, 470, 84), 'Bánh mì, croissant, bánh ngọt và bánh kem làm tay mỗi ngày từ bơ Pháp, bột mì Nhật và trái cây tươi. Không chất bảo quản.', soft, { fontSize: 17 }),
    solid(at(X, 594, 190, 56), 'Xem menu', scrollYHref(MENU)),
    outline(at(X + 206, 594, 220, 56), 'Đặt bánh sinh nhật', scrollYHref(CAKES)),
    text('paragraph', at(X, 682, 480, 26), '⭐ 4.9 · hơn 1.200 đánh giá trên Google Maps', { color: brown, fontSize: 15, fontWeight: 600 }),
  );

  // Today's menu on a chalkboard.
  let [h, y] = head(MENU, 'MENU HÔM NAY', 'Viết bằng phấn, nướng bằng lò', 'nướng bằng lò');
  els.push(
    ...h,
    box(at(X - 16, y + 24, CW + 32, 580), { background: '#8a5a3a', radius: 22 }),
    box(at(X, y + 40, CW, 548), { background: board, radius: 12 }),
  );
  // Every item with its photo in a small chalk-ringed circle.
  ;[
    ['BÁNH MÌ & CROISSANT', [
      ['1555507036-ab1f4038808a', 'Croissant bơ Pháp', '35K'],
      ['1483695028939-5bb13f8648b0', 'Pain au chocolat', '40K'],
      ['1549931319-a545dcf3bc73', 'Bánh mì sourdough', '85K'],
      ['1608198093002-ad4e005484ec', 'Bánh mì hoa cúc', '120K'],
      ['1595535873420-a599195b3f4a', 'Bánh mì que bơ tỏi', '30K'],
    ]],
    ['BÁNH NGỌT', [
      ['1464305795204-6f5bbfc7fb81', 'Tart dâu tây', '55K'],
      ['1571115177098-24ec42ed204d', 'Tiramisu (ly)', '60K'],
      ['1550617931-e17a7b70dce2', 'Cupcake socola', '45K'],
      ['1612201142855-7873bc1661b4', 'Macaron (hộp 6)', '90K'],
      ['1558961363-fa8fdf82db35', 'Cookie socola chip', '25K'],
    ]],
    ['ĐỒ UỐNG', [
      ['1461023058943-07fcbe16d735', 'Cà phê sữa đá', '35K'],
      ['1541167760496-1628856ab772', 'Latte nóng', '45K'],
      ['1499638673689-79a0b5115d87', 'Trà đào cam sả', '45K'],
      ['1579954115545-a95591f28bfc', 'Sữa tươi dâu', '50K'],
      ['1542990253-0d0f5be5f0ed', 'Socola nóng', '45K'],
    ]],
  ].forEach(([group, items], i) => {
    const w = (CW - 80 - 2 * 40) / 3;
    const x = X + 40 + i * (w + 40);
    els.push(text('subheading', at(x, y + 76, w, 34), group, { color: butter, fontFamily: hand, fontSize: 26, letterSpacing: 1 }));
    items.forEach(([id, name, price], j) => {
      const top = y + 128 + j * 80;
      els.push(
        round(at(x, top, 60, 60), id, name, { rim: 3, rimColor: chalk }),
        text('paragraph', at(x + 74, top + 12, w - 74 - 56, 36), name, { color: chalk, fontFamily: hand, fontSize: 21, lineHeight: 1.4 }),
        text('paragraph', at(x + w - 56, top + 12, 56, 36), price, { color: butter, fontFamily: hand, fontSize: 21, textAlign: 'right', lineHeight: 1.4 }),
        ...(j < items.length - 1 ? [createElement('divider', { ...at(x + 74, top + 66, w - 74, 10), style: { color: 'rgba(244,239,230,0.25)', lineWidth: 2, lineStyle: 'dashed' } })] : []),
      );
    });
  });

  // Best sellers: round photos with tilted price tags.
  ;[h, y] = head(1700, 'ĐƯỢC YÊU THÍCH', 'Khách quen gọi là món ruột', 'món ruột');
  els.push(...h);
  ;[
    ['1555507036-ab1f4038808a', 'Croissant bơ', '35K'],
    ['1464305795204-6f5bbfc7fb81', 'Tart dâu tây', '55K'],
    ['1563729784474-d77dbb933a9e', 'Cupcake dâu', '45K'],
    ['1571115177098-24ec42ed204d', 'Tiramisu', '60K'],
  ].forEach(([id, name, price], i) => {
    const size = 220;
    const x = X + i * ((CW - size) / 3);
    els.push(
      round(at(x, y + 30, size, size), id, name, { rim: 6, rimColor: i % 2 ? butter : pinkSoft }),
      tilt(button('pill', at(x + size - 86, y + 30, 92, 40), price, { background: i % 2 ? pink : butter, color: i % 2 ? '#ffffff' : brown, fontFamily: heading, fontSize: 18, fontWeight: 700 }), 10),
      title(at(x - 20, y + 266, size + 40, 34), name, brown, 22, { textAlign: 'center' }),
    );
  });

  // Baking times through the day.
  els.push(
    text('label', at(X, 2140, CW, 22), 'GIỜ RA LÒ', { color: pink, textAlign: 'center', letterSpacing: 3 }),
    line(at(X + 60, 2256, CW - 120, 20), '#e8cfb4', 3),
  );
  ;[
    ['6:00', 'Bánh mì, croissant'],
    ['8:00', 'Tart, bánh su'],
    ['10:00', 'Cookie, macaron'],
    ['14:00', 'Bánh bông lan'],
    ['16:00', 'Mẻ croissant thứ hai'],
  ].forEach(([time, what], i) => {
    const cx = X + 60 + i * ((CW - 120) / 4);
    els.push(
      box(at(cx - 12, 2254, 24, 24), { background: i === 0 ? pink : butter, radius: 999, borderWidth: 4, borderColor: cream }),
      title(at(cx - 90, 2200, 180, 40), time, brown, 26, { textAlign: 'center' }),
      text('paragraph', at(cx - 100, 2292, 200, 26), what, { color: soft, fontSize: 15, textAlign: 'center' }),
    );
  });

  // Scrolling-image band.
  els.push(
    createElement('parallax', { ...at(0, 2400, W, 420), props: { src: unsplash('1587241321921-91a834d6d191', 1600, 1100), alt: 'Bên trong tiệm bánh' }, style: { radius: 0 } }),
    box(at(0, 2400, W, 420), { background: 'rgba(90,58,34,0.5)', radius: 0 }),
    tint(title(at(X, 2530, CW, 150), 'Mùi bơ thơm\ntừ đầu ngõ đã gọi bạn vào.', '#ffffff', 46, { textAlign: 'center' }), 'từ đầu ngõ', butter),
  );

  // Birthday cakes: words and a size table on the left, cakes on the right.
  els.push(
    text('label', at(X, CAKES, 500, 22), 'BÁNH SINH NHẬT', { color: pink, letterSpacing: 3 }),
    tint(title(at(X, CAKES + 28, 540, 130), 'Một chiếc bánh\ncho ngày đặc biệt', brown, 44), 'đặc biệt'),
    para(at(X, CAKES + 168, 500, 84), 'Chọn cốt (vani, socola, matcha, red velvet), nhân kem và trang trí theo ý bạn. Viết chữ, vẽ hình miễn phí.'),
    box(at(X, CAKES + 270, 520, 270), { background: '#ffffff', radius: 20, shadow: 'sm' }),
  );
  ;[
    ['Ø 14 cm', '2 – 4 người', '350K'],
    ['Ø 18 cm', '6 – 8 người', '520K'],
    ['Ø 22 cm', '10 – 12 người', '650K'],
    ['2 tầng', '20 – 30 người', 'từ 1.500K'],
  ].forEach(([size, people, price], i) => {
    const top = CAKES + 290 + i * 60;
    els.push(
      title(at(X + 24, top, 140, 34), size, brown, 20),
      text('paragraph', at(X + 170, top + 4, 180, 28), people, { color: soft, fontSize: 15 }),
      text('paragraph', at(X + 360, top + 2, 136, 30), price, { color: pink, fontFamily: heading, fontSize: 19, fontWeight: 700, textAlign: 'right' }),
      ...(i < 3 ? [line(at(X + 24, top + 40, 472, 12), '#f1e4d4', 1)] : []),
    );
  });
  els.push(
    text('paragraph', at(X, CAKES + 556, 520, 26), '🕑 Đặt trước ít nhất 24 giờ · Giao bánh tận nơi trong nội thành', { color: brown, fontSize: 14, fontWeight: 600 }),
    ...polaroid(660, CAKES + 20, 250, '1559620192-032c4bc4674e', 'kem dâu việt quất', -5),
    ...polaroid(900, CAKES + 110, 220, '1578985545062-69928b1d9587', 'socola ganache', 6),
    ...polaroid(720, CAKES + 330, 230, '1586985289688-ca3cf47d3e6e', 'kem bơ ombre', 3),
  );

  // Instagram strip.
  els.push(
    title(at(X, 3700, CW, 50), '@tiembanhmay', brown, 34, { textAlign: 'center' }),
    text('paragraph', at(X, 3752, CW, 26), 'Theo dõi để biết mẻ bánh mới mỗi ngày', { color: soft, fontSize: 15, textAlign: 'center' }),
  );
  ;[
    '1488477181946-6428a0291777',
    '1600326145552-327f74b9c189',
    '1557925923-cd4648e211a0',
    '1608198093002-ad4e005484ec',
    '1517093728432-a0440f8d45af',
    '1606890737304-57a1ca8a5b62',
  ].forEach((id, i) => {
    const size = (CW - 5 * 12) / 6;
    els.push(photo(at(X + i * (size + 12), 3800, size, size), id, 'Bánh của tiệm', { radius: 14 }));
  });

  // Visit us.
  els.push(
    box(at(X, CONTACT, CW, 400), { background: pinkSoft, radius: 32 }),
    tint(title(at(X + 56, CONTACT + 50, 560, 64), 'Ghé tiệm uống cà phê nhé!', brown, 40), 'cà phê'),
    para(at(X + 56, CONTACT + 122, 520, 56), 'Có chỗ ngồi trong nhà và ban công nhỏ. Đặt bánh qua điện thoại, Zalo hoặc ghé trực tiếp.'),
    solid(at(X + 56, CONTACT + 206, 230, 56), 'Gọi 0901 234 567', 'tel:0901234567', { background: pink }),
    outline(at(X + 302, CONTACT + 206, 160, 56), 'Nhắn Zalo', 'https://zalo.me/0901234567'),
    text('list', at(X + 56, CONTACT + 290, 560, 80), '📍 25 Phan Đình Phùng, Ba Đình, Hà Nội\n🕕 6:00 – 21:00 mỗi ngày · Giao hàng qua Grab, ShopeeFood', { color: brown, fontSize: 15, lineHeight: 1.9 }),
    ...polaroid(760, CONTACT + 40, 240, '1558961363-fa8fdf82db35', 'cookie vừa ra lò', 5),
    ...contactIcons(X + 490, CONTACT + 218, brown, 32, 10),
  );

  // Footer.
  els.push(
    text('title', at(X, 4480, 340, 56), 'Tiệm Bánh Mây', { color: pink, fontFamily: 'lobster', fontSize: 32, fontWeight: 400, lineHeight: 1.3 }),
    text('caption', at(640, 4498, W - X - 640, 22), '© 2026 Tiệm Bánh Mây · Nướng bằng cả trái tim', { color: soft, fontSize: 13, textAlign: 'right' }),
  );

  return {
    name: 'Tiệm bánh',
    description: 'Kem, nâu và hồng dâu: thẻ ảnh nghiêng, menu bảng phấn, món bán chạy, giờ ra lò, ảnh cuộn, bảng giá bánh sinh nhật, ảnh Instagram',
    page: { title: 'Tiệm Bánh Mây – Bánh ngon nướng mỗi ngày', width: W, height: H, background: cream },
    elements: els,
  };
}
