import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth.jsx";
import * as checklist from "@/api/checklist.js";
import * as filesApi from "@/api/files.js";
import { store } from "@/mock/store.js";
import ChecklistItemCard from "@/components/checklist/ChecklistItemCard.jsx";
import { PageHeader, LoadingState, EmptyState } from "@/components/feedback/index.jsx";
import { Button } from "@/components/ui/button";
import ProgressPill from "@/components/stats/ProgressPill.jsx";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog.jsx";
import { ClipboardList, Send, Undo2, Trophy } from "lucide-react";
import { burst, celebrate } from "@/lib/celebrate.js";

export default function ChecklistPage({ period, periodKey, onPeriodKeyChange, title, subtitle, picker }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const cl = useQuery({
    queryKey: ["checklist", user.id, user.role, period, periodKey],
    queryFn: () => checklist.getChecklist(user.id, user.role, period, periodKey),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["checklist", user.id, user.role, period, periodKey] });
    qc.invalidateQueries({ queryKey: ["me"] });
    qc.invalidateQueries({ queryKey: ["badges", user.id] });
  };

  const patch = useMutation({
    mutationFn: ({ entryId, patch }) => checklist.patchEntry(entryId, patch),
    onSuccess: (next, vars) => {
      // celebrate when an item flips to completed
      if (vars?.patch?.completed === true) {
        burst({ particleCount: 40, spread: 60, scalar: 0.7, origin: { y: 0.55 } });
      }
      invalidate();
    },
  });
  const submit = useMutation({
    mutationFn: () => checklist.submitPeriod(user.id, period, periodKey),
    onSuccess: (s) => {
      celebrate();
      toast.success(`Submitted! +${s.bonus} bonus XP`, {
        description: `Your ${period} is locked and audit-ready.`,
        icon: <Trophy className="h-4 w-4" />,
      });
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });
  const unsubmit = useMutation({
    mutationFn: () => checklist.unsubmitPeriod(user.id, period, periodKey),
    onSuccess: () => { toast.success("Period reopened"); invalidate(); },
  });
  const upload = useMutation({
    mutationFn: ({ entry, file }) => filesApi.uploadFile({
      userId: user.id, file, entryId: entry.id, role: user.role,
      activityKey: entry.activityKey, period, periodKey,
    }),
    onSuccess: () => { toast.success("Evidence attached"); invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: ({ fileId }) => filesApi.removeFile(fileId),
    onSuccess: invalidate,
  });

  if (cl.isLoading) return <LoadingState rows={5} />;
  const data = cl.data;
  const locked = !!data.submittedAt;
  const total = data.rows.length;
  const done = data.rows.filter((r) => r.entry.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section className="space-y-5">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            {picker}
            <AnimatePresence mode="wait" initial={false}>
              {locked ? (
                <motion.div key="unsub" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Button variant="outline" onClick={() => unsubmit.mutate()}>
                    <Undo2 className="mr-1.5 h-4 w-4" /> Unsubmit
                  </Button>
                </motion.div>
              ) : (
                <motion.div key="sub" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Button
                    onClick={() => setConfirmOpen(true)}
                    disabled={done === 0}
                    className="role-gradient text-white shadow-lg hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50"
                  >
                    <Send className="mr-1.5 h-4 w-4" /> Submit {period}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="surface-elevated flex flex-wrap items-center gap-4 rounded-2xl p-4"
      >
        <ProgressPill value={pct} />
        <div className="text-sm text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground">{done}/{total}</span> complete · {locked ? "Submitted" : "In progress"}
        </div>
        {pct === 100 && !locked && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success"
          >
            🎯 Ready to submit
          </motion.span>
        )}
      </motion.div>

      {data.rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No activities yet" desc="No activities defined for this role and period." />
      ) : (
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="space-y-3"
        >
          {data.rows.map(({ activity, entry }) => {
            const files = store.filesByIds(entry.attachmentIds);
            return (
              <motion.div
                key={entry.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              >
                <ChecklistItemCard
                  activity={activity}
                  entry={entry}
                  files={files}
                  locked={locked}
                  onToggle={(v) => patch.mutate({ entryId: entry.id, patch: { completed: v } })}
                  onNotes={(notes) => patch.mutate({ entryId: entry.id, patch: { notes } })}
                  onUpload={(file) => upload.mutate({ entry, file })}
                  onRemoveFile={(fileId) => remove.mutate({ fileId })}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Submit this ${period}?`}
        desc="Submitted entries are locked. You can unsubmit later if needed."
        confirmLabel="Submit"
        onConfirm={() => { setConfirmOpen(false); submit.mutate(); }}
      />
    </section>
  );
}
