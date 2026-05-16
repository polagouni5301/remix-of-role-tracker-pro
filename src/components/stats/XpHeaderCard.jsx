import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { initials } from "@/lib/format.js";
import { Progress } from "@/components/ui/progress";
import { LEVELS } from "@/lib/levels.js";

function CountUp({ value }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v).toLocaleString());
  useEffect(() => {
    const ctrl = animate(mv, value || 0, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return ctrl.stop;
  }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

export default function XpHeaderCard({ summary, loading }) {
  if (loading || !summary) {
    return <div className="surface-elevated h-36 animate-pulse rounded-2xl" />;
  }
  const next = LEVELS.find((l) => l.lvl === summary.level + 1);
  const pct = Math.round((summary.levelProgress || 0) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="role-ring relative overflow-hidden rounded-2xl bg-card p-5 sm:p-6"
    >
      <div className="absolute inset-0 -z-10 opacity-[.08] role-gradient" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,var(--role-c1),transparent_70%)] opacity-30 blur-2xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="flex flex-wrap items-center gap-5">
        <motion.div
          initial={{ scale: 0.6, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="role-gradient flex h-16 w-16 items-center justify-center rounded-2xl text-white text-xl font-bold shadow-lg"
        >
          {initials(summary.user?.name)}
        </motion.div>
        <div className="min-w-[200px]">
          <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Level {summary.level} · {summary.levelTitle}</div>
          <div className="text-3xl font-bold leading-tight tabular-nums">
            <CountUp value={summary.totalXp} /> <span className="text-base font-medium text-muted-foreground">XP</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {next ? <>{summary.toNext} XP to <span className="font-medium text-foreground">{next.title}</span> {next.emoji}</> : "Max level reached ✨"}
          </div>
        </div>
        <div className="flex-1 min-w-[220px]">
          <div className="relative">
            <Progress value={pct} className="h-2.5" />
            <div className="absolute inset-0 rounded-full shimmer opacity-50 mix-blend-overlay" />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-3 text-center">
            <Stat label="Streak" value={`${summary.currentStreak}🔥`} />
            <Stat label="Today done" value={`${summary.todayCompleted}/${summary.todayTotal}`} />
            <Stat label="Points today" value={summary.pointsToday} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
function Stat({ label, value }) {
  return (
    <motion.div whileHover={{ y: -1 }} className="rounded-xl bg-secondary/60 px-2 py-2">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </motion.div>
  );
}
