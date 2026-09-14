import { createFileRoute } from "@tanstack/react-router";
import { BrowseCard } from "@/components/ListingCard";
import { RequireAuth } from "@/components/RequireAuth";
import { Empty, Header, LinkButton } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Saved · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <FavoritesScreen />
    </RequireAuth>
  ),
});

function FavoritesScreen() {
  const { listings, favoriteIds } = useApp();
  const saved = listings.filter((l) => favoriteIds.includes(l.id));
  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="Saved listings" fallbackTo="/profile" />
      <div className="no-scrollbar space-y-3 overflow-y-auto px-4">
        {saved.map((l) => (
          <BrowseCard key={l.id} listing={l} />
        ))}
        {saved.length === 0 && (
          <Empty
            title="Nothing saved yet"
            body="Tap the heart on a listing to keep it here."
            action={<LinkButton to="/search">Browse listings</LinkButton>}
          />
        )}
      </div>
    </div>
  );
}
