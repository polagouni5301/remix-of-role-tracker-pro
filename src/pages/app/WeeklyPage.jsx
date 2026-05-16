import { isoWeekKey } from "@/lib/dates.js";
import ChecklistPage from "./_ChecklistPage.jsx";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function WeeklyPage() {
  const [week, setWeek] = useState(isoWeekKey());
  return (
    <ChecklistPage
      period="weekly"
      periodKey={week}
      onPeriodKeyChange={setWeek}
      title="This week's checklist"
      subtitle="Weekly governance, calibration and reviews."
      picker={
        <Input
          type="week"
          value={week.replace("-W", "-W")}
          onChange={(e) => setWeek(e.target.value || isoWeekKey())}
          className="w-[180px]"
        />
      }
    />
  );
}
