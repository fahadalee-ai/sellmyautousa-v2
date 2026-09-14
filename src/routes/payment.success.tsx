import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LinkButton } from "@/components/kit";

export const Route = createFileRoute("/payment/success")({
  head: () => ({ meta: [{ title: "You're live · SellMyAuto" }] }),
  component: PaymentSuccess,
});

function PaymentSuccess() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 pb-24 text-center">
      <Logo tone="color" size="lg" className="mb-6 max-w-[16rem]" />
      <div className="flex h-24 w-24 items-center justify-center bg-success">
        <Check size={48} strokeWidth={2.4} className="text-white" />
      </div>
      <h1 className="mt-6 text-[22px] font-semibold tracking-tight">You&apos;re Live!</h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Your listing is published and visible to buyers.
      </p>
      <LinkButton to="/inventory" full className="mt-8">
        View in Inventory
      </LinkButton>
    </div>
  );
}
