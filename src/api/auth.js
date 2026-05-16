import { store } from "@/mock/store.js";
import { delay } from "./client.js";
import { ROLES } from "@/mock/roles.js";

export async function getMe() {
  await delay();
  const s = store.session();
  if (!s) throw new Error("Not authenticated");
  return store.userById(s.userId);
}

export async function login({ name, email, role, pod, manager, orgCode, isAdmin = false }) {
  await delay();
  if (!email || !name || !orgCode) throw new Error("Missing required fields");
  if (!isAdmin && !role) throw new Error("Role is required");
  if (role && !ROLES[role]) throw new Error("Unknown role");
  // upsert user by email
  const list = store.users();
  let user = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: store.uid(), email, name,
      role: role || "Manager",
      pod, manager, orgCode,
      seenBadges: [], isAdmin,
      createdAt: Date.now(), lastLogin: Date.now(),
    };
  } else {
    user = { ...user, name, role: role || user.role, pod, manager, orgCode, isAdmin, lastLogin: Date.now() };
  }
  store.upsertUser(user);
  store.setSession({ userId: user.id });
  return user;
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
