import { store, computeStatsForUser, currentPeriodKeys } from "@/mock/store.js";
import { delay } from "./client.js";
import { levelFromXp } from "@/lib/levels.js";
import { activitiesFor } from "@/mock/roles.js";
import { lastNDays } from "@/lib/dates.js";

export async function getSummary(userId) {
  await delay();
  const u = store.userById(userId);
  const s = computeStatsForUser(userId);
  const lvl = levelFromXp(s.totalXp);
  const keys = currentPeriodKeys();
  const today = store.entries().filter((e) => e.userId === userId && e.period === "daily" && e.periodKey === keys.daily);
  const acts = activitiesFor(u?.role || "Manager", "daily");
  return {
    user: u,
    ...s,
    level: lvl.lvl,
    levelTitle: lvl.title,
    levelEmoji: lvl.emoji,
    nextLevel: lvl.next?.title,
    toNext: lvl.toNext,
    levelProgress: lvl.progress,
    todayCompleted: today.filter((e) => e.completed).length,
    todayTotal: acts.length,
    pointsToday: today.reduce((a, e) => a + (e.pointsEarned || 0), 0),
    productivity: s.completed ? Math.min(100, Math.round((s.completed / Math.max(1, s.completed + 10)) * 100)) : 0,
  };
}

export async function getTrends(userId, window = "30d") {
  await delay();
  const days = lastNDays(window === "30d" ? 30 : 7);
  const entries = store.entries().filter((e) => e.userId === userId && e.period === "daily");
  const u = store.userById(userId);
  const acts = activitiesFor(u?.role || "Manager", "daily");
  const trend = days.map((d) => {
    const dayEntries = entries.filter((e) => e.periodKey === d);
    const done = dayEntries.filter((e) => e.completed).length;
    const pct = acts.length ? Math.round((done / acts.length) * 100) : 0;
    const pts = dayEntries.reduce((a, e) => a + (e.pointsEarned || 0), 0);
    return { date: d.slice(5), pct, points: pts, done };
  });
  // weekly bar
  const weekly = [];
  for (let i = 0; i < 4; i++) {
    const slice = trend.slice(i * 7, i * 7 + 7);
    weekly.push({ week: `W${i + 1}`, points: slice.reduce((a, b) => a + b.points, 0) });
  }
  // streak history (running streak per day)
  let s = 0;
  const streakHistory = trend.map((d) => {
    s = d.pct >= 50 ? s + 1 : 0;
    return { date: d.date, streak: s };
  });
  return { trend, weekly, streakHistory };
}

export async function getCategoryCoverage(userId) {
  await delay();
  const entries = store.entries().filter((e) => e.userId === userId && e.completed);
  const map = new Map();
  entries.forEach((e) => {
    const acts = activitiesFor(e.role, e.period);
    const a = acts.find((x) => x.key === e.activityKey);
    if (!a) return;
    map.set(a.category, (map.get(a.category) || 0) + 1);
  });
  return Array.from(map.entries()).map(([category, value]) => ({ category, value }));
}
