import { store } from "@/mock/store.js";
import { delay } from "./client.js";

export async function getChecklist(userId, role, period, periodKey) {
  await delay();
  const submitted = store.isSubmitted(userId, period, periodKey);
  const rows = store.entriesFor(userId, role, period, periodKey);
  return { period, periodKey, submittedAt: submitted?.submittedAt || null, rows };
}

export async function patchEntry(entryId, patch) {
  await delay(80);
  return store.patchEntry(entryId, patch);
}

export async function submitPeriod(userId, period, periodKey) {
  await delay();
  const sub = store.submitPeriod(userId, period, periodKey);
  if (!sub) throw new Error("Already submitted");
  return sub;
}

export async function unsubmitPeriod(userId, period, periodKey) {
  await delay();
  store.unsubmitPeriod(userId, period, periodKey);
  return { ok: true };
}

export async function listHistory(userId, period) {
  await delay();
  const entries = store.entries().filter((e) => e.userId === userId && (!period || e.period === period));
  // group by periodKey
  const map = new Map();
  entries.forEach((e) => {
    const k = `${e.period}|${e.periodKey}`;
    if (!map.has(k)) map.set(k, { period: e.period, periodKey: e.periodKey, total: 0, done: 0, points: 0, submittedAt: null });
    const o = map.get(k);
    o.total++; if (e.completed) o.done++; o.points += e.pointsEarned || 0;
    if (e.submittedAt) o.submittedAt = e.submittedAt;
  });
  return Array.from(map.values()).sort((a, b) => (b.periodKey > a.periodKey ? 1 : -1));
}
