import { store } from "@/mock/store.js";
import { delay } from "./client.js";
import { ROLES } from "@/mock/roles.js";

// Simple mock hash. Replace with real backend later.
function hash(pw) {
  let h = 0;
  for (let i = 0; i < pw.length; i++) h = (h * 31 + pw.charCodeAt(i)) | 0;
  return `mh_${h.toString(36)}_${pw.length}`;
}

export async function getMe() {
  await delay();
  const s = store.session();
  if (!s) throw new Error("Not authenticated");
  return store.userById(s.userId);
}

/** Look up an email — returns { exists, hasPassword, name?, role? } */
export async function lookupEmail(email) {
  await delay(120);
  if (!email) throw new Error("Email is required");
  const u = store.users().find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!u) return { exists: false, hasPassword: false };
  return { exists: true, hasPassword: !!u.passwordHash, name: u.name, role: u.role, isAdmin: !!u.isAdmin };
}

/** Register a brand-new account (no password yet). Returns the user but does NOT create a session. */
export async function register({ name, email, role, pod, manager, orgCode, isAdmin = false }) {
  await delay();
  if (!email || !name || !orgCode) throw new Error("Missing required fields");
  if (!isAdmin && !role) throw new Error("Role is required");
  if (role && !ROLES[role]) throw new Error("Unknown role");
  const list = store.users();
  const exists = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists && exists.passwordHash) throw new Error("Account exists — please sign in instead.");
  const user = exists
    ? { ...exists, name, role: role || exists.role, pod, manager, orgCode, isAdmin }
    : {
        id: store.uid(), email, name, role: role || "Manager",
        pod, manager, orgCode,
        seenBadges: [], isAdmin,
        createdAt: Date.now(), lastLogin: 0,
      };
  store.upsertUser(user);
  // Temporary pending-setup token so SetupPassword can identify the user
  localStorage.setItem("rrt.pendingSetup", JSON.stringify({ userId: user.id, email: user.email }));
  return user;
}

/** Set the password for a freshly-registered account; creates an authenticated session. */
export async function setupPassword({ userId, password }) {
  await delay();
  if (!password || password.length < 8) throw new Error("Password must be at least 8 characters");
  const u = store.userById(userId);
  if (!u) throw new Error("Account not found");
  const next = { ...u, passwordHash: hash(password), lastLogin: Date.now() };
  store.upsertUser(next);
  store.setSession({ userId: next.id });
  localStorage.removeItem("rrt.pendingSetup");
  return next;
}

/** Sign in an existing account that has a password set. */
export async function signInWithPassword({ email, password }) {
  await delay();
  const u = store.users().find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!u) throw new Error("No account with that email");
  if (!u.passwordHash) throw new Error("Password not set — finish account setup");
  if (u.passwordHash !== hash(password)) throw new Error("Incorrect password");
  const next = { ...u, lastLogin: Date.now() };
  store.upsertUser(next);
  store.setSession({ userId: next.id });
  return next;
}

/** Returns the pending setup record if a user just registered. */
export function getPendingSetup() {
  try {
    const raw = localStorage.getItem("rrt.pendingSetup");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export async function logout() {
  await delay(50);
  store.setSession(null);
  return null;
}

export async function listRoles() {
  await delay(50);
  return Object.entries(ROLES).map(([key, v]) => ({ key, ...v }));
}

// Legacy export kept so any older caller still works (treated as register-or-signin-with-password).
export async function login(payload) {
  if (payload?.password) return signInWithPassword({ email: payload.email, password: payload.password });
  return register(payload);
}
