import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth.jsx";
import { useQuery } from "@tanstack/react-query";
import { getKpis } from "@/api/admin.js";
import { Button } from "@/components/ui/button";
import { Download, LogOut, Settings, ShieldCheck } from "lucide-react";
import KpiCard from "@/components/stats/KpiCard.jsx";

const TABS = [
  { to: "/admin/team", label: "Team Overview" },
  { to: "/admin/leaderboard", label: "Leaderboard" },
  { to: "/admin/trends", label: "Trends" },
  { to: "/admin/files", label: "Audit Files" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminShell() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  useEffect(() => { document.documentElement.setAttribute("data-role", "Manager"); }, []);
  const kpisQ = useQuery({ queryKey: ["admin", "kpis"], queryFn: getKpis });
  const k = kpisQ.data;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/admin/team" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold shadow">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Admin Console</div>
              <div className="text-[11px] text-muted-foreground">Operations governance</div>
            </div>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <Button variant="outline" size="sm" onClick={() => nav("/admin/settings")}><Settings className="mr-1.5 h-4 w-4" /> Settings</Button>
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav("/login"); }}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-amber-500/10 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "Admin"}</h1>
              <p className="text-sm text-muted-foreground">Track team productivity, audit evidence, and steer the program.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard label="Total users" value={k?.totalUsers ?? "—"} />
          <KpiCard label="Activities completed" value={k?.totalCompleted ?? "—"} />
          <KpiCard label="Evidence files" value={k?.totalFiles ?? "—"} />
          <KpiCard label="Total XP" value={k?.totalXp?.toLocaleString?.() ?? "—"} />
        </div>

        <nav className="surface rounded-2xl p-1.5 flex flex-wrap gap-1">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium rounded-xl transition ${
                  isActive ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </main>
    </div>
  );
}
