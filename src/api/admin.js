import { store, computeStatsForUser } from "@/mock/store.js";
import { activitiesFor } from "@/mock/roles.js";
import { levelFromXp } from "@/lib/levels.js";
import { lastNDays, todayKey } from "@/lib/dates.js";
import { delay } from "./client.js";

function userRow(u) {
  const s = computeStatsForUser(u.id);
  const lvl = levelFromXp(s.totalXp);
  const entries = store.entries().filter((e) => e.userId === u.id);
  const files = store.files().filter((f) => f.userId === u.id);
  const dailyPct = pctCompletion(u, entries, "daily");
  const weeklyPct = pctCompletion(u, entries, "weekly");
  const monthlyPct = pctCompletion(u, entries, "monthly");
  return {
    id: u.id, name: u.name, email: u.email, role: u.role, pod: u.pod, manager: u.manager,
    level: lvl.lvl, levelTitle: lvl.title, levelEmoji: lvl.emoji,
    xp: s.totalXp, streak: s.currentStreak, badges: 0, // computed lazily on demand
    daily: dailyPct, weekly: weeklyPct, monthly: monthlyPct,
    overall: Math.round((dailyPct + weeklyPct + monthlyPct) / 3),
    files: files.length,
    lastLogin: u.lastLogin,
  };
}

function pctCompletion(u, entries, period) {
  const acts = activitiesFor(u.role, period);
  if (!acts.length) return 0;
  const recent = entries.filter((e) => e.period === period);
  if (!recent.length) return 0;
  const done = recent.filter((e) => e.completed).length;
  return Math.round((done / recent.length) * 100);
}

export async function getKpis() {
  await delay();
  const users = store.users();
  const entries = store.entries();
  const files = store.files();
  const submits = store.submits();
  const totalXp = users.reduce((a, u) => a + computeStatsForUser(u.id).totalXp, 0);
  return {
    totalUsers: users.length,
    totalEntries: entries.length,
    totalCompleted: entries.filter((e) => e.completed).length,
    totalFiles: files.length,
    totalSubmits: submits.length,
    totalXp,
    avgCompletion: Math.round(entries.length ? (entries.filter((e) => e.completed).length / entries.length) * 100 : 0),
  };
}

export async function teamOverview({ role, search = "", range = "30d" } = {}) {
  await delay();
  let users = store.users();
  if (role) users = users.filter((u) => u.role === role);
  if (search) {
    const q = search.toLowerCase();
    users = users.filter((u) =>
      [u.name, u.email, u.pod, u.manager].filter(Boolean).some((s) => s.toLowerCase().includes(q))
    );
  }
  void range;
  return users.map(userRow).sort((a, b) => b.overall - a.overall);
}

export async function leaderboards() {
  await delay();
  const rows = store.users().map(userRow);
  return {
    xp: [...rows].sort((a, b) => b.xp - a.xp).slice(0, 10),
    streak: [...rows].sort((a, b) => b.streak - a.streak).slice(0, 10),
    files: [...rows].sort((a, b) => b.files - a.files).slice(0, 10),
    badges: [...rows].sort((a, b) => b.overall - a.overall).slice(0, 10),
  };
}

export async function listUsers() { await delay(); return store.users().map(userRow); }
export async function getUser(id) {
  await delay();
  const u = store.userById(id);
  if (!u) throw new Error("Not found");
  return { user: u, row: userRow(u) };
}
export async function getUserHistory(id) {
  await delay();
  const entries = store.entries().filter((e) => e.userId === id);
  const map = new Map();
  entries.forEach((e) => {
    const k = `${e.period}|${e.periodKey}`;
    if (!map.has(k)) map.set(k, { period: e.period, periodKey: e.periodKey, total: 0, done: 0, points: 0, submittedAt: null });
    const o = map.get(k); o.total++; if (e.completed) o.done++; o.points += e.pointsEarned || 0;
    if (e.submittedAt) o.submittedAt = e.submittedAt;
  });
  return Array.from(map.values()).sort((a, b) => (b.periodKey > a.periodKey ? 1 : -1)).slice(0, 50);
}
export async function getUserFiles(id) {
  await delay();
  return store.files().filter((f) => f.userId === id).sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, 50);
}

export async function getAnalyticsTrends() {
  await delay();
  const days = lastNDays(30);
  const entries = store.entries().filter((e) => e.period === "daily");
  const users = store.users();
  const dailyPct = days.map((d) => {
    const slice = entries.filter((e) => e.periodKey === d);
    const total = slice.length || 1;
    const done = slice.filter((e) => e.completed).length;
    return { date: d.slice(5), pct: Math.round((done / total) * 100) };
  });
  const roleCompletion = Object.keys(
    users.reduce((a, u) => ((a[u.role] = true), a), {})
  ).map((role) => {
    const slice = entries.filter((e) => e.role === role);
    const total = slice.length || 1;
    const done = slice.filter((e) => e.completed).length;
    return { role, pct: Math.round((done / total) * 100) };
  });
  // weekly files
  const files = store.files();
  const weeklyFiles = [];
  for (let i = 0; i < 4; i++) {
    const cutoffEnd = Date.now() - i * 7 * 86400000;
    const cutoffStart = cutoffEnd - 7 * 86400000;
    weeklyFiles.unshift({
      week: `W${4 - i}`,
      files: files.filter((f) => f.uploadedAt >= cutoffStart && f.uploadedAt < cutoffEnd).length,
    });
  }
  // weekly xp
  const weeklyXp = [];
  for (let i = 0; i < 4; i++) {
    const cutoffEnd = Date.now() - i * 7 * 86400000;
    const cutoffStart = cutoffEnd - 7 * 86400000;
    const slice = entries.filter((e) => (e.updatedAt || e.createdAt) >= cutoffStart && (e.updatedAt || e.createdAt) < cutoffEnd);
    weeklyXp.unshift({ week: `W${4 - i}`, xp: slice.reduce((a, e) => a + (e.pointsEarned || 0), 0) });
  }
  return { dailyPct, roleCompletion, weeklyFiles, weeklyXp };
}

export async function listAuditFiles({ search = "", page = 1, pageSize = 25 } = {}) {
  await delay();
  let files = store.files().slice().sort((a, b) => b.uploadedAt - a.uploadedAt);
  if (search) {
    const q = search.toLowerCase();
    files = files.filter((f) => [f.fileName, f.activityKey, f.role].filter(Boolean).some((s) => String(s).toLowerCase().includes(q)));
  }
  const users = new Map(store.users().map((u) => [u.id, u]));
  const rows = files.map((f) => ({ ...f, user: users.get(f.userId) }));
  return { rows: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length };
}

export async function getSettings() {
  await delay();
  const users = store.users();
  const entries = store.entries();
  const files = store.files();
  const totalXp = users.reduce((a, u) => a + computeStatsForUser(u.id).totalXp, 0);
  const totalStorage = files.reduce((a, f) => a + (f.size || 0), 0);
  return {
    env: "mock-local (localStorage)",
    totalUsers: users.length,
    totalEntries: entries.length,
    totalFiles: files.length,
    totalStorage,
    totalXp,
    totalBadges: 0,
    today: todayKey(),
  };
}
