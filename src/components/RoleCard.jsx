import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES } from "@/mock/roles.js";

export default function RoleCard({ roleKey, selected, onClick }) {
  const r = ROLES[roleKey];
  return (
    <motion.button
      type="button"
      data-role={roleKey}
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-4 text-left transition",
        selected ? "border-transparent role-ring" : "border-border hover:border-foreground/20"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-[.10] role-gradient" />
      {selected && (
        <motion.div
          layoutId="role-selected"
          className="absolute right-2 top-2 z-10 role-gradient flex h-5 w-5 items-center justify-center rounded-full text-white shadow"
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <Check className="h-3 w-3" />
        </motion.div>
      )}
      <div className="flex items-center gap-3">
        <div className="role-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold shadow">
          {r.icon}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{r.short}</div>
          <div className="text-[11px] text-muted-foreground line-clamp-1">{r.title}</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{r.purpose}</p>
    </motion.button>
  );
}
