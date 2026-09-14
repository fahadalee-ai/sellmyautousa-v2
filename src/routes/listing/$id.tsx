import { createFileRoute, Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
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
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BrowseCard, listingTitle, money } from "@/components/ListingCard";
import { RelevanceScore } from "@/components/RelevanceScore";
import { SafeImg } from "@/components/SafeImg";
import { Button, Chip } from "@/components/kit";
import { sellerFor } from "@/lib/mock-data";
import { computeScore } from "@/lib/score";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/listing/$id")({
  head: () => ({ meta: [{ title: "Vehicle · Sell My Auto USA" }] }),
  component: ListingView,
});

function formatPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

function ListingView() {
  const { id } = Route.useParams();
  const { listings, favoriteIds, toggleFavorite, user, pushToast } = useApp();
  const listing = listings.find((l) => l.id === id);
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const [photo, setPhoto] = useState(0);

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
      <div className="min-h-dvh bg-white px-4 pt-[max(1rem,env(safe-area-inset-top))]">
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
    <div className="min-h-dvh bg-white pb-28">
      <div className="relative">
        <SafeImg src={current} alt={listingTitle(listing)} className="h-[58vw] max-h-[340px] min-h-[240px] w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 pt-[max(0.65rem,env(safe-area-inset-top))]">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/home" }))}
            className="flex h-11 w-11 items-center justify-center bg-white text-[#1A1A1A]"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Share"
              onClick={share}
              className="flex h-11 w-11 items-center justify-center bg-white text-[#1A1A1A]"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              aria-label={saved ? "Remove from saved" : "Save listing"}
              onClick={() => toggleFavorite(listing.id)}
              className={cn("flex h-11 w-11 items-center justify-center bg-white", saved ? "text-primary" : "text-[#1A1A1A]")}
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
        <div className="no-scrollbar flex gap-2 overflow-x-auto bg-white px-4 py-3">
          {photos.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setPhoto(idx)}
              className={cn("h-14 w-20 shrink-0 overflow-hidden border-2", idx === photo ? "border-primary" : "border-transparent")}
            >
              <SafeImg src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-5 px-4 pb-8 pt-2">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {listing.featured && <Chip tone="trust">Featured</Chip>}
            {listing.vinDecoded && <Chip tone="success">VIN verified</Chip>}
            {listing.status === "sold" && <Chip tone="sold">Sold</Chip>}
            {listing.status === "unpaid" && <Chip tone="danger">Unpaid</Chip>}
            <Chip tone="muted">{listing.titleStatus} title</Chip>
          </div>
          <h1 className="mt-2 text-[1.65rem] font-semibold leading-tight tracking-tight text-[#1A1A1A]">
            {listingTitle(listing)}
            {listing.trim ? ` ${listing.trim}` : ""}
          </h1>
          <p className="mt-1 text-2xl font-semibold text-trust">{money(listing.price)}</p>
          {listing.priceStance && (
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {listing.priceStance === "firm" ? "Price firm" : "Negotiable"}
            </p>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={14} /> {listing.city}, {listing.state} {listing.zip} · {listing.listedLabel}
          </p>
        </div>

        <div className="grid grid-cols-4 border border-border">
          {specs.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="border-r border-border px-2 py-3 last:border-r-0">
                <Icon size={16} className="text-trust" />
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                <p className="text-xs font-semibold leading-tight">{s.value}</p>
              </div>
            );
          })}
        </div>

        {(listing.highlights ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(listing.highlights ?? []).map((h) => (
              <span key={h} className="border border-border bg-[#F4F4F5] px-2 py-1 text-xs font-medium">
                {h}
              </span>
            ))}
          </div>
        )}

        <section>
          <h2 className="text-base font-semibold">Overview</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3F3F46]">{listing.description || "Seller has not added a description yet."}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold">Vehicle details</h2>
          <dl className="mt-2 divide-y divide-border border border-border">
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
              <div key={k} className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>

        {listing.features.length > 0 && (
          <section>
            <h2 className="text-base font-semibold">Features</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {listing.features.map((f) => (
                <span key={f} className="border border-border px-2 py-1 text-xs">
                  {f}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="border border-border p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={16} className="text-success" />
            Vehicle history
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {listing.historyReport || "No history report attached. Ask the seller for a Carfax or AutoCheck."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {listing.owners} owner · {listing.accidents} reported accidents · {listing.titleStatus} title
          </p>
        </section>

        <section className="flex items-center gap-3 border border-border bg-white p-3">
          <div className="flex h-12 w-12 items-center justify-center bg-trust text-sm font-semibold text-white">
            {(seller?.fullName ?? "S")
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <UserRound size={14} className="text-trust" />
              {seller?.fullName ?? "Private seller"}
            </p>
            <p className="text-xs text-muted-foreground">
              Private party · {listing.city} · Member since 2024
            </p>
          </div>
          <Calendar size={16} className="text-muted-foreground" />
        </section>

        {mine && <RelevanceScore score={score} expanded showHelp />}

        {similar.length > 0 && (
          <section>
            <h2 className="mb-3 text-base font-semibold">Similar listings</h2>
            <div className="space-y-3">
              {similar.map((l) => (
                <BrowseCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </div>

      {listing.status !== "sold" && (
        <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 gap-2 border-t border-border bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {showPhone && seller?.phone && (
            <a
              href={`tel:+1${seller.phone.replace(/\D/g, "")}`}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-trust text-sm font-semibold text-trust"
            >
              <Phone size={16} /> {formatPhone(seller.phone)}
            </a>
          )}
          <Button
            className={showPhone && seller?.phone ? "flex-1" : "w-full"}
            onClick={() => {
              pushToast("Message started", "Inbox is ready — this is a demo thread.");
              router.navigate({ to: "/inbox" });
            }}
          >
            <MessageSquare size={16} /> Message seller
          </Button>
        </div>
      )}
    </div>
  );
}
