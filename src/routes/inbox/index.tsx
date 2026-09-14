import { createFileRoute, Link } from "@tanstack/react-router";
import { SafeImg } from "@/components/SafeImg";
import { Empty, Header, LinkButton } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/inbox/")({
  head: () => ({ meta: [{ title: "Inbox · SellMyAuto" }] }),
  component: InboxScreen,
});

function InboxScreen() {
  const { conversations } = useApp();
  return (
    <div className="bg-background pb-4">
      <Header title="Inbox" back fallbackTo="/home" />
      <div className="no-scrollbar overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="px-4">
            <Empty
              title="No messages yet"
              body="When a buyer writes, it shows up here."
              action={
                <LinkButton to="/home" variant="outline" full>
                  Back to Home
                </LinkButton>
              }
            />
          </div>
        ) : (
          conversations.map((c) => (
            <Link
              key={c.id}
              to="/inbox/$id"
              params={{ id: c.id }}
              className="flex items-center gap-3 border-b border-border px-4 py-3"
            >
              <SafeImg src={c.listingThumb} alt="" className="h-14 w-14 object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[15px] font-semibold">{c.peerName}</p>
                  <span className="shrink-0 text-[13px] text-muted-foreground">{c.lastAt}</span>
                </div>
                <p className="truncate text-[13px] text-muted-foreground">{c.listingTitle}</p>
                <p className="truncate text-[15px]">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[10px] font-bold text-white">
                  {c.unread}
                </span>
              )}
            </Link>
          ))
        )}
        <div className="space-y-2 px-4 pt-4">
          <LinkButton to="/home" full>
            Back to Home
          </LinkButton>
          <LinkButton to="/favorites" variant="outline" full>
            View saved listings
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
