import { Inbox, AlertTriangle, Loader2 } from "lucide-react";
export function EmptyState({ title = "Nothing here yet", desc, icon: Icon = Inbox, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {desc && <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="mx-auto h-5 w-5 text-destructive" />
      <h3 className="mt-2 text-base font-semibold">Something went wrong</h3>
      <p className="text-sm text-muted-foreground">{error?.message || "Please try again."}</p>
      {onRetry && <button onClick={onRetry} className="mt-3 rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">Retry</button>}
    </div>
  );
}
export function LoadingState({ label = "Loading…", rows = 4 }) {
  return (
    <div className="space-y-3" aria-busy>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" /> {label}</div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-secondary/50" />
      ))}
    </div>
  );
}
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
