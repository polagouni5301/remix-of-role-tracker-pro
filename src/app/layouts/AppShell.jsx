import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth.jsx";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "@/api/stats.js";
import XpHeaderCard from "@/components/stats/XpHeaderCard.jsx";
import { Button } from "@/components/ui/button";
import { LogOut, Volume2, Sparkles, ShieldCheck } from "lucide-react";
import { ROLES } from "@/mock/roles.js";

const TABS = [
  { to: "/app/daily", label: "Daily" },
  { to: "/app/weekly", label: "Weekly" },
  { to: "/app/monthly", label: "Monthly" },
  { to: "/app/badges", label: "Badges" },
  { to: "/app/me", label: "My Stats" },
  { to: "/app/history", label: "History" },
];

export default function AppShell() {
  const { user, signOut, isAdmin } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (user?.role) document.documentElement.setAttribute("data-role", user.role);
    return () => document.documentElement.removeAttribute("data-role");
  }, [user?.role]);

  const summary = useQuery({ queryKey: ["me", "summary", user?.id], queryFn: () => getSummary(user.id), enabled: !!user });

  if (!user) return null;
  const role = ROLES[user.role];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/app/daily" className="flex items-center gap-2">
            <div className="role-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold shadow">R</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">R&R Tracker</div>
              <div className="text-[11px] text-muted-foreground">Roles &amp; Responsibilities</div>
            </div>
          </Link>
          <span className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium">
            <span className="role-gradient h-2 w-2 rounded-full" />
            {role?.short || user.role}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium leading-tight">{user.name}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{user.pod || user.email}</div>
            </div>
            <Button variant="ghost" size="icon" title="Sound (placeholder)"><Volume2 className="h-4 w-4" /></Button>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => nav("/admin")}>
                <ShieldCheck className="mr-1.5 h-4 w-4" /> Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav("/login"); }}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
        <XpHeaderCard summary={summary.data} loading={summary.isLoading} />

        <div className="surface-elevated rounded-2xl p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Sparkles className="h-5 w-5 text-role-1" />
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Mission today:</span> own delivery, ship evidence, keep your streak alive.
            </p>
            {summary.data && (
              <span className="ml-auto text-xs text-muted-foreground">
                {summary.data.todayCompleted}/{summary.data.todayTotal} daily tasks done
              </span>
            )}
          </div>
        </div>

        <nav className="surface rounded-2xl p-1.5 flex flex-wrap gap-1">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium rounded-xl transition ${
                  isActive ? "role-gradient text-white shadow" : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
