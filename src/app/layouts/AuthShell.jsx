import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function AuthShell() {
  useEffect(() => {
    if (!document.documentElement.getAttribute("data-role")) {
      document.documentElement.setAttribute("data-role", "Manager");
    }
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 mesh-bg" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,var(--role-c1),transparent_70%)] opacity-30 blur-2xl"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,var(--role-c2),transparent_70%)] opacity-25 blur-2xl"
        animate={{ y: [0, -16, 0], x: [0, 14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <Outlet />
    </div>
  );
}
