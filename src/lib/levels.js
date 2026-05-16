export const LEVELS = [
  { lvl: 1, title: "Rookie", min: 0, emoji: "🌱" },
  { lvl: 2, title: "Apprentice", min: 100, emoji: "🎒" },
  { lvl: 3, title: "Operator", min: 300, emoji: "🛠️" },
  { lvl: 4, title: "Achiever", min: 600, emoji: "🚀" },
  { lvl: 5, title: "Skilled", min: 1100, emoji: "🥈" },
  { lvl: 6, title: "Expert", min: 1900, emoji: "💎" },
  { lvl: 7, title: "Champion", min: 3200, emoji: "🥇" },
  { lvl: 8, title: "Hero", min: 5500, emoji: "🏆" },
  { lvl: 9, title: "Master", min: 9000, emoji: "👑" },
  { lvl: 10, title: "Legend", min: 15000, emoji: "🌟" },
];

export function levelFromXp(xp = 0) {
  let cur = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) cur = l;
  const next = LEVELS.find((l) => l.min > xp);
  const into = xp - cur.min;
  const span = next ? next.min - cur.min : 1;
  return {
    ...cur,
    next,
    progress: next ? Math.min(1, into / span) : 1,
    toNext: next ? next.min - xp : 0,
  };
}
