import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Car, FileText, Heart, LogOut, MessageSquare, Moon, Sun, UserRound } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";
import { Header, Row } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <ProfileScreen />
    </RequireAuth>
  ),
});

function ProfileScreen() {
  const { user, theme, setTheme, logout } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-white pb-8">
      <Header title="Profile" back={false} />
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3 border border-border bg-card p-4">
          <div className="flex h-12 w-12 items-center justify-center bg-trust text-white">
            <UserRound size={22} />
          </div>
          <div>
            <p className="font-semibold">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.phone}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Keep your contact details current so buyers can reach you. Completing your profile is informational only —
          it does not change Listing Relevance Score.
        </p>
      </div>
      <div className="border-y border-border">
        <Row icon={<Car size={18} />} label="Inventory" to="/inventory" />
        <Row icon={<MessageSquare size={18} />} label="Inbox" to="/inbox" />
        <Row icon={<Heart size={18} />} label="Saved listings" to="/favorites" />
        <Row icon={<Bell size={18} />} label="Notifications" to="/notifications" />
        <Row icon={<FileText size={18} />} label="Listing Relevance Score" to="/point-notes" />
        <Row icon={<FileText size={18} />} label="Terms & Conditions" to="/terms" />
        <Row icon={<FileText size={18} />} label="Privacy Policy" to="/privacy" />
      </div>
      <div className="mt-4 px-4">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center justify-between border border-border bg-card px-4 py-4"
        >
          <span className="flex items-center gap-3 text-sm font-medium">
            {theme === "dark" ? <Moon size={18} className="text-trust" /> : <Sun size={18} className="text-trust" />}
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Tap to switch
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/login" });
          }}
          className="mt-3 flex w-full items-center gap-3 border border-border px-4 py-4 text-sm font-semibold text-primary"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
