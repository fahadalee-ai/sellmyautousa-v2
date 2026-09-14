import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdCard, isListingExpired } from "@/components/ListingCard";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty, Header, LinkButton } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tab = "active" | "expired" | "pending";

export const Route = createFileRoute("/inventory/")({
  validateSearch: (s: Record<string, unknown>): { tab: Tab } => ({
    tab: s.tab === "expired" || s.tab === "pending" ? s.tab : "active",
  }),
  head: () => ({ meta: [{ title: "My Ads · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <MyAdsScreen />
    </RequireAuth>
  ),
});

function MyAdsScreen() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const go = useNavigate();
  const { myListings, plans, setPendingCheckoutId } = useApp();

  const shown = myListings.filter((listing) => {
    const expired = isListingExpired(listing, plans);
    if (tab === "pending") return listing.status === "draft" || listing.status === "unpaid";
    if (tab === "expired") return expired;
    return listing.status === "paid" && !expired;
  });

  const title = tab === "pending" ? "Pending Ads" : "All Ads";
  const tabs: { id: Tab; label: string }[] = [
    { id: "active", label: "Active" },
    { id: "expired", label: "Expired" },
    { id: "pending", label: "Pending" },
  ];

  return (
    <div className="min-h-dvh bg-background pb-8">
      <Header title={title} fallbackTo="/home" />

      <div className="flex border-b border-border">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate({ search: { tab: item.id } })}
            className={cn(
              "flex h-11 flex-1 items-center justify-center border-b-2 text-[15px] font-semibold",
              tab === item.id ? "border-primary text-primary" : "border-transparent text-muted-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="no-scrollbar space-y-3 overflow-y-auto px-4 py-4">
        {shown.map((listing) => (
          <AdCard
            key={listing.id}
            listing={listing}
            plan={plans.find((p) => p.id === listing.subscriptionId)}
            pending={tab === "pending"}
            onPay={() => {
              setPendingCheckoutId(listing.id);
              go({ to: "/checkout" });
            }}
          />
        ))}
        {shown.length === 0 && (
          <Empty
            title={tab === "pending" ? "No pending ads" : tab === "expired" ? "No expired ads" : "No active ads"}
            body={
              tab === "pending"
                ? "Unpaid drafts show up here until you complete checkout."
                : "Choose a plan and publish a listing to see it here."
            }
            action={<LinkButton to="/plans">Add a Car</LinkButton>}
          />
        )}
      </div>
    </div>
  );
}
