import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/kit";
import { useApp } from "@/lib/store";

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
  const addon = addons.find((a) => a.id === (listing?.addonId || selectedAddonId));
  const total = (plan?.price ?? 0) + (addon?.price ?? 0);

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
    <div className="flex min-h-dvh flex-col bg-[#0B0B0F] px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] text-white">
      <Logo tone="white" size="md" className="mb-6 max-w-[14.5rem]" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">Stripe Checkout</p>
      <h1 className="mt-2 text-2xl font-semibold">Complete payment</h1>
      <p className="mt-1 text-sm text-white/70">
        External checkout stub — replace with Stripe Checkout / web-view when the API is live.
      </p>
      <div className="mt-8 border border-white/15 bg-white/5 p-4">
        <p className="text-sm text-white/70">Listing</p>
        <p className="font-semibold">
          {listing ? `${listing.year} ${listing.make} ${listing.model}` : "No listing in session"}
        </p>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{plan?.name} plan</span>
            <span>${plan?.price ?? 0}</span>
          </div>
          {addon && (
            <div className="flex justify-between">
              <span>{addon.name}</span>
              <span>${addon.price}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-white/15 pt-2 font-semibold">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <Button full loading={loading} onClick={pay}>
          Pay ${total}
        </Button>
        <Button variant="light" full onClick={() => navigate({ to: "/payment/cancel" })}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
