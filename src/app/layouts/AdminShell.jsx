import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
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
  const location = useLocation();
  useEffect(() => { document.documentElement.setAttribute("data-role", "Manager"); }, []);
  const kpisQ = useQuery({ queryKey: ["admin", "kpis"], queryFn: getKpis });
  const k = kpisQ.data;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/admin/team" className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: -6, scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-bold shadow-lg">
              <ShieldCheck className="h-4 w-4" />
            </motion.div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Admin Console</div>
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
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 mesh-bg opacity-50" />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Operations governance</div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(" ")[0] || "Admin"}</h1>
              <p className="text-sm text-muted-foreground">Track team productivity, audit evidence, and steer the program.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Total users", v: k?.totalUsers ?? "—" },
            { label: "Activities completed", v: k?.totalCompleted ?? "—" },
            { label: "Evidence files", v: k?.totalFiles ?? "—" },
            { label: "Total XP", v: k?.totalXp?.toLocaleString?.() ?? "—" },
          ].map((x) => (
            <motion.div key={x.label} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
              <KpiCard label={x.label} value={x.v} />
            </motion.div>
          ))}
        </motion.div>

        <nav className="surface rounded-2xl p-1.5 flex flex-wrap gap-1 relative">
          {TABS.map((t) => {
            const active = location.pathname.startsWith(t.to);
            return (
              <NavLink key={t.to} to={t.to} className="relative px-3.5 py-2 text-sm font-medium rounded-xl">
                {active && (
                  <motion.span layoutId="admin-nav-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className={`relative z-10 ${active ? "text-white" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <Outlet />
      </main>
    </div>
  );
}
