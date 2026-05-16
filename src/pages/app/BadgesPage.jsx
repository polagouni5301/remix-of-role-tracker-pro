import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth.jsx";
import { listBadges } from "@/api/badges.js";
import BadgeCard from "@/components/stats/BadgeCard.jsx";
import { LoadingState, PageHeader } from "@/components/feedback/index.jsx";

export default function BadgesPage() {
  const { user } = useAuth();
  const q = useQuery({ queryKey: ["badges", user.id], queryFn: () => listBadges(user.id) });
  if (q.isLoading) return <LoadingState rows={6} />;
  const earned = q.data.filter((b) => b.earned).length;
  return (
    <section className="space-y-5">
      <PageHeader title="Badges" subtitle={`${earned} of ${q.data.length} unlocked`} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {q.data.map((b) => <BadgeCard key={b.key} badge={b} />)}
      </div>
    </section>
  );
}
