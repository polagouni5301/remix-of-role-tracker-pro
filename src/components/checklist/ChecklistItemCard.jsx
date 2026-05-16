import { useState } from "react";
import { Check, FileUp, Lock, Paperclip, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { bytes } from "@/lib/format.js";

export default function ChecklistItemCard({
  activity, entry, files = [], locked = false,
  onToggle, onNotes, onUpload, onRemoveFile,
}) {
  const [notes, setNotes] = useState(entry.notes || "");
  const done = !!entry.completed;
  return (
    <div className={cn(
      "rounded-2xl border bg-card p-4 sm:p-5 transition",
      done ? "border-transparent role-ring" : "border-border",
      locked && "opacity-90"
    )}>
      <div className="flex items-start gap-3">
        <button
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          disabled={locked}
          onClick={() => onToggle(!done)}
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition",
            done ? "role-gradient text-white border-transparent shadow" : "border-border hover:bg-accent",
            locked && "cursor-not-allowed"
          )}
        >
          {done && <Check className="h-4 w-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={cn("font-semibold", done && "line-through decoration-2 decoration-muted-foreground/40")}>{activity.title}</h3>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">{activity.category}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium">
              <Sparkles className="h-3 w-3" /> {basePoints(entry.period)} pts
            </span>
            {activity.evidence && (
              <span className="rounded-full border border-amber-300/60 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                Evidence required
              </span>
            )}
            {locked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
                <Lock className="h-3 w-3" /> Submitted
              </span>
            )}
            {done && entry.pointsEarned > 0 && (
              <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
                +{entry.pointsEarned} pts
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{activity.desc}</p>

          <Textarea
            value={notes}
            disabled={locked}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => notes !== entry.notes && onNotes(notes)}
            placeholder="Notes, links, or context…"
            className="mt-3 min-h-[60px] resize-y"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent",
              locked && "cursor-not-allowed opacity-50"
            )}>
              <FileUp className="h-3.5 w-3.5" /> Attach evidence
              <input
                type="file" multiple className="hidden" disabled={locked}
                onChange={(e) => { Array.from(e.target.files || []).forEach((f) => onUpload(f)); e.target.value = ""; }}
              />
            </label>
            {files.map((f) => (
              <span key={f.id} className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-1 text-xs">
                <Paperclip className="h-3 w-3" />
                <span className="max-w-[180px] truncate">{f.fileName}</span>
                <span className="text-muted-foreground">{bytes(f.size)}</span>
                {!locked && (
                  <button onClick={() => onRemoveFile(f.id)} className="ml-1 rounded p-0.5 text-muted-foreground hover:bg-background hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function basePoints(period) { return { daily: 10, weekly: 25, monthly: 50 }[period] || 10; }
