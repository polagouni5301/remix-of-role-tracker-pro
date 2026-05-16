// Tiny "API" wrapper. Today it calls the local mock store with a small delay
// so swapping to a real fetch backend later is a one-line change per module.
export const API_BASE = "/v1";
const DELAY = 120;

export function delay(ms = DELAY) {
  return new Promise((r) => setTimeout(r, ms));
}

// real fetch helper for when a backend exists
export async function http(path, init = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? null : res.json();
}
