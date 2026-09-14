import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/kit";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy · SellMyAuto" }] }),
  component: PrivacyScreen,
});

function PrivacyScreen() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="Privacy Policy" fallbackTo="/register" />
      <article className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-8 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground">Last updated: September 11, 2026</p>
        <p>
          We collect the account details you provide (name, email, phone), listing data, and basic device
          information needed to run the app. Payment is processed by Stripe; we do not store full card numbers.
        </p>
        <p>
          We use session tokens to keep you signed in and a first-launch flag so onboarding shows once. We do not
          sell personal data. You can request account deletion from Profile.
        </p>
      </article>
    </div>
  );
}
