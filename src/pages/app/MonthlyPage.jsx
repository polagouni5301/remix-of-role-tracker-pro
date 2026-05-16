import { monthKey } from "@/lib/dates.js";
import ChecklistPage from "./_ChecklistPage.jsx";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function MonthlyPage() {
  const [month, setMonth] = useState(monthKey());
  return (
    <ChecklistPage
      period="monthly"
      periodKey={month}
      onPeriodKeyChange={setMonth}
      title="This month's checklist"
      subtitle="Monthly reviews, attestations and showcases."
      picker={
        <Input type="month" value={month} onChange={(e) => setMonth(e.target.value || monthKey())} className="w-[180px]" />
      }
    />
  );
}
