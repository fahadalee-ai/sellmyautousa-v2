import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AddCarWizard } from "@/components/AddCarWizard";
import { RequireAuth } from "@/components/RequireAuth";
import { Header } from "@/components/kit";
import { useApp } from "@/lib/store";

type Search = { step?: number };

export const Route = createFileRoute("/inventory/$id/edit")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    step: Math.min(10, Math.max(1, Number(s.step) || 1)),
  }),
  head: () => ({ meta: [{ title: "Edit listing · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <EditListingPage />
    </RequireAuth>
  ),
});

function EditListingPage() {
  const { id } = Route.useParams();
  const { step = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { listings, loadDraftFromListing } = useApp();
  const listing = listings.find((l) => l.id === id);
  const loaded = useRef(false);

  useEffect(() => {
    if (listing && !loaded.current) {
      loadDraftFromListing(listing);
      loaded.current = true;
    }
  }, [listing, loadDraftFromListing]);

  if (!listing) {
    return (
      <div className="min-h-dvh bg-background">
        <Header title="Not found" fallbackTo="/inventory" />
      </div>
    );
  }

  return (
    <AddCarWizard
      step={step}
      mode="edit"
      listingId={id}
      onStep={(next) => navigate({ search: { step: next } })}
    />
  );
}
