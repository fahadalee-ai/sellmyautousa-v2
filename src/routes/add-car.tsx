import { createFileRoute } from "@tanstack/react-router";
import { AddCarWizard } from "@/components/AddCarWizard";
import { RequireAuth } from "@/components/RequireAuth";

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
  return (
    <AddCarWizard
      step={step}
      mode="create"
      onStep={(next) => navigate({ search: { step: next } })}
    />
  );
}
