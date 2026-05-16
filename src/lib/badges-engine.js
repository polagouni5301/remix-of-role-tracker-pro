export const BADGES = [
  { key: "first_step", emoji: "👣", name: "First Step", desc: "Complete your very first task.", target: 1 },
  { key: "ten_tasks", emoji: "🎯", name: "Ten in the Bag", desc: "Complete 10 activities.", target: 10 },
  { key: "fifty_tasks", emoji: "🎯", name: "Half Century", desc: "Complete 50 activities.", target: 50 },
  { key: "streak_3", emoji: "🔥", name: "Streak Starter", desc: "3-day daily streak.", target: 3 },
  { key: "streak_7", emoji: "🔥", name: "On Fire", desc: "7-day daily streak.", target: 7 },
  { key: "streak_30", emoji: "🌋", name: "Inferno", desc: "30-day daily streak. Legendary.", target: 30 },
  { key: "perfect_day", emoji: "⭐", name: "Perfect Day", desc: "100% on a daily checklist.", target: 1 },
  { key: "perfect_5", emoji: "🌟", name: "Five Star Week", desc: "Five perfect days in a single week.", target: 1 },
  { key: "evidence_25", emoji: "📁", name: "Evidence Champion", desc: "Upload 25 evidence files.", target: 25 },
  { key: "submit_5", emoji: "✅", name: "Closer", desc: "Submit 5 days.", target: 5 },
  { key: "weekly_4", emoji: "🗓️", name: "Weekly Warrior", desc: "Submit 4 weeks.", target: 4 },
  { key: "monthly_2", emoji: "📆", name: "Monthly Master", desc: "Submit 2 months.", target: 2 },
  { key: "compliance_hero", emoji: "🛡️", name: "Compliance Hero", desc: "Complete every evidence-required activity in a calendar month.", target: 1 },
  { key: "level_5", emoji: "🥈", name: "Skilled Status", desc: "Reach Level 5.", target: 5 },
  { key: "level_8", emoji: "🏆", name: "Hero Status", desc: "Reach Level 8.", target: 8 },
  { key: "level_10", emoji: "👑", name: "Living Legend", desc: "Reach Level 10.", target: 10 },
  { key: "all_categories", emoji: "🎨", name: "Well Rounded", desc: "Complete at least one task in 8+ categories.", target: 8 },
  { key: "thousand_pts", emoji: "💎", name: "Four-Digit Club", desc: "Earn 1,000 lifetime XP.", target: 1000 },
];

export function badgeProgress(badge, stats) {
  const map = {
    first_step: stats.completed,
    ten_tasks: stats.completed,
    fifty_tasks: stats.completed,
    streak_3: stats.currentStreak,
    streak_7: stats.currentStreak,
    streak_30: stats.currentStreak,
    perfect_day: stats.perfectDays,
    perfect_5: stats.perfectWeeks,
    evidence_25: stats.filesUploaded,
    submit_5: stats.daysSubmitted,
    weekly_4: stats.weeksSubmitted,
    monthly_2: stats.monthsSubmitted,
    compliance_hero: stats.complianceMonths,
    level_5: stats.level,
    level_8: stats.level,
    level_10: stats.level,
    all_categories: stats.categoriesTouched,
    thousand_pts: stats.totalXp,
  };
  const value = map[badge.key] ?? 0;
  return { value, target: badge.target, earned: value >= badge.target, pct: Math.min(100, Math.round((value / badge.target) * 100)) };
}
