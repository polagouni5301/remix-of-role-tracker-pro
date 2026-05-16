import { motion } from "framer-motion";
import { Inbox, AlertTriangle, Loader2 } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", desc, icon: Icon = Inbox, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -8 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground"
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      <h3 className="text-base font-semibold">{title}</h3>
      {desc && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
export function ErrorState({ error, onRetry }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-5 w-5 text-destructive" />
      <h3 className="mt-2 text-base font-semibold">Something went wrong</h3>
      <p className="text-sm text-muted-foreground">{error?.message || "Please try again."}</p>
      {onRetry && <button onClick={onRetry} className="mt-3 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent transition">Retry</button>}
    </motion.div>
  );
}
export function LoadingState({ label = "Loading…", rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> {label}</div>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
          className="h-20 rounded-2xl bg-secondary/50"
        />
      ))}
    </div>
  );
}
export function PageHeader({ title, subtitle, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-wrap items-end justify-between gap-3"
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
