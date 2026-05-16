import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function BadgeCard({ badge }) {
  const earned = badge.earned;
  return (
    <div className={cn(
      "rounded-2xl border p-4 transition",
      earned ? "border-transparent role-ring bg-card" : "border-border bg-card/60",
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl text-2xl",
          earned ? "role-gradient text-white shadow" : "bg-secondary text-muted-foreground grayscale",
        )}>{badge.emoji}</div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight truncate">{badge.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-2">{badge.desc}</div>
        </div>
        {earned && <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">Earned</span>}
      </div>
      <div className="mt-3">
        <Progress value={badge.pct} className="h-1.5" />
        <div className="mt-1 text-[11px] text-muted-foreground tabular-nums">{Math.min(badge.value, badge.target)} / {badge.target}</div>
      </div>
    </div>
  );
}
