import { createFileRoute, Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { money } from "@/components/ListingCard";
import { SafeImg } from "@/components/SafeImg";
import { RequireAuth } from "@/components/RequireAuth";
import { inputClass } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inbox/$id")({
  head: () => ({ meta: [{ title: "Chat · Sell My Auto USA" }] }),
  component: () => (
    <RequireAuth>
      <ChatScreen />
    </RequireAuth>
  ),
});

function ChatScreen() {
  const { id } = Route.useParams();
  const { conversations, sendMessage } = useApp();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const thread = conversations.find((c) => c.id === id);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [thread?.messages.length]);

  if (!thread) {
    return (
      <div className="min-h-dvh bg-background px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <p className="text-[15px] text-muted-foreground">This chat is no longer available.</p>
        <Link to="/inbox" className="mt-3 inline-block text-[15px] font-semibold text-trust">
          Back to Inbox
        </Link>
      </div>
    );
  }

  function send() {
    const next = text.trim();
    if (!next) return;
    sendMessage(thread.id, next);
    setText("");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/inbox" }))}
            className="flex h-11 w-11 shrink-0 items-center justify-center"
          >
            <ArrowLeft size={18} />
          </button>
          <SafeImg src={thread.listingThumb} alt="" className="h-10 w-10 shrink-0 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-semibold">{thread.peerName}</p>
            <Link to="/listing/$id" params={{ id: thread.listingId }} className="truncate text-[13px] text-trust">
              {thread.listingTitle}
            </Link>
          </div>
        </div>
      </header>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {thread.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
            {m.kind === "offer" ? (
              <div className="w-[78%] border border-primary bg-primary/5 px-3 py-2.5">
                <p className="text-[13px] font-semibold text-primary">Offer</p>
                <p className="mt-0.5 text-[22px] font-semibold text-foreground">
                  {m.amount ? money(m.amount) : "—"}
                </p>
                <p className="mt-1 text-[15px] leading-snug text-foreground">{m.text}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{m.at}</p>
              </div>
            ) : (
              <div
                className={cn(
                  "max-w-[78%] px-3 py-2 text-[15px] leading-snug",
                  m.from === "me" ? "bg-trust text-white" : "bg-muted text-foreground",
                )}
              >
                <p>{m.text}</p>
                <p className={cn("mt-1 text-[11px]", m.from === "me" ? "text-white/70" : "text-muted-foreground")}>
                  {m.at}
                </p>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="flex items-center gap-2 border-t border-border bg-background px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className={cn(inputClass, "flex-1")}
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!text.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-white disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
