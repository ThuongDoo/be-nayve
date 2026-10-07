import { db } from '../config/firebase.js';
import { httpError } from '../utils/httpError.js';

/**
 * Contact forms on published pages (lib/render/form.js). A page posts what the visitor typed together
 * with its site key (the Vercel project name) and the form's element id; the form's destinations are
 * read from the design here, so they never appear in the page: a Google Sheet (an Apps Script web app
 * that appends a row) and / or a Telegram chat (through the owner's bot).
 */

const SHEET_URL = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
const BOT_TOKEN = /^\d+:[\w-]{20,}$/;
const CHAT_ID = /^(-?\d{1,20}|@\w{5,32})$/;
const SITE_KEY = /^[a-z0-9-]{3,100}$/;
const MAX_FIELDS = 20;
const MAX_LABEL = 100;
const MAX_VALUE = 2000;
const TIMEOUT_MS = 15_000;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const vnTime = () => new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

/**
 * `{ sheet, telegram }` from a form's settings: the Apps Script URL and `{ token, chatId }`, each null
 * when not set. With `strict`, a value that is set but malformed is a 400 (the editor's test button);
 * otherwise it just counts as not set.
 */
export function destinationOf({ sheetUrl, telegramToken, telegramChatId } = {}, { strict = false } = {}) {
  const bad = (message) => {
    if (strict) throw httpError(400, message);
    return null;
  };
  const sheet = !sheetUrl ? null : SHEET_URL.test(sheetUrl) ? sheetUrl : bad('Đường dẫn Google Sheet phải có dạng https://script.google.com/macros/s/…/exec');
  let telegram = null;
  if (telegramToken || telegramChatId) {
    if (!BOT_TOKEN.test(telegramToken ?? '')) bad('Token bot Telegram chưa đúng');
    else if (!CHAT_ID.test(String(telegramChatId ?? ''))) bad('Chat ID Telegram chưa đúng');
    else telegram = { token: telegramToken, chatId: String(telegramChatId) };
  }
  return { sheet, telegram };
}

/** The published site (users' or admins') deployed to Vercel project `key`, or null. */
async function siteByProject(key) {
  for (const collection of ['sites', 'adminSites']) {
    const snap = await db.collection(collection).where('projectName', '==', key).limit(1).get();
    if (!snap.empty) {
      const doc = snap.docs[0];
      const data = doc.data();
      // sites/{uid} holds the uid in its id; adminSites/{uid}_{designId} as a field.
      return { uid: data.uid ?? doc.id, designId: data.designId, domain: data.domain, expired: !!data.expired, design: data.design ?? null };
    }
  }
  return null;
}

/**
 * The form `formId` of the site `siteKey`: `{ site, props }`. Its settings come from the design as
 * saved now (so changing where it sends needs no republishing), or from the published snapshot if the
 * form has been removed from the design since.
 */
export async function findForm(siteKey, formId) {
  if (typeof siteKey !== 'string' || !SITE_KEY.test(siteKey) || typeof formId !== 'string' || formId.length > 40) {
    throw httpError(400, 'Yêu cầu không hợp lệ');
  }
  const site = await siteByProject(siteKey);
  if (!site) throw httpError(404, 'Trang này không còn nhận thông tin');
  if (site.expired) throw httpError(410, 'Trang này đang tạm ngưng nên chưa nhận được thông tin');
  const saved = (await db.doc(`users/${site.uid}/designs/${site.designId}`).get()).data();
  const find = (design) => design?.elements?.find((el) => el?.id === formId && el.type === 'form');
  const el = find(saved) ?? find(site.design);
  if (!el) throw httpError(404, 'Không tìm thấy form này');
  return { site, props: el.props ?? {} };
}

