// LocalStorage-backed mock backend.
// All API modules go through this; swap with real fetch later without touching pages.
import { ROLES, activitiesFor } from "./roles.js";
import { ROLE_LIST } from "@/lib/role-themes.js";
import { todayKey, isoWeekKey, monthKey, lastNDays, addDays } from "@/lib/dates.js";
import { pointsFor, POINTS } from "@/lib/points.js";

const K = {
  users: "rrt.users",
  session: "rrt.session",
  entries: "rrt.entries",
  files: "rrt.files",
  submits: "rrt.submits",
  seenBadges: "rrt.seenBadges",
};

const uid = () => Math.random().toString(36).slice(2, 10);

function read(k, fb) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; }
}
function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

function seedTeamUsers() {
  const existing = read(K.users, []);
  if (existing.length) return existing;
  const names = [
    "Aarav Mehta","Priya Sharma","Liam Brooks","Sofia Garcia","Noah Patel",
    "Maya Iyer","Ethan Chen","Zara Khan","Diego Alvarez","Ines Dupont",
    "Kenji Tanaka","Amelia Park","Marcus Reid","Hana Yamada","Ravi Kapoor",
  ];
  const users = names.map((name, i) => ({
    id: uid(),
    name,
    email: name.toLowerCase().replace(/\s+/g, ".") + "@ops.example",
    role: ROLE_LIST[i % ROLE_LIST.length],
    pod: `Pod ${String.fromCharCode(65 + (i % 5))}`,
    manager: i % 3 === 0 ? "Self" : names[(i + 1) % names.length],
    orgCode: `ORG-${1000 + i}`,
    seenBadges: [],
    isAdmin: false,
    createdAt: Date.now() - i * 86400000 * 3,
    lastLogin: Date.now() - i * 3600000,
  }));
  write(K.users, users);
  seedHistoryFor(users);
  return users;
}

function seedHistoryFor(users) {
  const entries = read(K.entries, []);
  if (entries.length) return;
  const out = [];
  const subs = [];
  const files = [];
  const days = lastNDays(30);
  users.forEach((u) => {
    const role = u.role;
    days.forEach((dk, di) => {
      const acts = activitiesFor(role, "daily");
      let allDone = true;
      acts.forEach((act) => {
        const completed = Math.random() < 0.78;
        if (!completed) allDone = false;
        const hasEv = act.evidence && completed && Math.random() < 0.7;
        if (hasEv) {
          const fid = uid();
          files.push({
            id: fid, userId: u.id, role, activityKey: act.key, period: "daily",
            periodKey: dk, fileName: `${act.key}-${dk}.pdf`, mimeType: "application/pdf",
            size: 100_000 + Math.floor(Math.random() * 800_000), uploadedAt: Date.now() - (29 - di) * 86400000,
          });
        }
        out.push({
          id: uid(), userId: u.id, role, period: "daily", periodKey: dk, activityKey: act.key,
          completed, notes: "", pointsEarned: completed ? pointsFor("daily", { evidenceRequired: act.evidence, hasEvidence: hasEv }) : 0,
          attachmentIds: hasEv ? [files[files.length - 1].id] : [],
          createdAt: Date.now() - (29 - di) * 86400000,
          updatedAt: Date.now() - (29 - di) * 86400000,
          completedAt: completed ? Date.now() - (29 - di) * 86400000 : null,
          submittedAt: di < 27 ? Date.now() - (29 - di) * 86400000 + 3600000 : null,
        });
      });
      if (di < 27) subs.push({ userId: u.id, period: "daily", periodKey: dk, submittedAt: Date.now() - (29 - di) * 86400000 + 3600000, bonus: POINTS.submitBonus.daily });
    });
  });
  write(K.entries, out);
  write(K.submits, subs);
  write(K.files, files);
}

