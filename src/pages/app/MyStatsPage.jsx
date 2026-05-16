import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.jsx";
import { getSummary, getTrends, getCategoryCoverage } from "@/api/stats.js";
import KpiCard from "@/components/stats/KpiCard.jsx";
import { LineCard, BarCard, StreakCard, CategoryCard } from "@/components/charts/TrendChartCard.jsx";
import { LoadingState, PageHeader } from "@/components/feedback/index.jsx";

export default function MyStatsPage() {
  const { user } = useAuth();
  const sQ = useQuery({ queryKey: ["me", "summary", user.id], queryFn: () => getSummary(user.id) });
  const tQ = useQuery({ queryKey: ["me", "trends", user.id], queryFn: () => getTrends(user.id, "30d") });
  const cQ = useQuery({ queryKey: ["me", "cats", user.id], queryFn: () => getCategoryCoverage(user.id) });
  if (sQ.isLoading || tQ.isLoading || cQ.isLoading) return <LoadingState rows={6} />;
  const s = sQ.data;
  const recent7 = tQ.data.trend.slice(-7);
  const recent30 = tQ.data.trend;
  const avg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b.pct, 0) / arr.length) : 0;
  return (
    <section className="space-y-5">
      <PageHeader title="My Stats" subtitle="Your productivity, momentum and coverage." />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total XP" value={s.totalXp.toLocaleString()} tone="accent" />
        <KpiCard label="Productivity" value={`${s.productivity}%`} />
        <KpiCard label="Today" value={`${s.todayCompleted}/${s.todayTotal}`} />
        <KpiCard label="7-day avg" value={`${avg(recent7)}%`} />
        <KpiCard label="30-day avg" value={`${avg(recent30)}%`} />
        <KpiCard label="Current streak" value={`${s.currentStreak}🔥`} />
        <KpiCard label="Badges progress" value={s.completed} hint="activities completed" />
        <KpiCard label="Files uploaded" value={s.filesUploaded} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LineCard title="30-day completion trend" data={tQ.data.trend} />
        <CategoryCard title="Activity coverage by category" data={cQ.data} />
        <BarCard title="Weekly points" data={tQ.data.weekly} dataKey="points" xKey="week" />
        <StreakCard title="Streak history" data={tQ.data.streakHistory} />
      </div>
    </section>
  );
}
