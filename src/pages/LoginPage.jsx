import { useState } from "react";
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
import { ShieldCheck, Sparkles } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Enter your full name").max(80),
  email: z.string().email("Enter a valid email").max(120),
  pod: z.string().max(60).optional().or(z.literal("")),
  manager: z.string().max(80).optional().or(z.literal("")),
  orgCode: z.string().min(2, "Org code required").max(40),
});

export default function LoginPage() {
  const [role, setRole] = useState("Manager");
  const [adminMode, setAdminMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();
  const { signIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    if (!adminMode && !role) { toast.error("Pick a role to continue"); return; }
    setSubmitting(true);
    try {
      const user = await signIn({ ...values, role: adminMode ? "Manager" : role, isAdmin: adminMode });
      toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
      nav(adminMode ? "/admin" : "/app/daily");
    } catch (e) {
      toast.error(e.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Operations · Roles &amp; Responsibilities
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Run your shift like a <span className="role-text">pro.</span>
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            Daily, weekly and monthly checklists for every operations role — with evidence, XP, levels, streaks and badges that actually mean something.
          </p>

          {!adminMode && (
            <>
              <div className="mt-8 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pick your role</h2>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {ROLE_LIST.map((r) => (
                  <RoleCard key={r} roleKey={r} selected={role === r} onClick={() => setRole(r)} />
                ))}
              </div>
            </>
          )}
        </div>

        <div data-role={adminMode ? "Manager" : role} className="role-ring rounded-3xl bg-card/90 p-6 shadow-2xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{adminMode ? "Admin access" : "Sign in"}</div>
              <h3 className="text-xl font-bold">{adminMode ? "Operations admin" : `Continue as ${role}`}</h3>
            </div>
            <button
              type="button"
              onClick={() => setAdminMode((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {adminMode ? "Use as user" : "Admin access"}
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Field label="Full name" error={errors.name?.message}>
              <Input placeholder="Aarav Mehta" {...register("name")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" placeholder="you@ops.example" {...register("email")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Pod or LOB"><Input placeholder="Pod A" {...register("pod")} /></Field>
              <Field label="Manager"><Input placeholder="Manager name" {...register("manager")} /></Field>
            </div>
            <Field label="Org code" error={errors.orgCode?.message}>
              <Input placeholder="ORG-1042" {...register("orgCode")} />
            </Field>

            <Button type="submit" disabled={submitting} className="role-gradient mt-2 w-full text-white shadow-lg hover:opacity-95">
              {submitting ? "Signing in…" : adminMode ? "Enter admin console" : "Sign in"}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Demo mode — your session is stored locally on this device.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <Label className="text-xs font-medium">{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
