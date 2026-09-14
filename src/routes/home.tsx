import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Handshake, ShieldCheck, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CategoryIcon } from "@/components/CategoryIcon";
import { FeaturedTile } from "@/components/ListingCard";
import { RequireAuth } from "@/components/RequireAuth";
import { SafeImg } from "@/components/SafeImg";
import { IMAGES } from "@/lib/images";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Home · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <HomeScreen />
    </RequireAuth>
  ),
});

const CATEGORIES = [
  { id: "browse", label: "Browse", to: "/search" as const },
  { id: "sell", label: "Sell car", to: "/plans" as const },
  { id: "featured", label: "Featured", to: "/search" as const },
  { id: "inventory", label: "My cars", to: "/inventory" as const },
  { id: "offers", label: "Offers", to: "/inbox" as const },
];

const TRUST = [
  { icon: ShieldCheck, label: "No dealer fees" },
  { icon: BadgeCheck, label: "VIN verified" },
  { icon: Sparkles, label: "Relevance Score" },
  { icon: Handshake, label: "Sell direct" },
];

function HomeScreen() {
  const { marketplace, user } = useApp();
  const featured = marketplace.filter((l) => l.featured).slice(0, 4);
  const tiles = featured.length ? featured : marketplace.slice(0, 4);
  const rest = marketplace.filter((l) => !tiles.some((t) => t.id === l.id)).slice(0, 6);
  const firstName = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div className="min-h-dvh bg-white pb-10">
      <section className="relative min-h-[22.5rem] overflow-hidden bg-[#0B0B0F]">
        <SafeImg
          src={IMAGES.homeHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-[#0B0B0F]/55" />
        <AppHeader variant="overlay" />
        <div className="relative flex min-h-[22.5rem] flex-col justify-end px-5 pb-7 pt-24">
          <p className="text-[13px] font-medium text-white/65">Hi, {firstName}</p>
          <h1 className="mt-1 max-w-[17rem] text-[30px] font-semibold leading-[1.08] tracking-tight text-white">
            Sell your car. Keep the profit.
          </h1>
          <Link
            to="/search"
            className="mt-5 inline-flex h-12 w-fit items-center gap-2 bg-primary px-5 text-[15px] font-semibold text-white"
          >
            Explore marketplace
            <ArrowRight size={18} strokeWidth={2.2} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-5 gap-1 px-3 py-5">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={c.to}
            className="flex min-h-16 flex-col items-center justify-center gap-2"
          >
            <span className="flex h-12 w-12 items-center justify-center border border-border text-trust">
              <CategoryIcon name={c.id} size={22} />
            </span>
            <span className="text-center text-[11px] font-medium leading-tight text-foreground">
              {c.label}
            </span>
          </Link>
        ))}
      </section>

      <section className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold tracking-[0.14em] text-foreground">
            FEATURED CARS
          </h2>
          <Link to="/search" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-trust">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {tiles.map((l) => (
            <FeaturedTile key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="relative mx-4 mt-8 overflow-hidden bg-[#0B0B0F]">
        <SafeImg src={IMAGES.showroom} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-[#0B0B0F]/50" />
        <div className="relative px-4 py-6">
          <p className="text-[13px] font-semibold tracking-[0.14em] text-white/70">LIST YOUR CAR</p>
          <h3 className="mt-1 max-w-[16rem] text-[22px] font-semibold leading-snug text-white">
            Get ranked. Get real offers.
          </h3>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-white/70">
            Publish a listing buyers actually tap — VIN, photos, and a Relevance Score.
          </p>
          <Link
            to="/plans"
            className="mt-4 inline-flex min-h-12 items-center gap-2 bg-primary px-5 text-[15px] font-semibold text-white"
          >
            Start listing
            <ArrowRight size={18} strokeWidth={2.2} />
          </Link>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-4 gap-2 px-4">
        {TRUST.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="flex flex-col items-center gap-2 px-1 py-2 text-center">
              <Icon size={20} strokeWidth={1.8} className="text-trust" />
              <p className="text-[11px] font-medium leading-tight text-muted-foreground">{t.label}</p>
            </div>
          );
        })}
      </section>

      {rest.length > 0 && (
        <section className="mt-6 px-4 pb-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold tracking-[0.14em] text-foreground">NEAR YOU</h2>
            <Link to="/search" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-trust">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {rest.map((l) => (
              <FeaturedTile key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
