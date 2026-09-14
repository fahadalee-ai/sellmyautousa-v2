import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { SafeImg } from "@/components/SafeImg";
import { Empty, Header, LinkButton } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [{ title: "Inbox · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <InboxScreen />
    </RequireAuth>
  ),
});

function InboxScreen() {
  const { conversations } = useApp();
  return (
    <div className="min-h-dvh bg-white pb-8">
      <Header title="Inbox" back={false} />
      <div className="no-scrollbar overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="px-4">
            <Empty title="No messages yet" body="When a buyer writes, it shows up here." />
          </div>
        ) : (
          conversations.map((c) => (
            <Link
              key={c.id}
              to="/listing/$id"
              params={{ id: c.listingId }}
              className="flex items-center gap-3 border-b border-border px-4 py-3"
            >
              <SafeImg src={c.listingThumb} alt="" className="h-14 w-14 object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{c.peerName}</p>
                  <span className="text-[11px] text-muted-foreground">{c.lastAt}</span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{c.listingTitle}</p>
                <p className="truncate text-sm">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[10px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </Link>
          ))
        )}
        <div className="px-4 pt-4">
          <LinkButton to="/favorites" variant="outline" full>
            View saved listings
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
