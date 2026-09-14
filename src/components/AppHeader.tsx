import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppHeader({ variant = "light" }: { variant?: "light" | "overlay" }) {
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const overlay = variant === "overlay";

  return (
    <header
      className={cn(
        "z-30 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3",
        overlay ? "absolute inset-x-0 top-0 bg-transparent" : "sticky top-0 bg-white",
      )}
    >
      <Logo tone={overlay ? "white" : "color"} size="md" className="max-w-[15rem]" />
      <div className="flex items-center gap-1">
        <Link
          to="/search"
          aria-label="Search"
          className={cn(
            "flex h-12 w-12 items-center justify-center",
            overlay ? "text-white" : "text-foreground",
          )}
        >
          <Search size={20} strokeWidth={2} />
        </Link>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className={cn(
            "relative flex h-12 w-12 items-center justify-center",
            overlay ? "text-white" : "text-foreground",
          )}
        >
          <Bell size={20} strokeWidth={2} />
          {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 bg-primary" />}
        </Link>
      </div>
    </header>
  );
}