/** What the visitor typed, trimmed and bounded: `[{ label, value }]`. 400 when it's all empty. */
export function cleanValues(values) {
  if (!Array.isArray(values) || !values.length || values.length > MAX_FIELDS) throw httpError(400, 'Dữ liệu gửi lên không hợp lệ');
  const out = values.map((v) => ({
    label: String(v?.label ?? '').trim().slice(0, MAX_LABEL) || 'Thông tin',
    value: String(v?.value ?? '').trim().slice(0, MAX_VALUE),
  }));
  if (out.every((v) => !v.value)) throw httpError(400, 'Hãy điền thông tin trước khi gửi');
  return out;
}

/**
 * A delivery result: the destination got the request but didn't answer in time. Apps Script often
 * takes long on its first run (and on every run of an older, slower script) while still adding the row,
 * so this counts as sent: telling the visitor it failed would only make them send it twice.
 */
export const SLOW = 'slow';
const SHEET_TIMEOUT_MS = 30_000;

async function sendToSheet(url, row) {
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
    });
  } catch (e) {
    if (e.name === 'TimeoutError') return SLOW;
    throw e;
  }
  const body = await res.text();
  if (!res.ok) throw new Error(`Google Sheet báo lỗi ${res.status}. Hãy kiểm tra lại đường dẫn Apps Script.`);
  // An Apps Script that isn't shared with "Anyone" answers with a sign-in page instead of the JSON.
  if (!body.includes('"ok"')) throw new Error('Google Sheet chưa nhận: hãy triển khai Apps Script dạng Ứng dụng web, quyền truy cập “Bất kỳ ai”.');
}

async function telegramCall(token, method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
    const why = res.status === 401 || res.status === 404 ? 'token bot không đúng' : data.description || `lỗi ${res.status}`;
    throw new Error(`Telegram: ${why}`);
  }
  return data.result;
}

/**
 * Passes a submission on to every destination set. Resolves to `{ sheet, telegram }`: true when that
 * one got it, SLOW when it was sent but didn't answer in time, an error message when it failed,
 * undefined when not set.
 */
export async function deliver(dest, { formName, page, values }) {
  const time = vnTime();
  const jobs = {};
  if (dest.sheet) {
    const row = { 'Thời gian': time, Trang: page, Form: formName };
    for (const v of values) row[v.label in row ? `${v.label} (2)` : v.label] = v.value;
    jobs.sheet = sendToSheet(dest.sheet, row);
  }
  if (dest.telegram) {
    const text =
      `📩 <b>${esc(formName)}</b>\n🌐 ${esc(page)}\n\n` +
      values.map((v) => `<b>${esc(v.label)}:</b> ${esc(v.value || '—')}`).join('\n') +
      `\n\n🕒 ${esc(time)}`;
    jobs.telegram = telegramCall(dest.telegram.token, 'sendMessage', { chat_id: dest.telegram.chatId, text, parse_mode: 'HTML', disable_web_page_preview: true });
  }
  const names = Object.keys(jobs);
  const settled = await Promise.allSettled(Object.values(jobs));
  return Object.fromEntries(
    names.map((n, i) => {
      const s = settled[i];
      return [n, s.status === 'fulfilled' ? (s.value === SLOW ? SLOW : true) : s.reason?.message || 'Không gửi được'];
    }),
  );
}

/** The chats a bot has seen messages in lately (to fill in the chat id): `[{ id, title }]`. */
export async function telegramChats(token) {
  if (!BOT_TOKEN.test(token ?? '')) throw httpError(400, 'Token bot Telegram chưa đúng');
  let updates;
  try {
    updates = await telegramCall(token, 'getUpdates', { limit: 100, allowed_updates: ['message', 'channel_post', 'my_chat_member'] });
  } catch (e) {
    throw httpError(400, e.message);
  }
  const chats = new Map();
  for (const u of updates) {
    const chat = (u.message ?? u.channel_post ?? u.my_chat_member)?.chat;
    if (!chat) continue;
    const name = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || (chat.username && `@${chat.username}`) || String(chat.id);
    chats.set(chat.id, { id: chat.id, title: chat.type === 'private' ? `${name} (cá nhân)` : `${name} (nhóm)` });
  }
  return [...chats.values()];
}
