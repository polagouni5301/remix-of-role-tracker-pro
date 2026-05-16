import { cn } from "@/lib/utils";
export default function ProgressPill({ value = 0, label }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div className={cn("h-full role-gradient transition-all")} style={{ width: `${v}%` }} />
      </div>
      <div className="text-xs font-medium tabular-nums text-muted-foreground w-9 text-right">{v}%</div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}
