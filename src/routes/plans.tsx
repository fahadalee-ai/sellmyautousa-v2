import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { Button, Card, Header } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans")({
  head: () => ({ meta: [{ title: "Choose a plan · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <PlansScreen />
    </RequireAuth>
  ),
});

function PlansScreen() {
  const { plans, addons, selectedPlanId, selectedAddonId, setSelectedPlanId, setSelectedAddonId, resetDraft, updateUser } =
    useApp();
  const navigate = useNavigate();
  const plan = plans.find((p) => p.id === selectedPlanId);

  function continueToAdd() {
    const bundleId = plan?.kind === "bundle" ? plan.id : "";
    updateUser({
      subscriptionId: selectedPlanId,
      addonIds: selectedAddonId ? [selectedAddonId] : [],
    });
    resetDraft({
      subscriptionId: selectedPlanId,
      addonId: selectedAddonId,
      bundleId,
    });
    navigate({ to: "/add-car", search: { step: 1 } });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-28">
      <Header title="Choose a plan" back fallbackTo="/home" />
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 pb-4">
        {plans.map((p) => (
          <Card key={p.id} selected={selectedPlanId === p.id} onClick={() => setSelectedPlanId(p.id)}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-trust">{p.kind}</p>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm text-muted-foreground">{p.durationDays} days · {p.photoLimit} photos</p>
              </div>
              <p className="text-xl font-semibold text-foreground">${p.price}</p>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {p.includes.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </Card>
        ))}

        <div className="pt-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Optional add-ons</p>
          {addons.map((a) => {
            const on = selectedAddonId === a.id;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedAddonId(on ? "" : a.id)}
                className={cn("flex w-full items-start justify-between gap-3 border px-3 py-3 text-left", on ? "border-2 border-primary" : "border-border")}
              >
                <span>
                  <span className="block text-sm font-semibold">{a.name}</span>
                  <span className="text-xs text-muted-foreground">{a.description}</span>
                </span>
                <span className="text-sm font-semibold">${a.price}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Button full onClick={continueToAdd}>
          Continue to Add Car
        </Button>
      </div>
    </div>
  );
}
