import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth.jsx";
import { listHistory, unsubmitPeriod } from "@/api/checklist.js";
import { PageHeader, LoadingState } from "@/components/feedback/index.jsx";
import { DataTable } from "@/components/tables/DataTable.jsx";
import { Button } from "@/components/ui/button";
import ProgressPill from "@/components/stats/ProgressPill.jsx";
import { pct as pctFn, fmtRelative } from "@/lib/format.js";

const TABS = ["daily", "weekly", "monthly"];

export default function HistoryPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [period, setPeriod] = useState("daily");
  const q = useQuery({ queryKey: ["history", user.id, period], queryFn: () => listHistory(user.id, period) });
  const unsub = useMutation({
    mutationFn: ({ p, k }) => unsubmitPeriod(user.id, p, k),
    onSuccess: () => { toast.success("Reopened"); qc.invalidateQueries({ queryKey: ["history", user.id] }); },
  });

  return (
    <section className="space-y-5">
      <PageHeader title="History" subtitle="Every period you've worked on." />
      <div className="inline-flex rounded-xl bg-secondary p-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setPeriod(t)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize ${period === t ? "bg-card shadow" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>
      {q.isLoading ? <LoadingState /> : (
        <DataTable
          rows={q.data}
          columns={[
            { key: "periodKey", label: "Period" },
            { key: "done", label: "Completion", render: (r) => <ProgressPill value={pctFn(r.done, r.total)} /> },
            { key: "activities", label: "Activities", render: (r) => `${r.done}/${r.total}` },
            { key: "points", label: "Points", render: (r) => r.points.toLocaleString() },
            { key: "status", label: "Status", render: (r) => r.submittedAt ? <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">Submitted</span> : <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">Draft</span> },
            { key: "submittedAt", label: "When", render: (r) => fmtRelative(r.submittedAt) },
            {
              key: "actions", label: "", render: (r) => r.submittedAt ? (
                <Button size="sm" variant="ghost" onClick={() => unsub.mutate({ p: r.period, k: r.periodKey })}>Unsubmit</Button>
              ) : null,
            },
          ]}
          empty="No periods yet"
        />
      )}
    </section>
  );
}
