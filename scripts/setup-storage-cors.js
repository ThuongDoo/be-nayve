/**
 * Lets the editor's pages read files from Firebase Storage with CORS, which the audio visualizer needs
 * to analyse the music (and template creation needs to copy images). Run once per bucket:
 *
 *   npm run setup:cors
 *
 * Allowed origins come from STORAGE_CORS_ORIGINS (comma-separated), else CORS_ORIGIN, else "*".
 * Only GET/HEAD are allowed; uploads keep going through the Firebase SDK and its security rules.
 */
import { bucket } from '../src/config/firebase.js';

const origins = (process.env.STORAGE_CORS_ORIGINS || process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const cors = [
  {
    origin: origins,
    method: ['GET', 'HEAD'],
    responseHeader: ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'Range'],
    maxAgeSeconds: 3600,
  },
];

await bucket.setCorsConfiguration(cors);
const [meta] = await bucket.getMetadata();
console.log(`CORS set on ${meta.name}:`, JSON.stringify(meta.cors));
process.exit(0);
