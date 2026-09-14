import { createFileRoute, Link } from "@tanstack/react-router";
import { listingTitle, money } from "@/components/ListingCard";
import { RelevanceScore } from "@/components/RelevanceScore";
import { RequireAuth } from "@/components/RequireAuth";
import { SafeImg } from "@/components/SafeImg";
import { Chip, Header, LinkButton } from "@/components/kit";
import { computeScore } from "@/lib/score";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/inventory/$id/")({
  head: () => ({ meta: [{ title: "Listing · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <InventoryDetail />
    </RequireAuth>
  ),
});

function InventoryDetail() {
  const { id } = Route.useParams();
  const { listings } = useApp();
  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-dvh bg-background">
        <Header title="Not found" fallbackTo="/inventory" />
        <p className="px-4 text-sm text-muted-foreground">That listing is gone.</p>
      </div>
    );
  }

  const score = computeScore(listing, listing);

  return (
    <div className="min-h-dvh bg-background pb-28">
      <Header title={listingTitle(listing)} fallbackTo="/inventory" />
      <SafeImg src={listing.thumbnail} alt="" className="h-56 w-full object-cover" />
      <div className="space-y-4 px-4 py-4">
        <div className="flex flex-wrap gap-1.5">
          <Chip tone={listing.status === "paid" ? "success" : listing.status === "sold" ? "sold" : "danger"}>
            {listing.status}
          </Chip>
          {listing.featured && <Chip tone="trust">Featured</Chip>}
        </div>
        <p className="text-2xl font-semibold text-trust">{money(listing.price)}</p>
        <p className="text-sm text-muted-foreground">
          {listing.city}, {listing.state} · {Number(listing.mileage || 0).toLocaleString()} mi
        </p>
        <RelevanceScore score={score} expanded showHelp />
        <Link to="/point-notes" className="inline-block text-sm font-semibold text-trust">
          What does this mean?
        </Link>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <LinkButton to="/listing/$id" params={{ id: listing.id }} variant="outline">
            Public preview
          </LinkButton>
          <LinkButton to="/inventory/$id/edit" params={{ id: listing.id }}>
            Edit listing
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
