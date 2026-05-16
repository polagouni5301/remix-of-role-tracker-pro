import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth.jsx";
import { celebrate } from "@/lib/celebrate.js";
import {
  ArrowRight, Check, Eye, EyeOff, KeyRound, Loader2, ShieldCheck, X,
} from "lucide-react";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

function strengthOf(pw) {
  let s = 0;
  if (!pw) return { score: 0, label: "" };
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score: s, label: labels[s] || "" };
}

export default function SetupPasswordPage() {
  const auth = useAuth();
  const nav = useNavigate();
  const pending = useMemo(() => auth.getPendingSetup(), [auth]);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  });
  const pw = watch("password") || "";
  const strength = strengthOf(pw);
  useEffect(() => { document.documentElement.setAttribute("data-role", "Manager"); }, []);

  if (!pending && !auth.isAuthed) return <Navigate to="/login" replace />;

  const onSubmit = async ({ password }) => {
    setSubmitting(true);
    try {
      const u = await auth.setupPassword({ userId: pending.userId, password });
      celebrate();
      toast.success("Password set — welcome aboard! 🎉", { description: "You're all set to start tracking responsibilities." });
      setTimeout(() => nav(u.isAdmin ? "/admin" : "/app/daily"), 400);
    } catch (err) { toast.error(err.message || "Could not set password"); }
    finally { setSubmitting(false); }
  };

  const checks = [
    { ok: pw.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: "Upper and lower case" },
    { ok: /\d/.test(pw), label: "A number" },
    { ok: /[^A-Za-z0-9]/.test(pw), label: "A symbol (recommended)" },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        <div className="relative">
          <div className="absolute -inset-px rounded-3xl role-gradient opacity-30 blur-2xl" />
          <div className="surface-premium relative rounded-3xl p-7">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
              className="role-gradient mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
            >
              <KeyRound className="h-7 w-7" />
            </motion.div>
            <h1 className="mt-4 text-center text-2xl font-bold tracking-tight">Secure your account</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              {pending?.email ? <>Set a password for <span className="font-medium text-foreground">{pending.email}</span></> : "Choose a strong password to continue"}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <Label className="text-xs font-medium">New password</Label>
                <div className="relative mt-1.5">
                  <Input autoFocus type={show ? "text" : "password"} placeholder="••••••••" {...register("password")} />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}

                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        backgroundColor: i < strength.score
                          ? ["var(--role-c1)", "var(--role-c1)"][0]
                          : "color-mix(in oklab, var(--color-border) 80%, transparent)",
                        scaleY: i < strength.score ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.25 }}
                      className="h-1.5 flex-1 rounded-full"
                    />
                  ))}
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground">{strength.label}</div>
              </div>

              <div>
                <Label className="text-xs font-medium">Confirm password</Label>
                <Input className="mt-1.5" type={show ? "text" : "password"} placeholder="••••••••" {...register("confirm")} />
                {errors.confirm && <p className="mt-1 text-xs text-destructive">{errors.confirm.message}</p>}
              </div>

              <ul className="grid grid-cols-1 gap-1.5 rounded-xl border border-border bg-secondary/40 p-3 sm:grid-cols-2">
                {checks.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-xs">
                    <motion.span
                      animate={{ scale: c.ok ? 1 : 0.85, backgroundColor: c.ok ? "var(--role-c1)" : "transparent" }}
                      transition={{ type: "spring", stiffness: 250, damping: 16 }}
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${c.ok ? "border-transparent text-white" : "border-border text-muted-foreground"}`}
                    >
                      {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-60" />}
                    </motion.span>
                    <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                  </li>
                ))}
              </ul>

              <Button type="submit" disabled={submitting} className="role-gradient h-11 w-full text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Activate account <ArrowRight className="ml-1.5 h-4 w-4" /></>}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground inline-flex items-center gap-1 justify-center w-full">
                <ShieldCheck className="h-3 w-3" /> Encrypted at rest · You can change this anytime in Settings
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
