import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { config } from './index.js';

const { projectId, clientEmail, privateKey, storageBucket } = config.firebase;

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });

export const auth = getAuth(app);
export const db = getFirestore(app);
export const bucket = getStorage(app).bucket();
