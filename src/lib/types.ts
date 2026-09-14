export type Role = "user" | "admin";

export type ThemeMode = "light" | "dark";

export type ListingStatus = "draft" | "unpaid" | "paid" | "sold";

export type PriceStance = "negotiable" | "firm" | null;

export type CommMode = "chat" | "chat_phone" | "phone";

export type PlanKind = "package" | "bundle";

export type RelevanceScore = {
  recency: number;
  quality: number;
  engagement: number;
  completeness: number;
  total: number;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  verified: boolean;
  subscriptionId?: string;
  addonIds: string[];
};

export type Plan = {
  id: string;
  kind: PlanKind;
  name: string;
  shortName: string;
  tagline: string;
  price: number;
  durationDays: number;
  photoLimit: number;
  featured: boolean;
  includes: string[];
};

export type Addon = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export type ListingDraft = {
  year: string;
  make: string;
  model: string;
  trim: string;
  bodyType: string;
  vin: string;
  vinDecoded: boolean;
  mileage: string;
  transmission: string;
  fuelType: string;
  drivetrain: string;
  engineSize: string;
  exteriorColor: string;
  interiorColor: string;
  seats: string;
  doors: string;
  state: string;
  city: string;
  features: string[];
  price: string;
  priceStance: PriceStance;
  thumbnail: string;
  gallery: string[];
  video: string;
  historyReport: string;
  commMode: CommMode;
  subscriptionId: string;
  addonId: string;
  bundleId: string;
  description: string;
  titleStatus: string;
  owners: string;
  accidents: string;
  mpgCity: string;
  mpgHwy: string;
  zip: string;
  highlights: string[];
  horsepower: string;
  listedLabel: string;
};

export type Listing = ListingDraft & {
  id: string;
  ownerId: string;
  status: ListingStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
  chats: number;
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  kind: "text" | "offer";
  amount?: string;
  at: string;
};

export type Conversation = {
  id: string;
  listingId: string;
  listingTitle: string;
  listingThumb: string;
  peerName: string;
  buyerId?: string;
  lastMessage: string;
  lastAt: string;
  unread: number;
  messages: ChatMessage[];
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export function parseAddonIds(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export const emptyDraft = (plan?: Partial<Pick<ListingDraft, "subscriptionId" | "addonId" | "bundleId">>): ListingDraft => ({
  year: "",
  make: "",
  model: "",
  trim: "",
  bodyType: "",
  vin: "",
  vinDecoded: false,
  mileage: "",
  transmission: "",
  fuelType: "",
  drivetrain: "",
  engineSize: "",
  exteriorColor: "",
  interiorColor: "",
  seats: "",
  doors: "",
  state: "",
  city: "",
  features: [],
  price: "",
  priceStance: null,
  thumbnail: "",
  gallery: [],
  video: "",
  historyReport: "",
  commMode: "chat",
  subscriptionId: plan?.subscriptionId ?? "",
  addonId: plan?.addonId ?? "",
  bundleId: plan?.bundleId ?? "",
  description: "",
  titleStatus: "Clean",
  owners: "1",
  accidents: "0",
  mpgCity: "",
  mpgHwy: "",
  zip: "",
  highlights: [],
  horsepower: "",
  listedLabel: "Listed today",
});
