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
  "/plans",
  "/payment/success",
  "/payment/cancel",
]);

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (
    HIDDEN.has(pathname) ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/listing/") ||
    pathname.startsWith("/inbox/") ||
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
          "relative flex h-[49px] min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
          active ? "text-trust" : "text-muted-foreground",
        )}
      >
        {active && <span className="absolute inset-x-6 top-0 h-0.5 bg-trust" />}
        <Icon size={25} strokeWidth={active ? 2.2 : 1.7} fill={active ? "currentColor" : "none"} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="sticky bottom-0 z-40 border-t border-border bg-background pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <div className="flex min-h-[49px] items-stretch overflow-visible">
        {item("/home", "Home", Home, true)}
        {item("/search", "Search", Search, true)}
        <Link
          to="/plans"
          className="relative flex h-[49px] min-h-[44px] flex-1 flex-col items-center justify-center text-[10px] font-medium text-primary"
        >
          <span className="-mt-2.5 flex h-11 w-11 items-center justify-center bg-primary text-white shadow-md">
            <Plus size={22} strokeWidth={2.4} />
          </span>
          <span className="mt-0.5">Add Car</span>
        </Link>
        {item("/inbox", "Inbox", MessageSquare, true)}
        {item("/profile", "Profile", User, true)}
      </div>
    </nav>
  );
}
