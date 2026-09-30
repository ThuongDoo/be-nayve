import { cleanupAll, cleanupUser } from '../services/storageCleanup.service.js';
import { deleteUserFile, deleteUserFiles, refreshUsage, storageDetails } from '../services/storageUsage.service.js';
import { httpError } from '../utils/httpError.js';

/** The editor calls this when the user returns home or deletes a page; rate-limited per user. */
export const cleanupMyStorage = async (req, res) => {
  const result = await cleanupUser(req.user.uid);
  // Deleted files free quota straight away.
  if (result.deleted) await refreshUsage(req.user.uid);
  res.json(result);
};

export const cleanupAllStorage = async (req, res) => {
  res.json(await cleanupAll());
};

/** `{ usedBytes, limitBytes }`, recomputed (the editor calls it after each upload). */
export const getMyUsage = async (req, res) => {
  res.json(await refreshUsage(req.user.uid));
};

/** Usage plus the list of uploaded files and where each one is used. */
export const getMyStorage = async (req, res) => {
  res.json(await storageDetails(req.user.uid));
};

/** `?path=users/<uid>/images/…` — returns the new usage. */
export const deleteMyFile = async (req, res) => {
  const { path } = req.query;
  if (!path) throw httpError(400, 'Thiếu đường dẫn tệp');
  res.json(await deleteUserFile(req.user.uid, String(path)));
};

/** `{ paths: [...] }` — deletes several files at once; returns the new usage and counts. */
export const deleteMyFiles = async (req, res) => {
  res.json(await deleteUserFiles(req.user.uid, req.body?.paths));
};
