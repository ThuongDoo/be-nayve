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
  publish: {
    rootDomain: (process.env.PUBLISH_ROOT_DOMAIN || 'vercel.app').toLowerCase().replace(/^\.+|\.+$/g, ''),
  },
};
