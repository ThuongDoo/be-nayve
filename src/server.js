import app from './app.js';
import { config } from './config/index.js';
import { expireDueSites } from './services/siteExpiry.service.js';

app.listen(config.port, () => {
  console.log(`nayva-be running on http://localhost:${config.port} (${config.nodeEnv})`);
});

// Takes down published sites whose time ran out (see siteExpiry.service.js): shortly after start, then
// every 10 minutes. Sites are also checked whenever their status is read.
const EXPIRY_SWEEP_MS = 10 * 60_000;
const sweep = () =>
  expireDueSites()
    .then((n) => n && console.log(`Expired ${n} site(s)`))
    .catch((e) => console.error('Expiry sweep failed:', e.message));
setTimeout(sweep, 30_000);
setInterval(sweep, EXPIRY_SWEEP_MS).unref();
