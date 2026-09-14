import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/kit";
import { ScoreBar } from "@/components/RelevanceScore";
import { SCORE_CAPS } from "@/lib/score";

export const Route = createFileRoute("/point-notes")({
  head: () => ({ meta: [{ title: "Listing Relevance Score · SellMyAuto" }] }),
  component: PointNotesScreen,
});

function PointNotesScreen() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <Header title="Listing Relevance Score" fallbackTo="/profile" />
      <article className="no-scrollbar space-y-6 overflow-y-auto px-4 pb-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          Every listing earns a <span className="font-semibold text-foreground">Listing Relevance Score</span> out of
          100. It is a ranking signal — not a wallet, loyalty balance, or cash-back currency.
        </p>

        <section className="border border-border bg-card p-4">
          <ScoreBar label="Recency" value={30} cap={SCORE_CAPS.recency} />
          <p className="mt-3">
            New listings start at the full <strong className="text-foreground">30 / 30</strong> Recency allocation.
            The score tapers as the listing ages so fresh inventory stays visible.
          </p>
        </section>

        <section className="border border-border bg-card p-4">
          <ScoreBar label="Listing Quality" value={40} cap={SCORE_CAPS.quality} />
          <ul className="mt-3 list-disc space-y-1 pl-4">
            <li>A required hi-res thumbnail is the baseline.</li>
            <li>10+ photos unlocks Quality points.</li>
            <li>30+ photos raises the next Quality tier.</li>
            <li>50+ photos = max 35 points from photography.</li>
            <li>An optional video adds a +5 Quality bonus (40 cap).</li>
          </ul>
        </section>

        <section className="border border-border bg-card p-4">
          <ScoreBar label="Engagement" value={0} cap={SCORE_CAPS.engagement} />
          <p className="mt-3">
            Engagement is 0 before launch. After you publish, views, saves, and inbox conversations add up to{" "}
            <strong className="text-foreground">20</strong>. Stronger interest ranks the listing higher.
          </p>
        </section>

        <section className="border border-border bg-card p-4">
          <ScoreBar label="Completeness & Accuracy" value={10} cap={SCORE_CAPS.completeness} />
          <ul className="mt-3 list-disc space-y-1 pl-4">
            <li>A decoded VIN earns the VIN completeness bonus.</li>
            <li>Filled specs (mileage, drivetrain, colors, seats, doors) complete the remaining allocation.</li>
            <li>Max 10. Skipping VIN decode leaves Completeness short of full credit.</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
