import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Button, Header } from "@/components/kit";
import { useApp } from "@/lib/store";
import { parseAddonIds } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <CheckoutScreen />
    </RequireAuth>
  ),
});

function CheckoutScreen() {
  const { pendingCheckoutId, listings, plans, selectedPlanId, selectedAddonId, addons, markPaid } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const listing = listings.find((l) => l.id === pendingCheckoutId);
  const plan = plans.find((p) => p.id === (listing?.subscriptionId || selectedPlanId));
  const selectedAddons = addons.filter((a) => parseAddonIds(listing?.addonId || selectedAddonId).includes(a.id));
  const total = (plan?.price ?? 0) + selectedAddons.reduce((sum, a) => sum + a.price, 0);

  async function pay() {
    if (!listing) {
      navigate({ to: "/payment/cancel" });
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    markPaid(listing.id);
    navigate({ to: "/payment/success" });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-28">
      <Header title="Checkout" back fallbackTo="/inventory" />
      <div className="flex-1 px-4 pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Stripe Checkout</p>
        <h2 className="mt-2 text-[22px] font-semibold text-foreground">Complete payment</h2>
        <p className="mt-1 text-[15px] text-muted-foreground">
          External checkout stub — replace with Stripe Checkout when the API is live.
        </p>
        <div className="mt-6 border border-border bg-card p-4">
          <p className="text-[13px] text-muted-foreground">Listing</p>
          <p className="text-[17px] font-semibold text-foreground">
            {listing ? `${listing.year} ${listing.make} ${listing.model}` : "No listing in session"}
          </p>
          <div className="mt-4 space-y-2 text-[15px] text-foreground">
            <div className="flex justify-between">
              <span>{plan?.name} plan</span>
              <span>${plan?.price ?? 0}</span>
            </div>
            {selectedAddons.map((addon) => (
              <div key={addon.id} className="flex justify-between">
                <span>{addon.name}</span>
                <span>${addon.price}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 space-y-2 bg-background px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Button full loading={loading} onClick={pay}>
          Pay ${total}
        </Button>
        <Button variant="outline" full onClick={() => navigate({ to: "/payment/cancel" })}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
