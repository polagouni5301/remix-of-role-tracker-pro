import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function AuthShell() {
  useEffect(() => { document.documentElement.removeAttribute("data-role"); }, []);
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(closest-side,theme(colors.indigo.400/.35),transparent)]" />
        <div className="absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,theme(colors.fuchsia.400/.28),transparent)]" />
      </div>
      <Outlet />
    </div>
  );
}
