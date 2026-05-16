import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, getUserHistory, getUserFiles, listUsers } from "@/api/admin.js";
import { PageHeader, LoadingState } from "@/components/feedback/index.jsx";
import KpiCard from "@/components/stats/KpiCard.jsx";
import { DataTable } from "@/components/tables/DataTable.jsx";
import ProgressPill from "@/components/stats/ProgressPill.jsx";
import { bytes, fmtRelative, initials, pct as pctFn } from "@/lib/format.js";

export default function UserPage() {
  const { userId } = useParams();
  const nav = useNavigate();
  const uQ = useQuery({ queryKey: ["admin", "user", userId], queryFn: () => getUser(userId) });
  const hQ = useQuery({ queryKey: ["admin", "user", userId, "history"], queryFn: () => getUserHistory(userId) });
  const fQ = useQuery({ queryKey: ["admin", "user", userId, "files"], queryFn: () => getUserFiles(userId) });
  const listQ = useQuery({ queryKey: ["admin", "users"], queryFn: listUsers });
  if (uQ.isLoading) return <LoadingState />;
  const { user, row } = uQ.data;
  return (
    <section className="space-y-5">
      <PageHeader title="User drill-down" subtitle="Productivity, history and evidence for a single user." actions={
        <select value={userId} onChange={(e) => nav(`/admin/users/${e.target.value}`)} className="h-9 rounded-lg border border-input bg-card px-3 text-sm">
          {(listQ.data || []).map((u) => <option key={u.id} value={u.id}>{u.name} · {u.role}</option>)}
        </select>
      } />

      <div data-role={user.role} className="role-ring flex flex-wrap items-center gap-4 rounded-2xl bg-card p-5">
        <div className="role-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white text-lg font-bold">{initials(user.name)}</div>
        <div>
          <div className="text-lg font-bold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email} · {user.role} · {user.pod || "—"}</div>
        </div>
        <div className="ml-auto text-right text-sm">
          <div className="font-semibold">{row.levelEmoji} Level {row.level} · {row.levelTitle}</div>
          <div className="text-muted-foreground">{row.xp.toLocaleString()} XP · {row.streak}🔥</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Daily" value={`${row.daily}%`} />
        <KpiCard label="Weekly" value={`${row.weekly}%`} />
        <KpiCard label="Monthly" value={`${row.monthly}%`} />
        <KpiCard label="Files" value={row.files} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Recent history</h3>
          {hQ.isLoading ? <LoadingState rows={3} /> : (
            <DataTable rows={hQ.data} columns={[
              { key: "period", label: "Period", render: (r) => <span className="capitalize">{r.period}</span> },
              { key: "periodKey", label: "Key" },
              { key: "done", label: "Done", render: (r) => <ProgressPill value={pctFn(r.done, r.total)} /> },
              { key: "points", label: "XP" },
              { key: "submittedAt", label: "Submitted", render: (r) => fmtRelative(r.submittedAt) },
            ]} />
          )}
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">Recent files</h3>
          {fQ.isLoading ? <LoadingState rows={3} /> : (
            <DataTable rows={fQ.data} columns={[
              { key: "fileName", label: "File" },
              { key: "activityKey", label: "Activity" },
              { key: "period", label: "Period", render: (r) => `${r.period} · ${r.periodKey}` },
              { key: "size", label: "Size", render: (r) => bytes(r.size) },
              { key: "uploadedAt", label: "When", render: (r) => fmtRelative(r.uploadedAt) },
            ]} />
          )}
        </div>
      </div>
    </section>
  );
}
