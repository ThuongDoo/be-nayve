import { moveSiteDomain } from '../services/deploy.service.js';
import {
  DOMAIN_STATUS,
  cancelDomainChange,
  checkAvailability,
  claimDomain,
  failDomainApproval,
  finishDomainApproval,
  getUserDomain,
  listDomainChanges,
  rejectDomainChange,
  startDomainApproval,
} from '../services/domain.service.js';
import { withSiteLock } from '../services/siteLock.service.js';
import { httpError } from '../utils/httpError.js';

const requester = ({ email = null, name = null, picture = null }) => ({ email, name, picture });

// ---------------------------------------------------------------- user

/** `GET /domains/check?name=…` → `{ name, domain, available, reason }`. */
export const checkDomain = async (req, res) => {
  res.json(await checkAvailability(req.user.uid, req.query.name));
};

export const getMyDomain = async (req, res) => {
  res.json(await getUserDomain(req.user.uid));
};

/** `{ name }`: sets the first domain right away, or files a change request for an admin. */
export const setMyDomain = async (req, res) => {
  const result = await claimDomain(req.user.uid, req.body?.name, requester(req.user));
  res.status(result.status === DOMAIN_STATUS.pending ? 202 : 200).json(result);
};

export const cancelMyDomainChange = async (req, res) => {
  await cancelDomainChange(req.user.uid);
  res.status(204).end();
};

// ---------------------------------------------------------------- admin

const LISTABLE = [DOMAIN_STATUS.pending, DOMAIN_STATUS.approved, DOMAIN_STATUS.rejected];

export const listDomainRequests = async (req, res) => {
  const status = req.query.status ?? DOMAIN_STATUS.pending;
  if (!LISTABLE.includes(status)) throw httpError(400, 'Trạng thái không hợp lệ');
  const list = await listDomainChanges(status);
  res.json(status === DOMAIN_STATUS.pending ? list : list.reverse());
};

export const approveDomainRequest = async (req, res) => {
  const { uid } = req.params;
  // Never alongside a publish of the same user's site: both reattach the domain on Vercel.
  await withSiteLock(uid, { action: 'domain', by: req.user.uid }, async () => {
    const change = await startDomainApproval(uid, req.user.uid);
    try {
      await moveSiteDomain(uid, change.from, change.to);
    } catch (e) {
      await failDomainApproval(uid, e.message);
      throw e;
    }
    await finishDomainApproval(uid, change);
  });
  res.json(await getUserDomain(uid));
};

export const rejectDomainRequest = async (req, res) => {
  const reason = String(req.body?.reason ?? '').trim().slice(0, 500);
  if (!reason) throw httpError(400, 'Hãy nhập lý do từ chối để người dùng biết');
  await rejectDomainChange(req.params.uid, req.user.uid, reason);
  res.json(await getUserDomain(req.params.uid));
};
