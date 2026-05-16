import { BADGES, badgeProgress } from "@/lib/badges-engine.js";
import { computeStatsForUser, store } from "@/mock/store.js";
import { levelFromXp } from "@/lib/levels.js";
import { delay } from "./client.js";

export async function listBadges(userId) {
  await delay();
  const stats = computeStatsForUser(userId);
  stats.level = levelFromXp(stats.totalXp).lvl;
  return BADGES.map((b) => ({ ...b, ...badgeProgress(b, stats) }));
}

export async function markSeen(userId, keys = []) {
  await delay(50);
  const u = store.userById(userId);
  if (!u) return null;
  const set = new Set([...(u.seenBadges || []), ...keys]);
  store.upsertUser({ ...u, seenBadges: [...set] });
  return [...set];
}
