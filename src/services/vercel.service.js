import { createHash } from 'node:crypto';
import { config } from '../config/index.js';
import { httpError } from '../utils/httpError.js';

const API = 'https://api.vercel.com';

/** Error text for a failed Vercel call. An expired or revoked token fails every call; say so plainly. */
const vercelMessage = (data, res) =>
  data.error?.invalidToken
    ? 'Token Vercel (VERCEL_TOKEN) không hợp lệ hoặc đã hết hạn. Hãy tạo token mới trên Vercel và cập nhật cấu hình backend.'
    : `Vercel: ${data.error?.message || res.statusText}`;

/** Calls the Vercel API. Failures become 502s carrying Vercel's HTTP status and error code. */
async function vercelFetch(path, { method = 'GET', body, query = {} } = {}) {
  if (!config.vercel.token) throw httpError(500, 'VERCEL_TOKEN chưa được cấu hình');
  const params = new URLSearchParams({ ...query, ...(config.vercel.teamId && { teamId: config.vercel.teamId }) });
  const res = await fetch(`${API}${path}?${params}`, {
    method,
    headers: { Authorization: `Bearer ${config.vercel.token}`, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(httpError(502, vercelMessage(data, res)), {
      vercelStatus: res.status,
      vercelCode: data.error?.code,
    });
  }
  return data;
}

/**
 * Uploads a binary file so a deployment can reference it by `{ sha, size }` instead of inlining it.
 * Vercel dedupes by SHA-1, so uploading the same image twice is cheap.
 */
export async function uploadFile(buffer) {
  if (!config.vercel.token) throw httpError(500, 'VERCEL_TOKEN chưa được cấu hình');
  const sha = createHash('sha1').update(buffer).digest('hex');
  const params = new URLSearchParams(config.vercel.teamId ? { teamId: config.vercel.teamId } : {});
  const res = await fetch(`${API}/v2/files?${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.vercel.token}`,
      'Content-Type': 'application/octet-stream',
      'x-vercel-digest': sha,
    },
    body: buffer,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw httpError(502, vercelMessage(data, res));
  }
  return { sha, size: buffer.length };
}

/**
 * Deploys static files to production of the given project. `files` maps a path to either its text
 * content (`'<html>…'`) or an uploaded file (`{ sha, size }` from uploadFile).
 */
export const deployStatic = (projectName, files) =>
  vercelFetch('/v13/deployments', {
    method: 'POST',
    query: { skipAutoDetectionConfirmation: '1' },
    body: {
      name: projectName,
      target: 'production',
      files: Object.entries(files).map(([file, content]) =>
        typeof content === 'string' ? { file, data: content } : { file, sha: content.sha, size: content.size },
      ),
      projectSettings: { framework: null },
    },
  });

export const getDeployment = (id) => vercelFetch(`/v13/deployments/${encodeURIComponent(id)}`);

const projectDomainPath = (project, domain) =>
  `/projects/${encodeURIComponent(project)}/domains${domain ? `/${encodeURIComponent(domain)}` : ''}`;

/** Points `domain` at the project's production deployment. Does nothing if it already is. */
export async function addProjectDomain(project, domain) {
  try {
    await vercelFetch(`/v9${projectDomainPath(project, domain)}`);
    return;
  } catch (e) {
    if (e.vercelStatus !== 404) throw e;
  }
  try {
    await vercelFetch(`/v10${projectDomainPath(project)}`, { method: 'POST', body: { name: domain } });
  } catch (e) {
    if (e.vercelStatus === 409) {
      throw Object.assign(httpError(409, `Tên miền ${domain} đã được dùng ở nơi khác trên Vercel, hãy chọn tên khác`), {
        vercelStatus: 409,
      });
    }
    throw e;
  }
}

/** Detaches `domain` from the project; already gone counts as success. */
export async function removeProjectDomain(project, domain) {
  try {
    await vercelFetch(`/v9${projectDomainPath(project, domain)}`, { method: 'DELETE' });
  } catch (e) {
    if (e.vercelStatus !== 404) throw e;
  }
}

/**
 * Best-effort check that a `*.vercel.app` host isn't already someone's project: Vercel answers unknown
 * hosts with `x-vercel-error: DEPLOYMENT_NOT_FOUND`. Returns true when unsure (e.g. network error).
 */
export async function isVercelAppHostFree(host) {
  try {
    const res = await fetch(`https://${host}`, { method: 'HEAD', redirect: 'manual' });
    return res.headers.get('x-vercel-error') === 'DEPLOYMENT_NOT_FOUND';
  } catch {
    return true;
  }
}

/** Deletes a project with all its deployments and domains; already gone counts as success. */
export async function deleteProject(project) {
  try {
    await vercelFetch(`/v9/projects/${encodeURIComponent(project)}`, { method: 'DELETE' });
  } catch (e) {
    if (e.vercelStatus !== 404) throw e;
  }
}
