import { initials } from "@/lib/format.js";
import { Progress } from "@/components/ui/progress";
import { LEVELS } from "@/lib/levels.js";

export default function XpHeaderCard({ summary, loading }) {
  if (loading || !summary) {
    return <div className="surface-elevated h-32 animate-pulse rounded-2xl" />;
  }
  const next = LEVELS.find((l) => l.lvl === summary.level + 1);
  return (
    <div className="role-ring relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6">
      <div className="absolute inset-0 -z-10 opacity-[.08] role-gradient" />
      <div className="flex flex-wrap items-center gap-5">
        <div className="role-gradient flex h-16 w-16 items-center justify-center rounded-2xl text-white text-xl font-bold shadow-lg">
          {initials(summary.user?.name)}
        </div>
        <div className="min-w-[180px]">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Level {summary.level} · {summary.levelTitle}</div>
          <div className="text-2xl font-bold leading-tight">{summary.totalXp.toLocaleString()} XP</div>
          <div className="text-xs text-muted-foreground">
            {next ? `${summary.toNext} XP to ${next.title} ${next.emoji}` : "Max level reached"}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <Progress value={Math.round((summary.levelProgress || 0) * 100)} className="h-2.5" />
          <div className="mt-2 grid grid-cols-3 gap-3 text-center">
            <Stat label="Streak" value={`${summary.currentStreak}🔥`} />
            <Stat label="Today done" value={`${summary.todayCompleted}/${summary.todayTotal}`} />
            <Stat label="Points today" value={summary.pointsToday} />
          </div>
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-secondary/60 px-2 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
