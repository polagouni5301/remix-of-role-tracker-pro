import { initials } from "@/lib/format.js";
import { Link } from "react-router-dom";

export default function LeaderboardCard({ title, rows, metricLabel, metricKey, emoji }) {
  return (
    <div className="surface-elevated rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{emoji} {title}</h3>
        <span className="text-[11px] text-muted-foreground">{metricLabel}</span>
      </div>
      <ol className="space-y-2">
        {rows.slice(0, 8).map((r, i) => (
          <li key={r.id}>
            <Link to={`/admin/users/${r.id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent/40">
              <span className="w-5 text-center text-xs font-bold text-muted-foreground tabular-nums">{i + 1}</span>
              <div data-role={r.role} className="role-gradient flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white">
                {initials(r.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{r.name}</div>
                <div className="truncate text-[11px] text-muted-foreground">{r.role} · {r.pod || "—"}</div>
              </div>
              <div className="text-sm font-semibold tabular-nums">{r[metricKey]?.toLocaleString?.() ?? r[metricKey]}</div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
