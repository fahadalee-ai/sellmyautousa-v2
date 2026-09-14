import type { Listing, ListingDraft, RelevanceScore } from "./types";

const QUALITY_MAX = 40;
const RECENCY_MAX = 30;
const ENGAGEMENT_MAX = 20;
const COMPLETENESS_MAX = 10;

export function photoQualityPoints(count: number): number {
  if (count >= 50) return 35;
  if (count >= 30) return 28;
  if (count >= 10) return 18;
  if (count >= 1) return 8;
  return 0;
}

export function qualityHint(count: number): string {
  if (count >= 50) return "50+ photos = max 35 pts";
  if (count >= 30) return "Add more photos — 50+ photos = max 35 pts";
  if (count >= 10) return "30+ photos unlocks the next Quality tier";
  return "10+ photos unlocks Quality points";
}

export function computeQuality(draft: Pick<ListingDraft, "gallery" | "thumbnail" | "video">): number {
  const count = draft.gallery.length + (draft.thumbnail ? 1 : 0);
  const photos = photoQualityPoints(count);
  const videoBonus = draft.video ? 5 : 0;
  return Math.min(QUALITY_MAX, photos + videoBonus);
}

const SPEC_KEYS: (keyof ListingDraft)[] = [
  "mileage",
  "transmission",
  "fuelType",
  "drivetrain",
  "engineSize",
  "exteriorColor",
  "interiorColor",
  "seats",
  "doors",
];

export function computeCompleteness(draft: ListingDraft): number {
  let pts = 0;
  if (draft.vinDecoded) pts += 4;
  const filled = SPEC_KEYS.filter((k) => String(draft[k] ?? "").trim().length > 0).length;
  pts += Math.round((filled / SPEC_KEYS.length) * 6);
  return Math.min(COMPLETENESS_MAX, pts);
}

export function computeRecency(createdAt?: string): number {
  if (!createdAt) return RECENCY_MAX;
  const days = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 86_400_000);
  return Math.max(0, Math.round(RECENCY_MAX - days * 0.6));
}

export function computeEngagement(listing?: Pick<Listing, "views" | "favorites" | "chats">): number {
  if (!listing) return 0;
  const raw = listing.views * 0.15 + listing.favorites * 1.5 + listing.chats * 3;
  return Math.min(ENGAGEMENT_MAX, Math.round(raw));
}

export function computeScore(draft: ListingDraft, listing?: Listing): RelevanceScore {
  const recency = computeRecency(listing?.createdAt);
  const quality = computeQuality(draft);
  const completeness = computeCompleteness(draft);
  const engagement = computeEngagement(listing);
  return {
    recency,
    quality,
    engagement,
    completeness,
    total: recency + quality + engagement + completeness,
  };
}

export const SCORE_CAPS = {
  recency: RECENCY_MAX,
  quality: QUALITY_MAX,
  engagement: ENGAGEMENT_MAX,
  completeness: COMPLETENESS_MAX,
} as const;
