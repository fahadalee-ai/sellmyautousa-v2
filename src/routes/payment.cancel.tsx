import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, LinkButton } from "@/components/kit";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/payment/cancel")({
  head: () => ({ meta: [{ title: "Payment not completed · SellMyAuto" }] }),
  component: PaymentCancel,
});

function PaymentCancel() {
  const { pendingCheckoutId } = useApp();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 pb-24 text-center">
      <div className="h-2 w-24 bg-primary" />
      <h1 className="mt-6 text-[22px] font-semibold tracking-tight">Payment Not Completed</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Your listing is saved as a draft. Try again anytime from Inventory.
      </p>
      <div className="mt-8 w-full space-y-2">
        <Button
          full
          onClick={() => navigate({ to: pendingCheckoutId ? "/checkout" : "/inventory" })}
        >
          Retry Payment
        </Button>
        <LinkButton to="/inventory" variant="outline" full>
          Back to Inventory
        </LinkButton>
      </div>
    </div>
  );
}
