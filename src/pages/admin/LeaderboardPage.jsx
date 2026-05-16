import { useQuery } from "@tanstack/react-query";
import { leaderboards } from "@/api/admin.js";
import LeaderboardCard from "@/components/tables/LeaderboardCard.jsx";
import { LoadingState, PageHeader } from "@/components/feedback/index.jsx";

export default function LeaderboardPage() {
  const q = useQuery({ queryKey: ["admin", "leaderboards"], queryFn: leaderboards });
  if (q.isLoading) return <LoadingState />;
  return (
    <section className="space-y-5">
      <PageHeader title="Leaderboards" subtitle="Top performers across the program." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LeaderboardCard title="Top by XP" emoji="🏆" rows={q.data.xp} metricKey="xp" metricLabel="XP" />
        <LeaderboardCard title="Longest streaks" emoji="🔥" rows={q.data.streak} metricKey="streak" metricLabel="days" />
        <LeaderboardCard title="Most evidence uploads" emoji="📁" rows={q.data.files} metricKey="files" metricLabel="files" />
        <LeaderboardCard title="Most consistent" emoji="🌟" rows={q.data.badges} metricKey="overall" metricLabel="overall %" />
      </div>
    </section>
  );
}
