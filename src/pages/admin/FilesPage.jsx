import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAuditFiles } from "@/api/admin.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable.jsx";
import { PageHeader, LoadingState } from "@/components/feedback/index.jsx";
import { bytes, fmtRelative } from "@/lib/format.js";
import { Download } from "lucide-react";

export default function FilesPage() {
  const [search, setSearch] = useState("");
  const q = useQuery({ queryKey: ["admin", "files", search], queryFn: () => listAuditFiles({ search }) });
  return (
    <section className="space-y-5">
      <PageHeader title="Audit files" subtitle="Every evidence file submitted, searchable." />
      <Input placeholder="Search files, users, activities…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
      {q.isLoading ? <LoadingState /> : (
        <DataTable
          rows={q.data.rows}
          columns={[
            { key: "fileName", label: "File" },
            { key: "user", label: "User", render: (r) => r.user?.name || "—" },
            { key: "activityKey", label: "Activity" },
            { key: "period", label: "Period", render: (r) => `${r.period} · ${r.periodKey}` },
            { key: "size", label: "Size", render: (r) => bytes(r.size) },
            { key: "uploadedAt", label: "Uploaded", render: (r) => fmtRelative(r.uploadedAt) },
            { key: "actions", label: "", render: () => <Button size="sm" variant="ghost"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button> },
          ]}
        />
      )}
    </section>
  );
}
