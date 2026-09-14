import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppHeader({ variant = "light" }: { variant?: "light" | "overlay" }) {
  const { notifications, theme } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const overlay = variant === "overlay";
  const lightLogo = !overlay && theme !== "dark";

  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-1",
        overlay ? "absolute inset-x-0 top-0 bg-transparent" : "sticky top-0 bg-background",
      )}
    >
      <Logo tone={lightLogo ? "color" : "white"} size="sm" className="max-w-[11rem]" />
      <div className="flex items-center">
        <Link
          to="/search"
          aria-label="Search"
          className={cn(
            "flex h-11 w-11 items-center justify-center",
            overlay ? "text-white" : "text-foreground",
          )}
        >
          <Search size={22} strokeWidth={1.8} />
        </Link>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className={cn(
            "relative flex h-11 w-11 items-center justify-center",
            overlay ? "text-white" : "text-foreground",
          )}
        >
          <Bell size={22} strokeWidth={1.8} />
          {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 bg-primary" />}
        </Link>
      </div>
    </header>
  );
}
