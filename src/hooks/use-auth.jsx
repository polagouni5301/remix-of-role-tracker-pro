import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as authApi from "@/api/auth.js";
import { store } from "@/mock/store.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => store.session());
  const meQ = useQuery({
    queryKey: ["auth", "me", session?.userId],
    queryFn: authApi.getMe,
    enabled: !!session,
    retry: false,
  });

  useEffect(() => {
    if (meQ.error) setSession(null);
  }, [meQ.error]);

  const value = useMemo(
    () => ({
      user: meQ.data || null,
      isLoading: !!session && meQ.isLoading,
      isAuthed: !!meQ.data,
      isAdmin: !!meQ.data?.isAdmin,
      async lookup(email) { return authApi.lookupEmail(email); },
      async signInWithPassword(payload) {
        const u = await authApi.signInWithPassword(payload);
        setSession({ userId: u.id });
        return u;
      },
      async register(payload) {
        return authApi.register(payload);
      },
      async setupPassword(payload) {
        const u = await authApi.setupPassword(payload);
        setSession({ userId: u.id });
        return u;
      },
      getPendingSetup: authApi.getPendingSetup,
      async signOut() {
        await authApi.logout();
        setSession(null);
      },
    }),
    [meQ.data, meQ.isLoading, session]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

export function RequireAuth({ children }) {
  const { isAuthed, isLoading } = useAuth();
  const loc = useLocation();
  if (isLoading) return <FullscreenSpinner />;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}

export function RequireAdmin({ children }) {
  const { isAuthed, isAdmin, isLoading } = useAuth();
  if (isLoading) return <FullscreenSpinner />;
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/app/daily" replace />;
  return children;
}

function FullscreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-muted" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
      </div>
    </div>
  );
}
