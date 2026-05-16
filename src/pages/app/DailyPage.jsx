import { todayKey } from "@/lib/dates.js";
import ChecklistPage from "./_ChecklistPage.jsx";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function DailyPage() {
  const [date, setDate] = useState(todayKey());
  return (
    <ChecklistPage
      period="daily"
      periodKey={date}
      onPeriodKeyChange={setDate}
      title="Today's checklist"
      subtitle="Stay sharp — daily activities for your role."
      picker={
        <Input
          type="date" value={date} onChange={(e) => setDate(e.target.value || todayKey())}
          className="w-[160px]"
        />
      }
    />
  );
}
