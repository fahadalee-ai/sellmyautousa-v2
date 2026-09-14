import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { Header } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <NotificationsScreen />
    </RequireAuth>
  ),
});

function NotificationsScreen() {
  const { notifications, markAllRead } = useApp();
  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header
        title="Notifications"
        fallbackTo="/home"
        right={
          <button type="button" onClick={markAllRead} className="text-xs font-semibold text-trust">
            Mark all read
          </button>
        }
      />
      <div className="no-scrollbar">
        {notifications.map((n) => (
          <article
            key={n.id}
            className={cn("border-b border-border px-4 py-3", !n.read && "bg-trust/5")}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">{n.title}</h2>
              <span className="text-[11px] text-muted-foreground">{n.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{n.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
