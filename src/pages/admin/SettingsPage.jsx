import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/api/admin.js";
import KpiCard from "@/components/stats/KpiCard.jsx";
import { PageHeader, LoadingState } from "@/components/feedback/index.jsx";
import { Button } from "@/components/ui/button";
import { bytes } from "@/lib/format.js";
import { Database, Download, FileJson, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const q = useQuery({ queryKey: ["admin", "settings"], queryFn: getSettings });
  if (q.isLoading) return <LoadingState />;
  const s = q.data;
  return (
    <section className="space-y-5">
      <PageHeader title="Platform settings" subtitle="Read-only program stats and exports." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Environment" value={s.env} />
        <KpiCard label="Total users" value={s.totalUsers} />
        <KpiCard label="Total entries" value={s.totalEntries.toLocaleString()} />
        <KpiCard label="Total files" value={s.totalFiles} />
        <KpiCard label="Storage used" value={bytes(s.totalStorage)} />
        <KpiCard label="Total XP" value={s.totalXp.toLocaleString()} />
        <KpiCard label="Today" value={s.today} />
        <KpiCard label="Badges unlocked" value={s.totalBadges} />
      </div>
      <div className="surface-elevated rounded-2xl p-4">
        <h3 className="mb-3 text-sm font-semibold">Data actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><FileJson className="mr-1.5 h-4 w-4" /> Export JSON</Button>
          <Button variant="outline"><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>
          <Button variant="outline"><Database className="mr-1.5 h-4 w-4" /> Backup</Button>
          <Button variant="outline"><SettingsIcon className="mr-1.5 h-4 w-4" /> Admin settings</Button>
        </div>
      </div>
    </section>
  );
}
