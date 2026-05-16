import { useQuery } from "@tanstack/react-query";
import { getAnalyticsTrends } from "@/api/admin.js";
import { LineCard, BarCard } from "@/components/charts/TrendChartCard.jsx";
import { LoadingState, PageHeader } from "@/components/feedback/index.jsx";

export default function TrendsPage() {
  const q = useQuery({ queryKey: ["admin", "trends"], queryFn: getAnalyticsTrends });
  if (q.isLoading) return <LoadingState />;
  return (
    <section className="space-y-5">
      <PageHeader title="Productivity trends" subtitle="Program-wide momentum across the last 30 days." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LineCard title="Daily completion %" data={q.data.dailyPct} />
        <BarCard title="Completion % by role" data={q.data.roleCompletion} dataKey="pct" xKey="role" />
        <BarCard title="Evidence files per week" data={q.data.weeklyFiles} dataKey="files" xKey="week" />
        <BarCard title="XP earned per week" data={q.data.weeklyXp} dataKey="xp" xKey="week" />
      </div>
    </section>
  );
}
