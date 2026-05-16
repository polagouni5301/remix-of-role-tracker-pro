import { cn } from "@/lib/utils";

export default function KpiCard({ label, value, hint, tone = "default", className }) {
  return (
    <div className={cn("surface-elevated rounded-2xl p-4", className)}>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn(
        "mt-1 text-2xl font-bold tabular-nums",
        tone === "accent" && "role-text",
      )}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
