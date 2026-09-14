import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BrandIcon } from "@/components/Logo";
import { InventoryCard } from "@/components/ListingCard";
import { RequireAuth } from "@/components/RequireAuth";
import { SafeImg } from "@/components/SafeImg";
import { Empty, LinkButton, ScrollTabs } from "@/components/kit";
import { IMAGES } from "@/lib/images";
import { useApp } from "@/lib/store";
import type { ListingStatus } from "@/lib/types";

export const Route = createFileRoute("/inventory/")({
  head: () => ({ meta: [{ title: "My Inventory · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <InventoryScreen />
    </RequireAuth>
  ),
});

const FILTERS: { id: "all" | ListingStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "unpaid", label: "Unpaid" },
  { id: "sold", label: "Sold" },
];

function InventoryScreen() {
  const { myListings, markSold, deleteListing } = useApp();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const shown = myListings.filter((l) => filter === "all" || l.status === filter);

  return (
    <div className="min-h-dvh bg-background pb-8">
      <header className="sticky top-0 z-30 flex items-center justify-between bg-background px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div className="flex items-center gap-2">
          <BrandIcon tone="color" size="md" />
          <h1 className="text-[17px] font-semibold tracking-tight">My Inventory</h1>
        </div>
        <Link
          to="/plans"
          className="inline-flex h-11 items-center bg-primary px-4 text-[17px] font-semibold text-white"
        >
          + Add Car
        </Link>
      </header>
      <div className="px-4 pb-3">
        <ScrollTabs
          fit
          items={FILTERS}
          value={filter}
          onChange={setFilter}
        />
      </div>
      <div className="no-scrollbar space-y-3 overflow-y-auto px-4 pb-6">
        {shown.map((l) => (
          <InventoryCard
            key={l.id}
            listing={l}
            onSold={() => markSold(l.id)}
            onDelete={() => {
              if (window.confirm("Delete this listing?")) deleteListing(l.id);
            }}
          />
        ))}
        {shown.length === 0 && (
          <Empty
            title="You haven't listed a car yet"
            body="Choose a plan and publish your first listing. Buyers see Paid ads first."
            action={
              <div className="space-y-3">
                <SafeImg src={IMAGES.emptyInventory} alt="" className="mx-auto h-28 w-full object-cover" />
                <LinkButton to="/plans">Add Your First Car</LinkButton>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
