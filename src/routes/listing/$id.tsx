import { createFileRoute, Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Droplets,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MessageSquare,
  Phone,
  Settings2,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { listingTitle, money } from "@/components/ListingCard";
import { RelevanceScore } from "@/components/RelevanceScore";
import { SafeImg } from "@/components/SafeImg";
import { BottomSheet, Button, Chip, Input } from "@/components/kit";
import { sellerFor } from "@/lib/mock-data";
import { computeScore } from "@/lib/score";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/listing/$id")({
  head: () => ({ meta: [{ title: "Vehicle · Sell My Auto USA" }] }),
  component: ListingView,
});

function ListingView() {
  const { id } = Route.useParams();
  const { listings, favoriteIds, toggleFavorite, user, pushToast, sendOffer, startConversation } = useApp();
  const listing = listings.find((l) => l.id === id);
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const [photo, setPhoto] = useState(0);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");

  const seller = listing ? sellerFor(listing.ownerId) ?? user : undefined;
  const photos = useMemo(
    () => (listing ? [listing.thumbnail, ...listing.gallery].filter(Boolean) : []),
    [listing],
  );
  const similar = useMemo(
    () =>
      listings
        .filter((l) => l.id !== id && l.status === "paid" && (l.bodyType === listing?.bodyType || l.make === listing?.make))
        .slice(0, 3),
    [listings, id, listing],
  );

  if (!listing) {
    return (
      <div className="min-h-dvh bg-background px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <p className="text-sm text-muted-foreground">This listing is no longer available.</p>
        <Link to="/home" className="mt-3 inline-block text-sm font-semibold text-trust">
          Back to Home
        </Link>
      </div>
    );
  }

  const car = listing;
  const saved = favoriteIds.includes(car.id);
  const score = computeScore(car, car);
  const mine = user?.id === car.ownerId;
  const showPhone = car.commMode !== "chat";
  const current = photos[photo] ?? car.thumbnail;

  function share() {
    const title = listingTitle(car);
    if (navigator.share) {
      void navigator.share({ title, text: `${title} · ${money(car.price)}` });
      return;
    }
    void navigator.clipboard?.writeText(window.location.href);
    pushToast("Link copied");
  }

  const specs = [
    { icon: Gauge, label: "Mileage", value: `${Number(listing.mileage || 0).toLocaleString()} mi` },
    { icon: Settings2, label: "Trans", value: listing.transmission || "—" },
    { icon: Fuel, label: "Fuel", value: listing.fuelType || "—" },
    { icon: Droplets, label: "Drivetrain", value: listing.drivetrain || "—" },
  ];

  return (
    <div className="min-h-dvh bg-background pb-44">
      <div className="relative">
        <SafeImg src={current} alt={listingTitle(listing)} className="h-[58vw] max-h-[340px] min-h-[240px] w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-[max(0.65rem,env(safe-area-inset-top))]">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/home" }))}
            className="flex h-11 w-11 items-center justify-center bg-card text-foreground"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Share"
              onClick={share}
              className="flex h-11 w-11 items-center justify-center bg-card text-foreground"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              aria-label={saved ? "Remove from saved" : "Save listing"}
              onClick={() => toggleFavorite(listing.id)}
              className={cn("flex h-11 w-11 items-center justify-center bg-card", saved ? "text-primary" : "text-foreground")}
            >
              <Heart size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
            {photo + 1} / {photos.length}
          </div>
        )}
      </div>

      {photos.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-background px-4 py-3">
          {photos.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setPhoto(idx)}
              className={cn("h-12 w-[4.5rem] shrink-0 overflow-hidden border-2", idx === photo ? "border-primary" : "border-transparent")}
            >
              <SafeImg src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6 px-4 pb-6 pt-2">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {listing.featured && <Chip tone="trust">Featured</Chip>}
            {listing.vinDecoded && <Chip tone="success">VIN verified</Chip>}
            {listing.status === "sold" && <Chip tone="sold">Sold</Chip>}
            {listing.status === "unpaid" && <Chip tone="danger">Unpaid</Chip>}
            <Chip tone="muted">{listing.titleStatus} title</Chip>
          </div>
          <h1 className="mt-2 text-[22px] font-semibold leading-snug tracking-tight text-foreground">
            {listingTitle(listing)}
            {listing.trim ? ` ${listing.trim}` : ""}
          </h1>
          <p className="mt-1 text-[22px] font-semibold text-trust">{money(listing.price)}</p>
          {listing.priceStance && (
            <p className="text-[13px] text-muted-foreground">
              {listing.priceStance === "firm" ? "Price firm" : "Negotiable"}
            </p>
          )}
          <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-muted-foreground">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>
              {listing.city}, {listing.state} {listing.zip}
              <span className="mt-0.5 block">{listing.listedLabel}</span>
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 border border-border">
          {specs.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={cn(
                  "flex min-w-0 items-start gap-2.5 px-3 py-3",
                  i % 2 === 0 && "border-r border-border",
                  i < 2 && "border-b border-border",
                )}
              >
                <Icon size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-trust" />
                <div className="min-w-0">
                  <p className="text-[13px] leading-none text-muted-foreground">{s.label}</p>
                  <p className="mt-1 truncate text-[15px] font-semibold leading-snug">{s.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {(listing.highlights ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(listing.highlights ?? []).map((h) => (
              <span key={h} className="border border-border bg-muted px-2.5 py-1.5 text-[13px] font-medium">
                {h}
              </span>
            ))}
          </div>
        )}

        <section>
          <h2 className="text-[17px] font-semibold">Overview</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            {listing.description || "Seller has not added a description yet."}
          </p>
        </section>

        <section>
          <h2 className="text-[17px] font-semibold">Vehicle details</h2>
          <dl className="mt-2 border border-border">
            {[
              ["Body", listing.bodyType],
              ["Engine", listing.engineSize],
              ["Horsepower", listing.horsepower],
              ["Exterior", listing.exteriorColor],
              ["Interior", listing.interiorColor],
              ["Seats / doors", `${listing.seats || "—"} / ${listing.doors || "—"}`],
              ["MPG / MPGe", listing.mpgCity ? `${listing.mpgCity} city · ${listing.mpgHwy} hwy` : "—"],
              ["VIN", listing.vin || "Not provided"],
              ["Title", listing.titleStatus],
              ["Owners", listing.owners],
              ["Accidents", listing.accidents],
            ].map(([k, v]) => (
              <div key={k} className="flex min-h-11 items-center justify-between gap-3 border-b border-border px-3 last:border-b-0">
                <dt className="shrink-0 text-[15px] text-muted-foreground">{k}</dt>
                <dd className="min-w-0 break-all text-right text-[15px] font-medium">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>

        {listing.features.length > 0 && (
          <section>
            <h2 className="text-[17px] font-semibold">Features</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {listing.features.map((f) => (
                <span key={f} className="border border-border px-2.5 py-1.5 text-[13px] leading-snug">
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="border border-border px-3 py-3">
          <div className="flex items-center gap-2 text-[17px] font-semibold">
            <ShieldCheck size={18} className="shrink-0 text-success" />
            Vehicle history
          </div>
          <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
            {listing.historyReport || "No history report attached. Ask the seller for a Carfax or AutoCheck."}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
            {[
              ["Owners", listing.owners || "—"],
              ["Accidents", listing.accidents || "0"],
              ["Title", listing.titleStatus || "—"],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <p className="text-[13px] text-muted-foreground">{k}</p>
                <p className="mt-0.5 truncate text-[15px] font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center gap-3 border border-border bg-card px-3 py-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-trust text-[13px] font-semibold text-white">
            {(seller?.fullName ?? "S")
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[17px] font-semibold">{seller?.fullName ?? "Private seller"}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
              Private party · {listing.city}
            </p>
          </div>
        </section>

        <RelevanceScore score={score} expanded showHelp />

        {similar.length > 0 && (
          <section>
            <h2 className="text-[17px] font-semibold">Similar listings</h2>
            <div className="mt-3 space-y-2">
              {similar.map((l) => (
                <Link
                  key={l.id}
                  to="/listing/$id"
                  params={{ id: l.id }}
                  className="flex items-center gap-3 border border-border p-2"
                >
                  <SafeImg src={l.thumbnail} alt="" className="h-16 w-[4.5rem] shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">
                      {listingTitle(l)}
                      {l.trim ? ` ${l.trim}` : ""}
                    </p>
                    <p className="text-[15px] font-semibold text-trust">{money(l.price)}</p>
                    <p className="truncate text-[13px] text-muted-foreground">
                      {l.city}, {l.state}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {listing.status !== "sold" && (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 space-y-2 border-t border-border bg-background px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-2">
            {showPhone && seller?.phone && (
              <a
                href={`tel:+1${seller.phone.replace(/\D/g, "")}`}
                className="inline-flex h-11 min-h-11 flex-1 items-center justify-center gap-1.5 border border-trust text-[17px] font-semibold text-trust"
              >
                <Phone size={16} /> Call
              </a>
            )}
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                const thread = startConversation(listing.id);
                router.navigate({ to: "/inbox/$id", params: { id: thread.id } });
              }}
            >
              <MessageSquare size={16} /> Message
            </Button>
          </div>
          {!mine && (
            <Button full onClick={() => setOfferOpen(true)}>
              Make an Offer
            </Button>
          )}
        </div>
      )}

      <BottomSheet open={offerOpen} onClose={() => setOfferOpen(false)} title="Make an Offer">
        <p className="text-[13px] text-muted-foreground">
          Asking price {money(listing.price)} · {listingTitle(listing)}
        </p>
        <div className="mt-3">
          <Input
            inputMode="numeric"
            placeholder="Your offer"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        {offerAmount && (
          <p className="mt-2 text-[17px] font-semibold text-trust">{money(offerAmount)}</p>
        )}
        <Button
          full
          className="mt-4"
          disabled={!offerAmount || Number(offerAmount) <= 0}
          onClick={() => {
            const thread = sendOffer(listing.id, offerAmount);
            setOfferOpen(false);
            setOfferAmount("");
            pushToast("Offer sent", "Your offer is in Inbox.");
            router.navigate({ to: "/inbox/$id", params: { id: thread.id } });
          }}
        >
          Send offer
        </Button>
      </BottomSheet>
    </div>
  );
}
