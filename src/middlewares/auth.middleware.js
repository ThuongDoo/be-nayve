import { auth, db } from '../config/firebase.js';

/** Verifies the Firebase ID token in `Authorization: Bearer <token>` and sets `req.user`. */
export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
  try {
    req.user = await auth.verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

/**
 * Use after requireAuth. Admins have `role: 'admin'` on users/{uid}, which only the Firebase Console
 * can set (the Firestore rules forbid changing it from the app).
 */
export const requireAdmin = async (req, res, next) => {
  const profile = await db.doc(`users/${req.user.uid}`).get();
  if (profile.get('role') !== 'admin') return res.status(403).json({ message: 'Chỉ quản trị viên được thực hiện' });
  next();
};
