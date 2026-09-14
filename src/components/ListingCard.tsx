import { Link } from "@tanstack/react-router";
import { CalendarDays, CircleCheck, Star } from "lucide-react";
import { SafeImg } from "@/components/SafeImg";
import { computeScore } from "@/lib/score";
import type { Listing, Plan } from "@/lib/types";
import { cn } from "@/lib/utils";

export function money(value: string | number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return `$${n.toLocaleString()}`;
}

export function listingTitle(l: Pick<Listing, "year" | "make" | "model">) {
  return [l.year, l.make, l.model].filter(Boolean).join(" ");
}

export function listingExpireAt(listing: Listing, plans: Plan[]): Date | null {
  if (listing.status === "draft" || listing.status === "unpaid") return null;
  const plan = plans.find((p) => p.id === listing.subscriptionId);
  if (!plan) return null;
  return new Date(new Date(listing.createdAt).getTime() + plan.durationDays * 86_400_000);
}

export function isListingExpired(listing: Listing, plans: Plan[]): boolean {
  if (listing.status === "sold") return true;
  const expires = listingExpireAt(listing, plans);
  return Boolean(expires && expires.getTime() < Date.now());
}

function timeAgo(iso: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
  if (days <= 0) return "today";
  return `${days}d ago`;
}

function formatExpire(date: Date | null) {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function AdCard({
  listing,
  plan,
  pending,
  onPay,
}: {
  listing: Listing;
  plan?: Plan;
  pending?: boolean;
  onPay?: () => void;
}) {
  const score = pending ? null : computeScore(listing, listing);
  const expires = listingExpireAt(listing, plan ? [plan] : []);
  const subscription = pending || !plan ? "N/A" : plan.shortName;

  return (
    <article className="border border-border bg-card p-3">
      <Link to="/inventory/$id" params={{ id: listing.id }} className="flex gap-3">
        <SafeImg
          src={listing.thumbnail}
          alt={listingTitle(listing)}
          className="h-[5.5rem] w-[5.5rem] shrink-0 object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {score ? (
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-16 overflow-hidden bg-muted">
                    <span className="block h-full bg-primary" style={{ width: `${Math.min(100, score.total)}%` }} />
                  </span>
                  <span className="text-[12px] font-semibold text-foreground">{score.total}/100</span>
                </div>
              ) : (
                <p className="text-[12px] font-semibold text-foreground">Score: N/A</p>
              )}
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <CalendarDays size={12} strokeWidth={1.75} className="shrink-0" />
                Expire on: {formatExpire(expires)}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Star size={12} strokeWidth={1.75} className="shrink-0" />
                Subscription: {subscription}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-[11px] text-muted-foreground">{timeAgo(listing.updatedAt || listing.createdAt)}</span>
              {pending && (
                <span className="bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">Draft</span>
              )}
            </div>
          </div>
          <h3 className={cn("mt-2 truncate text-[15px] font-semibold text-foreground", listing.status === "sold" && "line-through")}>
            {listingTitle(listing)}
          </h3>
          <p className="text-[13px] text-muted-foreground">Used</p>
        </div>
      </Link>

      {pending ? (
        <button
          type="button"
          onClick={onPay}
          className="mt-3 inline-flex h-11 w-full items-center justify-center bg-primary text-[17px] font-semibold text-white"
        >
          Pay Now
        </button>
      ) : listing.status === "sold" || isListingExpired(listing, plan ? [plan] : []) ? (
        <div className="mt-3 inline-flex h-11 w-full items-center justify-center border border-border text-[17px] font-semibold text-muted-foreground">
          {listing.status === "sold" ? "Sold" : "Expired"}
        </div>
      ) : (
        <div className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 border border-border text-[17px] font-semibold text-foreground">
          <CircleCheck size={16} strokeWidth={2.2} className="text-success" />
          {plan?.kind === "bundle" ? "Package Subscription" : "Paid"}
        </div>
      )}
    </article>
  );
}

export function BrowseCard({ listing }: { listing: Listing }) {
  return (
    <Link to="/listing/$id" params={{ id: listing.id }} className="block border border-border bg-card">
      <div className="relative">
        <SafeImg src={listing.thumbnail} alt={listingTitle(listing)} className="h-40 w-full object-cover" />
        {listing.featured && (
          <span className="absolute left-0 top-0 bg-trust px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>
      <div className="p-3">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {listingTitle(listing)}
            {listing.trim ? ` ${listing.trim}` : ""}
          </h3>
          <p className="text-sm font-semibold text-trust">{money(listing.price)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {listing.city}, {listing.state} · {Number(listing.mileage || 0).toLocaleString()} mi
          </p>
      </div>
    </Link>
  );
}

/** Compact 2-column tile for the home showroom grid. */
export function FeaturedTile({ listing }: { listing: Listing }) {
  return (
    <Link to="/listing/$id" params={{ id: listing.id }} className="block min-w-0">
      <div className="relative overflow-hidden bg-muted">
        <SafeImg
          src={listing.thumbnail}
          alt={listingTitle(listing)}
          className="aspect-[4/3] w-full object-cover"
        />
        {listing.featured && (
          <span className="absolute left-0 top-0 bg-primary px-2 py-1 text-[11px] font-semibold text-white">
            Featured
          </span>
        )}
      </div>
      <h3 className="mt-2 truncate text-[15px] font-semibold leading-tight text-foreground">
        {listing.make} {listing.model}
      </h3>
      <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
        {listing.year}
        {listing.transmission ? ` · ${listing.transmission}` : ""}
      </p>
      <p className="mt-1 text-[15px] font-semibold text-trust">{money(listing.price)}</p>
    </Link>
  );
}
