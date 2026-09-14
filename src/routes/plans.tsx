import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleCheck,
  Film,
  ImagePlus,
  PiggyBank,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { Header } from "@/components/kit";
import { useApp } from "@/lib/store";
import { parseAddonIds, type Plan } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans")({
  head: () => ({ meta: [{ title: "Select Package · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <PlansScreen />
    </RequireAuth>
  ),
});

type Tab = "package" | "bundle";

const ADDON_ICONS: Record<string, ReactNode> = {
  "addon-video": <Film size={16} strokeWidth={1.75} />,
  "addon-photos": <ImagePlus size={16} strokeWidth={1.75} />,
  "addon-boost": <Star size={16} strokeWidth={1.75} />,
  "addon-search": <Search size={16} strokeWidth={1.75} />,
};

const INCLUDE_ICONS = [Film, Camera, PiggyBank, CalendarDays];

function PlansScreen() {
  const { plans, addons, selectedPlanId, selectedAddonId, setSelectedPlanId, setSelectedAddonId, resetDraft, updateUser } =
    useApp();
  const navigate = useNavigate();
  const selected = plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  const [tab, setTab] = useState<Tab>(selected?.kind === "bundle" ? "bundle" : "package");
  const [addonIds, setAddonIds] = useState<string[]>(() => parseAddonIds(selectedAddonId));
  const [detailsOpen, setDetailsOpen] = useState(true);

  const visible = useMemo(() => plans.filter((p) => p.kind === tab), [plans, tab]);

  function switchTab(next: Tab) {
    setTab(next);
    setDetailsOpen(true);
    const list = plans.filter((p) => p.kind === next);
    if (!list.some((p) => p.id === selectedPlanId)) {
      setSelectedPlanId(list[0]?.id ?? "");
    }
    if (next === "bundle") {
      setAddonIds([]);
      setSelectedAddonId("");
    }
  }

  function selectPlan(id: string) {
    setSelectedPlanId(id);
    setDetailsOpen(true);
  }

  function toggleAddon(id: string) {
    const next = addonIds.includes(id) ? addonIds.filter((x) => x !== id) : [...addonIds, id];
    setAddonIds(next);
    setSelectedAddonId(next.join(","));
  }

  function continueToAdd() {
    const plan = plans.find((p) => p.id === selectedPlanId);
    const extras = plan?.kind === "bundle" ? [] : addonIds;
    updateUser({
      subscriptionId: selectedPlanId,
      addonIds: extras,
    });
    resetDraft({
      subscriptionId: selectedPlanId,
      addonId: extras.join(","),
      bundleId: plan?.kind === "bundle" ? plan.id : "",
    });
    navigate({ to: "/add-car", search: { step: 1 } });
  }

  const addOnTotal = tab === "package" ? addons.filter((a) => addonIds.includes(a.id)).reduce((sum, a) => sum + a.price, 0) : 0;
  const due = (selected?.price ?? 0) + addOnTotal;

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-24">
      <Header title="Select Package" back fallbackTo="/home" />

      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 bg-muted p-1">
          {(
            [
              ["package", "Packages"],
              ["bundle", "Bundles"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchTab(id)}
              className={cn(
                "inline-flex h-11 items-center justify-center text-[15px] font-semibold",
                tab === id ? "bg-primary text-white" : "bg-transparent text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {visible.map((plan) => {
          const open = plan.id === selectedPlanId;
          return open ? (
            <ExpandedPlan
              key={plan.id}
              plan={plan}
              detailsOpen={detailsOpen}
              onToggleDetails={() => setDetailsOpen((v) => !v)}
              addons={
                tab === "package"
                  ? addons.map((a) => ({
                      ...a,
                      checked: addonIds.includes(a.id),
                      icon: ADDON_ICONS[a.id],
                    }))
                  : undefined
              }
              onToggleAddon={toggleAddon}
            />
          ) : (
            <CollapsedPlan key={plan.id} plan={plan} radio={tab === "bundle"} onSelect={() => selectPlan(plan.id)} />
          );
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 bg-background pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={continueToAdd}
          className="inline-flex h-11 w-full items-center justify-center bg-primary text-[17px] font-semibold text-white"
        >
          Select Plan{due ? ` · $${due}` : ""}
        </button>
      </div>
    </div>
  );
}

function CollapsedPlan({
  plan,
  radio,
  onSelect,
}: {
  plan: Plan;
  radio?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex min-h-14 w-full items-center justify-between gap-3 bg-muted px-4 py-3.5 text-left"
    >
      <span className="text-[17px] font-semibold text-foreground">{plan.shortName}</span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="text-[15px] font-semibold text-primary">
          ${plan.price}/{plan.durationDays} days
        </span>
        {radio && <Circle size={18} strokeWidth={1.75} className="text-muted-foreground" />}
      </span>
    </button>
  );
}

function ExpandedPlan({
  plan,
  detailsOpen,
  onToggleDetails,
  addons,
  onToggleAddon,
}: {
  plan: Plan;
  detailsOpen: boolean;
  onToggleDetails: () => void;
  addons?: { id: string; name: string; price: number; checked: boolean; icon?: ReactNode }[];
  onToggleAddon: (id: string) => void;
}) {
  return (
    <article className="bg-primary px-4 pb-3 pt-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[28px] font-semibold leading-none tracking-tight">
          ${plan.price}
          <span className="ml-1 text-[13px] font-medium text-white/75">/ {plan.durationDays} days</span>
        </p>
        <p className="pt-1 text-[13px] font-medium text-white/80">Duration {plan.durationDays} days</p>
      </div>
      <h2 className="mt-4 text-[22px] font-semibold leading-tight">{plan.name}</h2>
      <p className="mt-1.5 text-[13px] leading-snug text-white/80">{plan.tagline}</p>

      {detailsOpen && addons && (
        <div className="mt-4">
          <p className="mb-2 text-[15px] font-semibold">Add Ons:</p>
          <div className="bg-white px-3 py-1 text-foreground">
            {addons.map((a) => (
              <label key={a.id} className="flex min-h-11 items-center gap-3 border-b border-border last:border-b-0">
                <input
                  type="checkbox"
                  checked={a.checked}
                  onChange={() => onToggleAddon(a.id)}
                  className="h-4 w-4 shrink-0 rounded-none accent-primary"
                />
                <span className="text-muted-foreground">{a.icon}</span>
                <span className="flex-1 text-[15px]">{a.name}</span>
                <span className="text-[15px] font-semibold">${a.price}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {detailsOpen && !addons && (
        <div className="mt-4">
          <p className="mb-2 text-[15px] font-semibold">This plan includes:</p>
          <div className="bg-white px-3 py-2 text-foreground">
            {plan.includes.map((item, i) => {
              const Icon = INCLUDE_ICONS[i] ?? CircleCheck;
              return (
                <div key={item} className="flex min-h-11 items-center gap-3">
                  <Icon size={16} strokeWidth={1.75} className="shrink-0 text-muted-foreground" />
                  <p className="text-[15px] leading-snug">{item}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onToggleDetails}
        className="mx-auto mt-3 flex h-11 items-center gap-1 text-[15px] font-medium text-white/90"
      >
        {detailsOpen ? "Show less" : "Show more"}
        {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </article>
  );
}
