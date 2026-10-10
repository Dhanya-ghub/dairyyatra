const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');
const TOKEN_KEY = 'dy_admin_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);
const setToken = (t) => sessionStorage.setItem(TOKEN_KEY, t);

export class AuthError extends Error {}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let body = {};
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (res.status === 401 && path !== '/api/admin/login') {
    clearToken();
    throw new AuthError('Session expired. Please log in again.');
  }
  if (!res.ok) throw new Error(body.message || body.error || 'Request failed');
  return body;
}

export async function login(username, password) {
  const { token } = await request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  setToken(token);
}

export const fetchApplications = () => request('/api/admin/submissions?sort=desc');

export const fetchApplication = (refId) =>
  request(`/api/admin/submissions/${encodeURIComponent(refId)}`);

export const updateApplication = (refId, payload) =>
  request(`/api/admin/submissions/${encodeURIComponent(refId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });