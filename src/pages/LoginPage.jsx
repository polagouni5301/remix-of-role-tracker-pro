import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth.jsx";
import RoleCard from "@/components/RoleCard.jsx";
import { ROLE_LIST } from "@/lib/role-themes.js";
import {
  ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles,
} from "lucide-react";

const emailSchema = z.object({ email: z.string().email("Enter a valid work email").max(120) });
const passwordSchema = z.object({ password: z.string().min(1, "Enter your password") });
const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name").max(80),
  pod: z.string().max(60).optional().or(z.literal("")),
  manager: z.string().max(80).optional().or(z.literal("")),
  orgCode: z.string().min(2, "Org code required").max(40),
});

const stepVariants = {
  enter: { opacity: 0, y: 14, filter: "blur(4px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -14, filter: "blur(4px)" },
};

export default function LoginPage() {
  const [step, setStep] = useState("email"); // email | password | register
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Manager");
  const [adminMode, setAdminMode] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lookup, setLookup] = useState(null);
  const nav = useNavigate();
  const auth = useAuth();

  const emailForm = useForm({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } });
  const pwForm = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { password: "" } });
  const regForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", pod: "", manager: "", orgCode: "" },
  });

  useEffect(() => { document.documentElement.setAttribute("data-role", adminMode ? "Manager" : role); }, [role, adminMode]);

  const onEmail = async ({ email: e }) => {
    setSubmitting(true);
    try {
      const info = await auth.lookup(e);
      setEmail(e);
      setLookup(info);
      if (info.exists && info.hasPassword) {
        if (info.role) setRole(info.role);
        setAdminMode(!!info.isAdmin);
        setStep("password");
      } else {
        if (info.name) regForm.setValue("name", info.name);
        setStep("register");
      }
    } catch (err) { toast.error(err.message || "Lookup failed"); }
    finally { setSubmitting(false); }
  };

  const onPassword = async ({ password }) => {
    setSubmitting(true);
    try {
      const u = await auth.signInWithPassword({ email, password });
      toast.success(`Welcome back, ${u.name.split(" ")[0]} ✨`);
      nav(u.isAdmin ? "/admin" : "/app/daily");
    } catch (err) { toast.error(err.message || "Sign in failed"); }
    finally { setSubmitting(false); }
  };

  const onRegister = async (values) => {
    setSubmitting(true);
    try {
      await auth.register({ ...values, email, role: adminMode ? "Manager" : role, isAdmin: adminMode });
      toast.success("Account created — let's secure it with a password.");
      nav("/setup-password");
    } catch (err) { toast.error(err.message || "Sign up failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10">
      <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand pane */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium backdrop-blur shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Operations · Roles &amp; Responsibilities
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
            Run your shift like a <span className="role-text">pro.</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed">
            A single source of truth for daily, weekly and monthly responsibilities — with evidence,
            XP, levels, streaks and badges that actually mean something to your team.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              { k: "Roles", v: "7" },
              { k: "Activities", v: "50+" },
              { k: "Audit-ready", v: "100%" },
            ].map((x, i) => (
              <motion.div
                key={x.k}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="surface-elevated rounded-2xl px-4 py-3"
              >
                <div className="text-2xl font-bold tabular-nums role-text">{x.v}</div>
                <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{x.k}</div>
              </motion.div>
            ))}
          </div>

          {step === "register" && !adminMode && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mt-8 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pick your role</h2>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {ROLE_LIST.map((r) => (
                  <RoleCard key={r} roleKey={r} selected={role === r} onClick={() => setRole(r)} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Card pane */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          data-role={adminMode ? "Manager" : role}
          className="relative"
        >
          <div className="absolute -inset-px rounded-3xl role-gradient opacity-30 blur-2xl" />
          <div className="surface-premium relative rounded-3xl p-6 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {step === "email" && "Get started"}
                  {step === "password" && "Welcome back"}
                  {step === "register" && (adminMode ? "Admin setup" : "Create your account")}
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  {step === "email" && "Sign in or sign up"}
                  {step === "password" && (lookup?.name ? `Hello, ${lookup.name.split(" ")[0]}` : "Enter your password")}
                  {step === "register" && (adminMode ? "Operations admin" : `Continue as ${role}`)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdminMode((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium transition hover:bg-accent active:scale-95"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {adminMode ? "User mode" : "Admin"}
              </button>
            </div>

            {/* Stepper */}
            <div className="mb-5 flex items-center gap-2">
              {["email", lookup?.exists && lookup?.hasPassword ? "password" : "register"].map((s, i) => (
                <div key={i} className="flex-1">
                  <motion.div
                    className="h-1 rounded-full bg-secondary overflow-hidden"
                    initial={false}
                  >
                    <motion.div
                      className="h-full role-gradient"
                      initial={{ width: "0%" }}
                      animate={{
                        width: step === "email" ? (i === 0 ? "50%" : "0%") : i === 0 ? "100%" : "60%",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form
                  key="email"
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.35 }}
                  onSubmit={emailForm.handleSubmit(onEmail)}
                  className="space-y-4"
                >
                  <Field label="Work email" error={emailForm.formState.errors.email?.message} icon={Mail}>
                    <Input autoFocus type="email" placeholder="you@ops.example" {...emailForm.register("email")} />
                  </Field>
                  <Button type="submit" disabled={submitting} className="role-gradient mt-2 h-11 w-full text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground">
                    New here? You'll set a password on the next step.
                  </p>
                </motion.form>
              )}

              {step === "password" && (
                <motion.form
                  key="password"
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.35 }}
                  onSubmit={pwForm.handleSubmit(onPassword)}
                  className="space-y-4"
                >
                  <div className="rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{email}</span>
                    <button type="button" onClick={() => setStep("email")} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition">Change</button>
                  </div>
                  <Field label="Password" error={pwForm.formState.errors.password?.message} icon={Lock}>
                    <div className="relative">
                      <Input autoFocus type={showPw ? "text" : "password"} placeholder="••••••••" {...pwForm.register("password")} />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                  <Button type="submit" disabled={submitting} className="role-gradient h-11 w-full text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="ml-1.5 h-4 w-4" /></>}
                  </Button>
                </motion.form>
              )}

              {step === "register" && (
                <motion.form
                  key="register"
                  variants={stepVariants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.35 }}
                  onSubmit={regForm.handleSubmit(onRegister)}
                  className="space-y-3"
                >
                  <div className="rounded-xl border border-border bg-secondary/50 px-3 py-2 text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{email}</span>
                    <button type="button" onClick={() => setStep("email")} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back</button>
                  </div>
                  <Field label="Full name" error={regForm.formState.errors.name?.message}>
                    <Input autoFocus placeholder="Aarav Mehta" {...regForm.register("name")} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pod or LOB"><Input placeholder="Pod A" {...regForm.register("pod")} /></Field>
                    <Field label="Manager"><Input placeholder="Manager name" {...regForm.register("manager")} /></Field>
                  </div>
                  <Field label="Org code" error={regForm.formState.errors.orgCode?.message}>
                    <Input placeholder="ORG-1042" {...regForm.register("orgCode")} />
                  </Field>
                  <Button type="submit" disabled={submitting} className="role-gradient mt-2 h-11 w-full text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue to password <ArrowRight className="ml-1.5 h-4 w-4" /></>}
                  </Button>
                  <p className="text-center text-[11px] text-muted-foreground inline-flex items-center justify-center gap-1 w-full">
                    <Sparkles className="h-3 w-3" /> Demo mode — your data lives on this device.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <div>
      <Label className="text-xs font-medium flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="mt-1 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
