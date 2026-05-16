import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { teamOverview } from "@/api/admin.js";
import { PageHeader, LoadingState } from "@/components/feedback/index.jsx";
import { DataTable } from "@/components/tables/DataTable.jsx";
import { Input } from "@/components/ui/input";
import ProgressPill from "@/components/stats/ProgressPill.jsx";
import { ROLE_LIST } from "@/lib/role-themes.js";

export default function TeamPage() {
  const nav = useNavigate();
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const q = useQuery({ queryKey: ["admin", "team", role, search], queryFn: () => teamOverview({ role, search }) });
  return (
    <section className="space-y-5">
      <PageHeader title="Team Overview" subtitle="Productivity across your operations team." />
      <div className="flex flex-wrap gap-2">
        <select value={role} onChange={(e) => setRole(e.target.value)} className="h-9 rounded-lg border border-input bg-card px-3 text-sm">
          <option value="">All roles</option>
          {ROLE_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <Input placeholder="Search name, email, pod…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-[260px]" />
      </div>
      {q.isLoading ? <LoadingState /> : (
        <DataTable
          onRowClick={(r) => nav(`/admin/users/${r.id}`)}
          rows={q.data}
          columns={[
            { key: "name", label: "User", render: (r) => <div><div className="font-medium">{r.name}</div><div className="text-[11px] text-muted-foreground">{r.email}</div></div> },
            { key: "role", label: "Role" },
            { key: "level", label: "Level", render: (r) => `${r.levelEmoji} ${r.level}` },
            { key: "streak", label: "Streak", render: (r) => `${r.streak}🔥` },
            { key: "daily", label: "Daily", render: (r) => <ProgressPill value={r.daily} /> },
            { key: "weekly", label: "Weekly", render: (r) => <ProgressPill value={r.weekly} /> },
            { key: "monthly", label: "Monthly", render: (r) => <ProgressPill value={r.monthly} /> },
            { key: "overall", label: "Overall", render: (r) => <span className="font-semibold tabular-nums">{r.overall}%</span> },
            { key: "files", label: "Files" },
          ]}
        />
      )}
    </section>
  );
}
