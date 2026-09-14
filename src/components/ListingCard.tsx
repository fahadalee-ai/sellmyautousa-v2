import { Link } from "@tanstack/react-router";
import { Eye, Pencil, Trash2, BadgeCheck } from "lucide-react";
import { Chip } from "@/components/kit";
import { SafeImg } from "@/components/SafeImg";
import { RelevanceScore } from "@/components/RelevanceScore";
import { computeScore } from "@/lib/score";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

function statusTone(status: Listing["status"]) {
  if (status === "paid") return "success" as const;
  if (status === "unpaid") return "danger" as const;
  if (status === "sold") return "sold" as const;
  return "muted" as const;
}

export function money(value: string | number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return `$${n.toLocaleString()}`;
}

export function listingTitle(l: Pick<Listing, "year" | "make" | "model">) {
  return [l.year, l.make, l.model].filter(Boolean).join(" ");
}

export function InventoryCard({
  listing,
  onSold,
  onDelete,
}: {
  listing: Listing;
  onSold: () => void;
  onDelete: () => void;
}) {
  const score = computeScore(listing, listing);
  return (
    <article className="border border-border bg-card">
      <Link to="/inventory/$id" params={{ id: listing.id }} className="flex gap-3 p-3">
        <SafeImg
          src={listing.thumbnail}
          alt={listingTitle(listing)}
          className="h-24 w-28 shrink-0 object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip tone={statusTone(listing.status)}>{listing.status}</Chip>
            {listing.featured && <Chip tone="trust">Featured</Chip>}
          </div>
          <h3 className={cn("mt-1 truncate text-sm font-semibold", listing.status === "sold" && "line-through")}>
            {listingTitle(listing)}
          </h3>
          <p className="text-sm font-semibold text-trust">{money(listing.price)}</p>
        </div>
      </Link>
      <div className="px-3 pb-3">
        <RelevanceScore score={score} compact />
        <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
          <Link
            to="/listing/$id"
            params={{ id: listing.id }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-trust"
          >
            <Eye size={14} /> View
          </Link>
          <Link
            to="/inventory/$id/edit"
            params={{ id: listing.id }}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-foreground"
          >
            <Pencil size={14} /> Edit
          </Link>
          <button
            type="button"
            onClick={onSold}
            disabled={listing.status === "sold"}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-foreground disabled:opacity-40"
          >
            <BadgeCheck size={14} /> Sold
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-primary"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
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
