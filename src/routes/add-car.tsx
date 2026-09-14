import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AddCarWizard } from "@/components/AddCarWizard";
import { RequireAuth } from "@/components/RequireAuth";
import { usaSampleDraft } from "@/lib/sample-draft";
import { useApp } from "@/lib/store";

type Search = { step?: number };

export const Route = createFileRoute("/add-car")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    step: Math.min(10, Math.max(1, Number(s.step) || 1)),
  }),
  head: () => ({ meta: [{ title: "Add car · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <AddCarPage />
    </RequireAuth>
  ),
});

function AddCarPage() {
  const { step = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { draft, setDraft, selectedPlanId, selectedAddonId } = useApp();

  useEffect(() => {
    if (draft.make && draft.model) return;
    const sample = usaSampleDraft({
      subscriptionId: draft.subscriptionId || selectedPlanId,
      addonId: draft.addonId || selectedAddonId,
      bundleId: draft.bundleId,
    });
    setDraft(sample);
  }, [draft.make, draft.model, draft.subscriptionId, draft.addonId, draft.bundleId, selectedPlanId, selectedAddonId, setDraft]);

  return (
    <AddCarWizard
      step={step}
      mode="create"
      onStep={(next) => navigate({ search: { step: next } })}
    />
  );
}
