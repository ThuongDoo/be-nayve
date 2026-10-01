/**
 * Sample templates, written to the `templates` collection so every user sees them under "Tạo trang mới".
 *
 * Each template is one file in scripts/templates/ named after its id (e.g. sample-gym.js), whose
 * default export builds { name, description, page, elements } and whose `order` places it on the home
 * screen (higher first). Shared building blocks live in scripts/templates/_shared.js (files starting
 * with "_" are not templates).
 *
 * Fixed ids: running it again updates the templates instead of adding copies. Deleting a template's
 * file removes that template from Firestore on the next run. Admins can still delete them from the
 * admin screen.
 *
 *   npm run seed:templates                 write to Firestore
 *   npm run seed:templates -- --only ID     write just scripts/templates/ID.js, nothing else is touched
 *   npm run seed:templates -- --preview D   only write D/<id>.html (+ D/templates.json) for a look, touch nothing
 *
 * Names, contacts and photos are placeholders the user replaces.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { normalizeDoc } from '../src/lib/render/elements.js';
import { exportHtml } from '../src/lib/render/exportHtml.js';

const SEEDED_BY = 'seed-sample-templates';
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'templates');

/** Earlier samples from before seeded templates were tracked; removed when seeding. */
const RETIRED = ['sample-portfolio-minimal', 'sample-link-in-bio'];

const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const previewDir = option('--preview');
// Only this template (its file name without .js); the others, and stale ones, are left alone.
const only = option('--only');

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.js') && !f.startsWith('_') && (!only || f === `${only}.js`));
if (only && !files.length) {
  console.error(`No template file scripts/templates/${only}.js`);
  process.exit(1);
}
const modules = await Promise.all(
  files.map(async (f) => ({ id: path.basename(f, '.js'), ...(await import(pathToFileURL(path.join(dir, f)).href)) })),
);
modules.sort((a, b) => (b.order ?? 0) - (a.order ?? 0));

// Built once and passed through normalizeDoc, exactly as the app will read them.
const built = modules.map(({ id, default: make }) => {
  const { name, description, page, elements } = make();
  return { id, name, description, ...normalizeDoc({ page, elements }) };
});

if (previewDir) {
  fs.mkdirSync(previewDir, { recursive: true });
  for (const t of built) fs.writeFileSync(path.join(previewDir, `${t.id}.html`), exportHtml(t));
  // The same data as JSON, for trying the templates in the editor without Firestore.
  fs.writeFileSync(path.join(previewDir, 'templates.json'), JSON.stringify(built));
  console.log(`Wrote ${built.length} previews to ${previewDir}:`, built.map((t) => `${t.id} ${t.page.height}px`).join(', '));
  process.exit(0);
}

const { FieldValue } = await import('firebase-admin/firestore');
const { db } = await import('../src/config/firebase.js');

// Seeded templates whose file is gone (plus the old retired ids). Templates admins made are left alone.
const ids = new Set(built.map((t) => t.id));
const seeded = only ? { docs: [] } : await db.collection('templates').where('createdBy', '==', SEEDED_BY).get();
const stale = new Set(only ? [] : [...RETIRED, ...seeded.docs.map((d) => d.id).filter((id) => !ids.has(id))]);
for (const id of stale) {
  await db.doc(`templates/${id}`).delete();
  console.log(`templates/${id} removed (no file in scripts/templates)`);
}

for (const [i, t] of built.entries()) {
  await db.doc(`templates/${t.id}`).set({
    name: t.name,
    description: t.description,
    page: t.page,
    elements: t.elements,
    sourceUid: null,
    sourceDesignId: null,
    createdBy: SEEDED_BY,
    // Spaced a second apart so they list in this order (newest first) on the home screen.
    createdAt: new Date(Date.now() - i * 1000),
    updatedAt: FieldValue.serverTimestamp(),
    // Merged, so what admins set on the template (e.g. hiding it) survives a re-seed.
  }, { merge: true });
  console.log(`templates/${t.id} ← ${t.name} (${t.elements.length} phần tử, cao ${t.page.height}px)`);
}
process.exit(0);
