import { cn } from "@/lib/utils";
export function DataTable({ columns, rows, empty = "No rows", onRowClick }) {
  return (
    <div className="surface-elevated overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={cn("px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", c.className)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-3 py-10 text-center text-sm text-muted-foreground">{empty}</td></tr>
            ) : rows.map((r, i) => (
              <tr
                key={r.id || i}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                className={cn("border-t border-border/60", onRowClick && "cursor-pointer hover:bg-accent/40")}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2.5 align-middle", c.cellClassName)}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