export const store = {
  // session
  session() { return read(K.session, null); },
  setSession(s) { s ? write(K.session, s) : localStorage.removeItem(K.session); },

  // users
  users() { return seedTeamUsers(); },
  userById(id) { return this.users().find((u) => u.id === id); },
  upsertUser(u) {
    const list = this.users();
    const i = list.findIndex((x) => x.id === u.id);
    if (i >= 0) list[i] = { ...list[i], ...u }; else list.push(u);
    write(K.users, list); return u;
  },

  // entries
  entries() { return read(K.entries, []); },
  setEntries(list) { write(K.entries, list); },
  entriesFor(userId, role, period, periodKey) {
    const acts = activitiesFor(role, period);
    const existing = this.entries().filter(
      (e) => e.userId === userId && e.period === period && e.periodKey === periodKey && e.role === role
    );
    // ensure every activity has an entry row
    const byKey = new Map(existing.map((e) => [e.activityKey, e]));
    const submitted = this.isSubmitted(userId, period, periodKey);
    let mutated = false;
    const all = this.entries();
    acts.forEach((act) => {
      if (!byKey.has(act.key)) {
        const e = {
          id: uid(), userId, role, period, periodKey, activityKey: act.key,
          completed: false, notes: "", pointsEarned: 0, attachmentIds: [],
          createdAt: Date.now(), updatedAt: Date.now(), completedAt: null,
          submittedAt: submitted ? submitted.submittedAt : null,
        };
        all.push(e); byKey.set(act.key, e); mutated = true;
      }
    });
    if (mutated) this.setEntries(all);
    return acts.map((act) => ({ activity: act, entry: byKey.get(act.key) }));
  },
  patchEntry(entryId, patch) {
    const list = this.entries();
    const i = list.findIndex((e) => e.id === entryId);
    if (i < 0) throw new Error("Entry not found");
    const cur = list[i];
    if (cur.submittedAt) throw new Error("Period already submitted");
    const next = { ...cur, ...patch, updatedAt: Date.now() };
    if (patch.completed === true && !cur.completed) next.completedAt = Date.now();
    if (patch.completed === false) next.completedAt = null;
    // recompute points
    const role = ROLES[cur.role];
    const act = role?.[cur.period]?.find((a) => a.key === cur.activityKey);
    next.pointsEarned = next.completed
      ? pointsFor(cur.period, { evidenceRequired: !!act?.evidence, hasEvidence: (next.attachmentIds || []).length > 0 })
      : 0;
    list[i] = next; this.setEntries(list); return next;
  },

  // submits
  submits() { return read(K.submits, []); },
  isSubmitted(userId, period, periodKey) {
    return this.submits().find((s) => s.userId === userId && s.period === period && s.periodKey === periodKey);
  },
  submitPeriod(userId, period, periodKey) {
    if (this.isSubmitted(userId, period, periodKey)) return null;
    const list = this.submits();
    const sub = { userId, period, periodKey, submittedAt: Date.now(), bonus: POINTS.submitBonus[period] };
    list.push(sub); write(K.submits, list);
    // lock entries
    const entries = this.entries();
    entries.forEach((e) => {
      if (e.userId === userId && e.period === period && e.periodKey === periodKey) e.submittedAt = sub.submittedAt;
    });
    this.setEntries(entries);
    return sub;
  },
  unsubmitPeriod(userId, period, periodKey) {
    const list = this.submits().filter((s) => !(s.userId === userId && s.period === period && s.periodKey === periodKey));
    write(K.submits, list);
    const entries = this.entries();
    entries.forEach((e) => {
      if (e.userId === userId && e.period === period && e.periodKey === periodKey) e.submittedAt = null;
    });
    this.setEntries(entries);
  },

  // files
  files() { return read(K.files, []); },
  addFile(meta) {
    const list = this.files();
    const f = { id: uid(), uploadedAt: Date.now(), ...meta };
    list.push(f); write(K.files, list); return f;
  },
  removeFile(id) { write(K.files, this.files().filter((f) => f.id !== id)); },
  filesByIds(ids = []) { const set = new Set(ids); return this.files().filter((f) => set.has(f.id)); },

  // helpers
  uid,
  K,
};

// Pre-seed
seedTeamUsers();

// ----- analytics helpers used by api modules -----
export function computeStatsForUser(userId) {
  const all = store.entries().filter((e) => e.userId === userId);
  const submits = store.submits().filter((s) => s.userId === userId);
  const files = store.files().filter((f) => f.userId === userId);
  const completed = all.filter((e) => e.completed).length;
  const xpFromEntries = all.reduce((s, e) => s + (e.pointsEarned || 0), 0);
  const xpFromSubs = submits.reduce((s, x) => s + (x.bonus || 0), 0);
  const totalXp = xpFromEntries + xpFromSubs;

  // streaks (daily)
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const dk = todayKey(addDays(new Date(), -i));
    const todays = all.filter((e) => e.period === "daily" && e.periodKey === dk);
    if (!todays.length) break;
    const acts = activitiesFor(store.userById(userId)?.role || "Supervisor", "daily");
    const done = todays.filter((e) => e.completed).length;
    if (done >= Math.max(1, Math.ceil(acts.length * 0.5))) streak++;
    else break;
  }

  const cats = new Set();
  all.forEach((e) => {
    const acts = activitiesFor(e.role, e.period);
    const a = acts.find((x) => x.key === e.activityKey);
    if (e.completed && a) cats.add(a.category);
  });

  // perfect days
  const byDay = new Map();
  all.filter((e) => e.period === "daily").forEach((e) => {
    if (!byDay.has(e.periodKey)) byDay.set(e.periodKey, []);
    byDay.get(e.periodKey).push(e);
  });
  let perfectDays = 0;
  byDay.forEach((arr) => {
    if (arr.length && arr.every((e) => e.completed)) perfectDays++;
  });

  return {
    totalXp,
    completed,
    currentStreak: streak,
    daysSubmitted: submits.filter((s) => s.period === "daily").length,
    weeksSubmitted: submits.filter((s) => s.period === "weekly").length,
    monthsSubmitted: submits.filter((s) => s.period === "monthly").length,
    filesUploaded: files.length,
    perfectDays,
    perfectWeeks: Math.floor(perfectDays / 5),
    complianceMonths: 0,
    categoriesTouched: cats.size,
    level: 1, // filled in by levelFromXp at consumer
  };
}

export function currentPeriodKeys() {
  return {
    daily: todayKey(),
    weekly: isoWeekKey(),
    monthly: monthKey(),
  };
}
