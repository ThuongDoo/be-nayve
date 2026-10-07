import { SLOW, cleanValues, deliver, destinationOf, findForm, telegramChats } from '../services/forms.service.js';
import { httpError } from '../utils/httpError.js';

// ---------------------------------------------------------------- public: forms on published pages

/** At most this many submissions per visitor and site in RATE_WINDOW_MS, against spam. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60_000;
const recent = new Map();

function overLimit(key) {
  const now = Date.now();
  const times = (recent.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (times.length >= RATE_LIMIT) return true;
  times.push(now);
  recent.set(key, times);
  // Keeps the map small: forget visitors whose window has passed.
  if (recent.size > 10_000) for (const [k, v] of recent) if (now - v[v.length - 1] >= RATE_WINDOW_MS) recent.delete(k);
  return false;
}

const clientIp = (req) => String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket.remoteAddress || '';

/**
 * Body (sent as text/plain so browsers skip the CORS preflight): `{ site, form, values: [{ label,
 * value }], hp }`. `hp` is a field visitors never see: when a bot fills it in, it is told all went well
 * and nothing is sent. Pages don't wait for the answer (they thank the visitor straight away), so a
 * failure is only logged here.
 */
export const submitForm = async (req, res) => {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      throw httpError(400, 'Dữ liệu gửi lên không hợp lệ');
    }
  }
  if (!body || typeof body !== 'object') throw httpError(400, 'Dữ liệu gửi lên không hợp lệ');
  if (body.hp) return res.json({ ok: true });
  const values = cleanValues(body.values);
  if (overLimit(`${clientIp(req)}|${body.site}`)) throw httpError(429, 'Bạn gửi hơi nhiều lần, hãy thử lại sau ít phút.');

  const { props } = await findForm(body.site, body.form);
  const dest = destinationOf(props);
  if (!dest.sheet && !dest.telegram) throw httpError(409, 'Trang này chưa cài nơi nhận thông tin. Hãy liên hệ chủ trang bằng cách khác.');
  const result = await deliver(dest, { values });
  if (!Object.values(result).some((r) => r === true || r === SLOW)) {
    console.error(`Form ${body.form} of ${body.site} could not be delivered:`, result);
    throw httpError(502, 'Chưa gửi được, hãy thử lại sau.');
  }
  res.json({ ok: true });
};

// ---------------------------------------------------------------- editor: checking the settings

/** Body `{ sheetUrl, telegramToken, telegramChatId }`: sends a sample entry. Answers `{ sheet, telegram }`. */
export const testForm = async (req, res) => {
  const dest = destinationOf(req.body ?? {}, { strict: true });
  if (!dest.sheet && !dest.telegram) throw httpError(400, 'Hãy nhập đường dẫn Google Sheet hoặc token và chat ID Telegram');
  const result = await deliver(dest, {
    values: [
      { label: 'Họ và tên', value: 'Khách thử' },
      { label: 'Số điện thoại', value: '0901 234 567' },
    ],
  });
  res.json(result);
};

/** Body `{ token }`: `{ chats: [{ id, title }] }` the bot has recent messages from. */
export const findTelegramChats = async (req, res) => {
  res.json({ chats: await telegramChats(req.body?.token) });
};
