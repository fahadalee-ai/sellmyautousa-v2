import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/kit";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms · SellMyAuto" }] }),
  component: TermsScreen,
});

function TermsScreen() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="Terms & Conditions" fallbackTo="/register" />
      <article className="no-scrollbar space-y-4 overflow-y-auto px-4 pb-8 text-sm leading-relaxed text-muted-foreground">
        <p className="text-foreground">Last updated: September 11, 2026</p>
        <p>
          SellMyAuto is a for-sale-by-owner marketplace. We do not buy, sell, or take title to vehicles. Listings
          are posted by private parties. You are responsible for the accuracy of your listing, VIN, photos, and
          price.
        </p>
        <p>
          Paid plans, featured placement, and add-on boosts are listing products — they are not a wallet, loyalty
          currency, or cash-back program. Editing a published listing returns it to Unpaid until you republish.
        </p>
        <p>
          Communication on the platform (chat and optional phone) must stay lawful and respectful. We may remove
          listings that violate these terms.
        </p>
      </article>
    </div>
  );
}
