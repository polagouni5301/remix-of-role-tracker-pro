import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, RequireAuth, RequireAdmin } from "@/hooks/use-auth.jsx";

import AppShell from "@/app/layouts/AppShell.jsx";
import AdminShell from "@/app/layouts/AdminShell.jsx";
import AuthShell from "@/app/layouts/AuthShell.jsx";

import LoginPage from "@/pages/LoginPage.jsx";
import DailyPage from "@/pages/app/DailyPage.jsx";
import WeeklyPage from "@/pages/app/WeeklyPage.jsx";
import MonthlyPage from "@/pages/app/MonthlyPage.jsx";
import BadgesPage from "@/pages/app/BadgesPage.jsx";
import MyStatsPage from "@/pages/app/MyStatsPage.jsx";
import HistoryPage from "@/pages/app/HistoryPage.jsx";

import TeamPage from "@/pages/admin/TeamPage.jsx";
import LeaderboardPage from "@/pages/admin/LeaderboardPage.jsx";
import UserPage from "@/pages/admin/UserPage.jsx";
import TrendsPage from "@/pages/admin/TrendsPage.jsx";
import FilesPage from "@/pages/admin/FilesPage.jsx";
import SettingsPage from "@/pages/admin/SettingsPage.jsx";
import NotFound from "@/pages/NotFound.jsx";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AuthShell />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<RequireAuth><AppShell /></RequireAuth>}>
              <Route path="/app" element={<Navigate to="/app/daily" replace />} />
              <Route path="/app/daily" element={<DailyPage />} />
              <Route path="/app/weekly" element={<WeeklyPage />} />
              <Route path="/app/monthly" element={<MonthlyPage />} />
              <Route path="/app/badges" element={<BadgesPage />} />
              <Route path="/app/me" element={<MyStatsPage />} />
              <Route path="/app/history" element={<HistoryPage />} />
            </Route>

            <Route element={<RequireAdmin><AdminShell /></RequireAdmin>}>
              <Route path="/admin" element={<Navigate to="/admin/team" replace />} />
              <Route path="/admin/team" element={<TeamPage />} />
              <Route path="/admin/leaderboard" element={<LeaderboardPage />} />
              <Route path="/admin/users/:userId" element={<UserPage />} />
              <Route path="/admin/trends" element={<TrendsPage />} />
              <Route path="/admin/files" element={<FilesPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
