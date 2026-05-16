import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function BadgeCard({ badge }) {
  const earned = badge.earned;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition",
        earned ? "border-transparent role-ring bg-card" : "border-border bg-card/60",
      )}
    >
      {earned && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[radial-gradient(closest-side,var(--role-c1),transparent_70%)] opacity-50 blur-xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="flex items-center gap-3">
        <motion.div
          initial={false}
          animate={earned ? { rotate: [0, -8, 8, 0] } : {}}
          transition={{ duration: 0.6 }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
            earned ? "role-gradient text-white shadow-lg" : "bg-secondary text-muted-foreground grayscale",
          )}
        >{badge.emoji}</motion.div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight truncate">{badge.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">{badge.desc}</div>
        </div>
        {earned && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 16 }}
            className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success"
          >
            Earned
          </motion.span>
        )}
      </div>
      <div className="mt-3">
        <Progress value={badge.pct} className="h-1.5" />
        <div className="mt-1 text-[11px] text-muted-foreground tabular-nums">{Math.min(badge.value, badge.target)} / {badge.target}</div>
      </div>
    </motion.div>
  );
}
