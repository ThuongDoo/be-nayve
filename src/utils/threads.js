/**
 * A Threads profile link from what a user typed: "https://www.threads.net/@name", "threads.com/@name",
 * "@name" or just "name" (a post link gives its author). Returns the canonical https://www.threads.com/@name, or null if it isn't one.
 * (Mirrored in personal-template/src/lib/threads.js so the dialog can check it before sending.)
 */
export function normalizeThreadsUrl(input) {
  const s = String(input ?? '').trim();
  if (!s) return null;
  const m =
    /^(?:https?:\/\/)?(?:www\.)?threads\.(?:net|com)\/@?([A-Za-z0-9._]{1,30})(?:\/[^?#]*)?(?:[?#].*)?$/i.exec(s) ??
    /^@?([A-Za-z0-9._]{1,30})$/.exec(s);
  return m ? `https://www.threads.com/@${m[1]}` : null;
}
