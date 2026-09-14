import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { TabBar } from "@/components/TabBar";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const FULL_BLEED = new Set(["/", "/onboarding", "/login", "/register", "/forgot-password", "/verify"]);

export function AppShell({ children }: { children: ReactNode }) {
  const { toasts, dismissToast } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const bleed = FULL_BLEED.has(pathname);

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col",
        bleed ? "max-w-none bg-[#0B0B0F]" : "bg-white",
      )}
    >
      <main className="flex-1 no-scrollbar">{children}</main>
      <TabBar />
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex w-full max-w-[480px] flex-col gap-2 px-4">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => dismissToast(t.id)}
            className="pointer-events-auto border border-border bg-card px-3 py-2.5 text-left shadow-md"
          >
            <p className="text-sm font-semibold text-foreground">{t.title}</p>
            {t.body && <p className="text-xs text-muted-foreground">{t.body}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
