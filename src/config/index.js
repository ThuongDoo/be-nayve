import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n'),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  },
  vercel: {
    token: process.env.VERCEL_TOKEN,
    teamId: process.env.VERCEL_TEAM_ID || undefined,
  },
  // This API's public address including /api (e.g. https://api.example.com/api): published pages post
  // their forms to it. Forms can't send while it is unset.
  publicApiUrl: (process.env.PUBLIC_API_URL || '').replace(/\/+$/, '') || null,
  publish: {
    rootDomain: (process.env.PUBLISH_ROOT_DOMAIN || 'vercel.app').toLowerCase().replace(/^\.+|\.+$/g, ''),
  },
  // The frontend's public address (e.g. https://nayva.vn): SePay sends users back there after paying.
  appUrl: (process.env.APP_URL || '').replace(/\/+$/, '') || null,
  // SePay payment gateway (my.sepay.vn → Cổng thanh toán), for users renewing their site themselves.
  sepay: {
    env: process.env.SEPAY_ENV === 'production' ? 'production' : 'sandbox',
    merchantId: process.env.SEPAY_MERCHANT_ID,
    secretKey: process.env.SEPAY_SECRET_KEY,
    // Sent back in the X-Secret-Key header of IPN calls; the merchant secret key unless set apart.
    ipnSecret: process.env.SEPAY_IPN_SECRET || process.env.SEPAY_SECRET_KEY,
  },
  // Renewal prices in VND, as "months:price" pairs, e.g. "3:150000,6:270000,12:480000".
  renewPrices: Object.fromEntries(
    (process.env.RENEW_PRICES || '3:150000,6:270000,12:480000')
      .split(',')
      .map((p) => p.split(':').map((n) => Number(n.trim())))
      .filter(([m, price]) => m > 0 && price > 0),
  ),
};
