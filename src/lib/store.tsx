import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  seedAddons,
  seedConversations,
  seedListings,
  seedNotifications,
  seedPlans,
  seedUsers,
} from "./mock-data";
import { clearStorage, readJson, readStorage, writeJson, writeStorage } from "./storage";
import { usaSampleDraft } from "./sample-draft";
import { emptyDraft, type Listing, type ListingDraft, type ThemeMode, type User } from "./types";

export type Toast = { id: number; title: string; body?: string };

type Store = {
  hydrated: boolean;
  users: User[];
  user: User | null;
  onboarded: boolean;
  markOnboarded: () => void;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  login: (identifier: string, password: string) => { ok: true };
  socialLogin: (provider: "google" | "apple") => { ok: true };
  register: (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => { ok: true; email: string };
  completeVerification: (email: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  listings: Listing[];
  myListings: Listing[];
  marketplace: Listing[];
  draft: ListingDraft;
  setDraft: (patch: Partial<ListingDraft>) => void;
  resetDraft: (plan?: Partial<Pick<ListingDraft, "subscriptionId" | "addonId" | "bundleId">>) => void;
  loadDraftFromListing: (listing: Listing) => void;
  createListing: (status?: Listing["status"]) => Listing;
  updateListing: (id: string, patch: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  markSold: (id: string) => void;
  markPaid: (id: string) => void;
  pendingCheckoutId: string | null;
  setPendingCheckoutId: (id: string | null) => void;
  selectedPlanId: string;
  selectedAddonId: string;
  setSelectedPlanId: (id: string) => void;
  setSelectedAddonId: (id: string) => void;
  plans: typeof seedPlans;
  addons: typeof seedAddons;
  conversations: typeof seedConversations;
  notifications: typeof seedNotifications;
  markAllRead: () => void;
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  toasts: Toast[];
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
  failedLogins: number;
};

const Ctx = createContext<Store | null>(null);

function loadSessionUser(users: User[]): User | null {
  const id = readStorage("session");
  if (!id) return null;
  return users.find((u) => u.id === id) ?? null;
}

function persistListings(list: Listing[]) {
  writeJson("listings-v2", list);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(seedUsers);
  const [user, setUser] = useState<User | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [draft, setDraftState] = useState<ListingDraft>(() => emptyDraft());
  const [selectedPlanId, setSelectedPlanId] = useState("plan-featured");
  const [selectedAddonId, setSelectedAddonId] = useState("");
  const [pendingCheckoutId, setPendingCheckoutId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [failedLogins, setFailedLogins] = useState(0);
  const [lockUntil, setLockUntil] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedUsers = readJson<User[] | null>("users", null);
    const nextUsers = savedUsers && savedUsers.length ? savedUsers : seedUsers;
    setUsers(nextUsers);
    setUser(loadSessionUser(nextUsers));
    setOnboarded(readStorage("onboarded") === "1");
    setThemeState(readStorage("theme") === "dark" ? "dark" : "light");
    const savedListings = readJson<Listing[] | null>("listings-v2", null);
    if (savedListings && savedListings.length) {
      setListings(savedListings.map((l) => ({ ...emptyDraft(), ...l })));
    }
    setPendingCheckoutId(readStorage("checkout"));
    setFavoriteIds(readJson<string[]>("favorites", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.style.colorScheme = theme;
    if (hydrated) writeStorage("theme", theme);
  }, [theme, hydrated]);

  const value = useMemo<Store>(() => {
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, title, body }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
    };

    const persistUsers = (next: User[]) => {
      setUsers(next);
      writeJson("users", next);
    };

    return {
      hydrated,
      users,
      user,
      onboarded,
      markOnboarded: () => {
        setOnboarded(true);
        writeStorage("onboarded", "1");
      },
      theme,
      setTheme: (mode) => setThemeState(mode),
      login: (identifier) => {
        const id = identifier.trim().toLowerCase();
        const digits = identifier.replace(/\D/g, "");
        const matched = users.find(
          (u) =>
            (id && u.email.toLowerCase() === id) ||
            (digits.length >= 7 && u.phone.replace(/\D/g, "") === digits),
        );
        const found = matched ?? users.find((u) => u.role === "user") ?? users[0];
        setFailedLogins(0);
        setUser(found);
        writeStorage("session", found.id);
        writeStorage("onboarded", "1");
        setOnboarded(true);
        return { ok: true };
      },
      socialLogin: (provider) => {
        const found = users.find((u) => u.role === "user") ?? users[0];
        setUser(found);
        writeStorage("session", found.id);
        writeStorage("onboarded", "1");
        setOnboarded(true);
        pushToast(`Signed in with ${provider === "google" ? "Google" : "Apple"}`);
        return { ok: true };
      },
      register: (input) => {
        const email = input.email.trim().toLowerCase() || `guest${Date.now()}@sellmyauto.com`;
        const existing = users.find((u) => u.email.toLowerCase() === email);
        if (existing) {
          writeStorage("onboarded", "1");
          setOnboarded(true);
          writeStorage("pendingVerify", existing.email);
          return { ok: true, email: existing.email };
        }
        const created: User = {
          id: `u${Date.now()}`,
          fullName: input.fullName.trim() || "Guest Seller",
          email,
          phone: input.phone.trim(),
          password: input.password,
          role: "user",
          verified: false,
          addonIds: [],
        };
        persistUsers([...users, created]);
        writeStorage("onboarded", "1");
        setOnboarded(true);
        writeStorage("pendingVerify", created.email);
        return { ok: true, email: created.email };
      },
      completeVerification: (email) => {
        const found =
          users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ??
          users.find((u) => u.role === "user") ??
          users[0];
        if (!found) return;
        const next = { ...found, verified: true };
        persistUsers(users.map((u) => (u.id === next.id ? next : u)));
        setUser(next);
        writeStorage("session", next.id);
        clearStorage("pendingVerify");
      },
      logout: () => {
        setUser(null);
        clearStorage("session");
      },
      updateUser: (patch) => {
        if (!user) return;
        const next = { ...user, ...patch };
        setUser(next);
        persistUsers(users.map((u) => (u.id === next.id ? next : u)));
      },
      listings,
      myListings: listings.filter((l) => l.ownerId === user?.id),
      marketplace: listings.filter((l) => l.status === "paid"),
      draft,
      setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
      resetDraft: (plan) => setDraftState(usaSampleDraft(plan)),
      loadDraftFromListing: (listing) => {
        const { id: _id, ownerId: _o, status: _s, featured: _f, createdAt: _c, updatedAt: _u, views: _v, favorites: _fav, chats: _ch, ...rest } = listing;
        setDraftState(rest);
      },
      createListing: (status = "unpaid") => {
        if (!user) throw new Error("Not signed in");
        const plan = seedPlans.find((p) => p.id === draft.subscriptionId || p.id === selectedPlanId);
        const created: Listing = {
          ...draft,
          id: `l${Date.now()}`,
          ownerId: user.id,
          status,
          featured: Boolean(plan?.featured || selectedAddonId === "addon-boost"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          favorites: 0,
          chats: 0,
          subscriptionId: draft.subscriptionId || selectedPlanId,
          addonId: draft.addonId || selectedAddonId,
        };
        const next = [created, ...listings];
        setListings(next);
        persistListings(next);
        return created;
      },
      updateListing: (id, patch) => {
        const next = listings.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l));
        setListings(next);
        persistListings(next);
      },
      deleteListing: (id) => {
        const next = listings.filter((l) => l.id !== id);
        setListings(next);
        persistListings(next);
        pushToast("Listing deleted");
      },
      markSold: (id) => {
        const next = listings.map((l) => (l.id === id ? { ...l, status: "sold" as const, updatedAt: new Date().toISOString() } : l));
        setListings(next);
        persistListings(next);
        pushToast("Marked as sold");
      },
      markPaid: (id) => {
        const next = listings.map((l) => (l.id === id ? { ...l, status: "paid" as const, updatedAt: new Date().toISOString() } : l));
        setListings(next);
        persistListings(next);
        clearStorage("checkout");
        setPendingCheckoutId(null);
      },
      pendingCheckoutId,
      setPendingCheckoutId: (id) => {
        setPendingCheckoutId(id);
        if (id) writeStorage("checkout", id);
        else clearStorage("checkout");
      },
      selectedPlanId,
      selectedAddonId,
      setSelectedPlanId,
      setSelectedAddonId,
      plans: seedPlans,
      addons: seedAddons,
      conversations: seedConversations,
      notifications,
      markAllRead: () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
      favoriteIds,
      toggleFavorite: (id) => {
        setFavoriteIds((list) => {
          const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
          writeJson("favorites", next);
          return next;
        });
      },
      toasts,
      pushToast,
      dismissToast: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
      failedLogins,
    };
  }, [
    hydrated,
    users,
    user,
    onboarded,
    theme,
    listings,
    draft,
    selectedPlanId,
    selectedAddonId,
    pendingCheckoutId,
    notifications,
    favoriteIds,
    toasts,
    failedLogins,
    lockUntil,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
