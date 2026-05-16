import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth.jsx";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "@/api/stats.js";
import XpHeaderCard from "@/components/stats/XpHeaderCard.jsx";
import { Button } from "@/components/ui/button";
import { LogOut, Sparkles, ShieldCheck } from "lucide-react";
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
  const location = useLocation();
  useEffect(() => {
    if (user?.role) document.documentElement.setAttribute("data-role", user.role);
    return () => document.documentElement.removeAttribute("data-role");
  }, [user?.role]);

  const summary = useQuery({ queryKey: ["me", "summary", user?.id], queryFn: () => getSummary(user.id), enabled: !!user });

  if (!user) return null;
  const role = ROLES[user.role];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/app/daily" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="role-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold shadow-lg"
            >R</motion.div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">R&amp;R Tracker</div>
              <div className="text-[11px] text-muted-foreground">Roles &amp; Responsibilities</div>
            </div>
          </Link>
          <motion.span
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium shadow-sm"
          >
            <span className="role-gradient h-2 w-2 rounded-full" />
            {role?.short || user.role}
          </motion.span>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium leading-tight">{user.name}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{user.pod || user.email}</div>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => nav("/admin")} className="hover:border-foreground/30">
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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="surface-elevated rounded-2xl p-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
              <Sparkles className="h-5 w-5" style={{ color: "var(--role-c1)" }} />
            </motion.div>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Mission today:</span> own delivery, ship evidence, keep your streak alive.
            </p>
            {summary.data && (
              <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                {summary.data.todayCompleted}/{summary.data.todayTotal} daily tasks done
              </span>
            )}
          </div>
        </motion.div>

        <nav className="surface rounded-2xl p-1.5 flex flex-wrap gap-1 relative">
          {TABS.map((t) => {
            const active = location.pathname === t.to;
            return (
              <NavLink
                key={t.to}
                to={t.to}
                className="relative px-3.5 py-2 text-sm font-medium rounded-xl transition focus:outline-none"
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 role-gradient rounded-xl shadow-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${active ? "text-white" : "text-muted-foreground hover:text-foreground"}`}>
                  {t.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <Outlet />
      </main>
    </div>
  );
}
