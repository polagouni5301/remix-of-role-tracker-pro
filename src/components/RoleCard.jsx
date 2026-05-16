import { cn } from "@/lib/utils";
import { ROLES } from "@/mock/roles.js";

export default function RoleCard({ roleKey, selected, onClick }) {
  const r = ROLES[roleKey];
  return (
    <button
      type="button"
      data-role={roleKey}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-4 text-left transition",
        selected ? "border-transparent role-ring -translate-y-0.5" : "border-border hover:border-foreground/20 hover:-translate-y-0.5"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-[.10] role-gradient" />
      <div className="flex items-center gap-3">
        <div className="role-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shadow">
          {r.icon}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{r.short}</div>
          <div className="text-[11px] text-muted-foreground line-clamp-1">{r.title}</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{r.purpose}</p>
    </button>
  );
}
