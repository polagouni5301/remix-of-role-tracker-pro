import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

function CountUp({ value }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    const n = Math.round(v);
    return typeof value === "string" && value.includes(",") ? n.toLocaleString() : n.toString();
  });
  useEffect(() => {
    const num = typeof value === "number" ? value : parseFloat(String(value).replace(/[^\d.-]/g, "")) || 0;
    const controls = animate(mv, num, { duration: 0.9, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

export default function KpiCard({ label, value, hint, tone = "default", className }) {
  const numeric = typeof value === "number" || (typeof value === "string" && /^[\d,]+$/.test(value));
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn("surface-elevated rounded-2xl p-4 relative overflow-hidden group", className)}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full role-gradient opacity-0 blur-2xl transition-opacity group-hover:opacity-20" />
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn(
        "mt-1 text-2xl font-bold tabular-nums",
        tone === "accent" && "role-text",
      )}>
        {numeric ? <CountUp value={value} /> : value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}
