import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageSquare, Plus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const HIDDEN = new Set([
  "/",
  "/onboarding",
  "/login",
  "/register",
  "/forgot-password",
  "/verify",
  "/checkout",
  "/add-car",
  "/payment/success",
  "/payment/cancel",
]);

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (
    HIDDEN.has(pathname) ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/listing/") ||
    pathname.endsWith("/edit")
  ) {
    return null;
  }

  const item = (to: string, label: string, icon: typeof Home, exact = false) => {
    const active = exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
    const Icon = icon;
    return (
      <Link
        to={to as "/home"}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[12px] font-medium",
          active ? "text-trust" : "text-muted-foreground",
        )}
      >
        {active && <span className="absolute inset-x-6 top-0 h-0.5 bg-trust" />}
        <Icon size={22} strokeWidth={active ? 2.4 : 1.8} fill={active ? "currentColor" : "none"} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-background pb-[max(0.4rem,env(safe-area-inset-bottom))]">
      <div className="flex items-stretch">
        {item("/home", "Home", Home, true)}
        {item("/search", "Search", Search, true)}
        <Link
          to="/plans"
          className="relative flex min-h-12 flex-1 flex-col items-center justify-center pb-1 text-[12px] font-medium text-primary"
        >
          <span className="-mt-4 flex h-12 w-12 items-center justify-center bg-primary text-white shadow-md">
            <Plus size={26} strokeWidth={2.4} />
          </span>
          <span className="mt-1">Add Car</span>
        </Link>
        {item("/inbox", "Inbox", MessageSquare, true)}
        {item("/profile", "Profile", User, true)}
      </div>
    </nav>
  );
}
