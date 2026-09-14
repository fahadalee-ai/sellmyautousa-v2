import { useNavigate } from "@tanstack/react-router";
import { Check, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { QualityMeter, RelevanceScore } from "@/components/RelevanceScore";
import { AmberBanner, Button, Chip, Field, Input, ScrollTabs, Select, WarningBanner } from "@/components/kit";
import { listingTitle, money } from "@/components/ListingCard";
import {
  BODY_TYPES,
  COLORS,
  DRIVETRAINS,
  FEATURES,
  FUEL_TYPES,
  MAKES,
  makeForModel,
  modelsFor,
  STATES,
  TRANSMISSIONS,
  YEARS,
  citiesFor,
  decodeVin,
} from "@/lib/catalog";
import { IMAGES } from "@/lib/images";
import { computeScore, qualityHint } from "@/lib/score";
import { useApp } from "@/lib/store";
import type { CommMode, Listing, PriceStance } from "@/lib/types";
import { cn } from "@/lib/utils";

export const ADD_STEPS = [
  "Basics",
  "VIN",
  "Specs",
  "Location",
  "Features",
  "Pricing",
  "Media",
  "History",
  "Contact",
  "Review",
] as const;

type Props = {
  step: number;
  mode: "create" | "edit";
  listingId?: string;
  onStep: (next: number) => void;
};

export function AddCarWizard({ step, mode, listingId, onStep }: Props) {
  const {
    draft,
    setDraft,
    createListing,
    updateListing,
    listings,
    setPendingCheckoutId,
    pushToast,
    selectedPlanId,
    selectedAddonId,
  } = useApp();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [vinState, setVinState] = useState<"idle" | "fail" | "ok">(draft.vinDecoded ? "ok" : "idle");
  const [uploadError, setUploadError] = useState("");

  const existing = listings.find((l) => l.id === listingId);
  const score = useMemo(
    () => computeScore(draft, mode === "edit" ? existing : undefined),
    [draft, existing, mode],
  );
  const photoCount = draft.gallery.length + (draft.thumbnail ? 1 : 0);

  function validate(current: number): boolean {
    const next: Record<string, string> = {};
    if (current === 1) {
      if (!draft.make) next.make = "Select a make";
      if (!draft.model) next.model = "Select a model";
      if (!draft.year) next.year = "Select a year";
      if (!draft.bodyType) next.bodyType = "Select a body type";
    }
    if (current === 2 && draft.vin.trim()) {
      const vin = draft.vin.trim().toUpperCase();
      if (vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        next.vin = "Enter a valid 17-character VIN";
      }
    }
    if (current === 3) {
      if (!draft.mileage) next.mileage = "Mileage is required";
      if (!draft.transmission) next.transmission = "Select a transmission";
      if (!draft.fuelType) next.fuelType = "Select a fuel type";
      if (!draft.drivetrain) next.drivetrain = "Select a drivetrain";
      if (!draft.exteriorColor) next.exteriorColor = "Select an exterior color";
    }
    if (current === 4) {
      if (!draft.state) next.state = "Select a state";
      if (!draft.city) next.city = "Select a city";
      if (!/^\d{5}$/.test(draft.zip.trim())) next.zip = "Enter a 5-digit ZIP code";
    }
    if (current === 5 && draft.features.length === 0) {
      next.features = "Select at least one feature";
    }
    if (current === 6) {
      if (!draft.price || Number(draft.price) <= 0) next.price = "Enter a valid asking price";
    }
    if (current === 7) {
      if (!draft.thumbnail) next.thumbnail = "A cover photo is required";
    }
    if (current === 9 && !draft.commMode) {
      next.commMode = "Choose how buyers can reach you";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    onStep(Math.min(10, step + 1));
  }

  function submit() {
    const required = [1, 3, 4, 5, 6, 7, 9] as const;
    for (const s of required) {
      if (!validate(s)) {
        onStep(s);
        return;
      }
    }
    if (mode === "edit" && listingId) {
      updateListing(listingId, {
        ...draft,
        status: "unpaid",
      });
      setPendingCheckoutId(listingId);
      pushToast("Listing saved", "Status set to Unpaid until you republish.");
      navigate({ to: "/checkout" });
      return;
    }
    const created = createListing("unpaid");
    setPendingCheckoutId(created.id);
    navigate({ to: "/checkout" });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-28">
      <div className="sticky top-0 z-20 bg-background px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between pb-2">
          <p className="text-[15px] font-medium text-muted-foreground">
            Step {step} of 10 · {ADD_STEPS[step - 1]}
          </p>
          <p className="text-[15px] font-medium text-trust">{mode === "edit" ? "Edit listing" : "New listing"}</p>
        </div>
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary" style={{ width: `${(step / 10) * 100}%` }} />
        </div>
        <ScrollTabs
          className="mt-3 pb-3"
          items={ADD_STEPS.map((label, i) => ({ id: String(i + 1), label }))}
          value={String(step)}
          onChange={(id) => onStep(Number(id))}
        />
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        {mode === "edit" && (
          <div className="mb-4">
            <WarningBanner>
              Saving changes will set this listing to Unpaid until republished.
            </WarningBanner>
          </div>
        )}

        {step === 1 && <BasicsStep errors={errors} />}
        {step === 2 && (
          <VinStep
            errors={errors}
            vinState={vinState}
            setVinState={setVinState}
          />
        )}
        {step === 3 && <SpecsStep errors={errors} />}
        {step === 4 && <LocationStep errors={errors} />}
        {step === 5 && <FeaturesStep errors={errors} />}
        {step === 6 && <PricingStep errors={errors} />}
        {step === 7 && (
          <MediaStep
            errors={errors}
            uploadError={uploadError}
            setUploadError={setUploadError}
            photoCount={photoCount}
          />
        )}
        {step === 8 && <HistoryStep />}
        {step === 9 && <CommStep />}
        {step === 10 && (
          <ReviewStep
            score={score}
            listing={existing}
            planId={draft.subscriptionId || selectedPlanId}
            addonId={draft.addonId || selectedAddonId}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onStep(Math.max(1, step - 1))} disabled={step === 1}>
            Back
          </Button>
          {step < 10 ? (
            <Button className="flex-1" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button className="flex-1" onClick={submit}>
              Submit & Pay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function BasicsStep({ errors }: { errors: Record<string, string> }) {
  const { draft, setDraft } = useApp();
  const models = modelsFor(draft.make);
  return (
    <>
      <h2 className="mb-4 text-[17px] font-semibold">Vehicle Basics</h2>
      <Field label="Year" error={errors.year}>
        <Select
          value={draft.year}
          onChange={(e) => setDraft({ year: e.target.value })}
          options={[{ value: "", label: "Select year" }, ...YEARS.map((y) => ({ value: y, label: y }))]}
        />
      </Field>
      <Field label="Make" error={errors.make}>
        <Select
          value={draft.make}
          onChange={(e) => setDraft({ make: e.target.value, model: "" })}
          options={[{ value: "", label: "Select make" }, ...MAKES.map((m) => ({ value: m, label: m }))]}
        />
      </Field>
      <Field label="Model" error={errors.model} hint={draft.make ? undefined : "All USA models — pick a make to filter"}>
        <Select
          value={draft.model}
          onChange={(e) => {
            const model = e.target.value;
            const inferred = makeForModel(model);
            setDraft({ model, make: draft.make || inferred || "" });
          }}
          options={[{ value: "", label: "Select model" }, ...models.map((m) => ({ value: m, label: m }))]}
        />
      </Field>
      <Field label="Trim">
        <Input value={draft.trim} placeholder="e.g. SS, XLE, Limited" onChange={(e) => setDraft({ trim: e.target.value })} />
      </Field>
      <Field label="Body Type" error={errors.bodyType}>
        <Select
          value={draft.bodyType}
          onChange={(e) => setDraft({ bodyType: e.target.value })}
          options={[{ value: "", label: "Select body type" }, ...BODY_TYPES.map((b) => ({ value: b, label: b }))]}
        />
      </Field>
    </>
  );
}

function VinStep({
  errors,
  vinState,
  setVinState,
}: {
  errors: Record<string, string>;
  vinState: "idle" | "fail" | "ok";
  setVinState: (s: "idle" | "fail" | "ok") => void;
}) {
  const { draft, setDraft } = useApp();
  function decode() {
    const result = decodeVin(draft.vin);
    if (!result) {
      setVinState("fail");
      setDraft({ vinDecoded: false });
      return;
    }
    setDraft({
      ...result,
      vinDecoded: true,
    });
    setVinState("ok");
  }
  return (
    <>
      <h2 className="mb-1 text-[17px] font-semibold">VIN Decode</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Listings with a decoded VIN earn full Completeness points.
      </p>
      <Field label="VIN" error={errors.vin} hint="Optional. 17 characters, no I, O, or Q.">
        <Input
          value={draft.vin}
          maxLength={17}
          placeholder="1G1FH1R79J0147852"
          onChange={(e) => {
            setDraft({ vin: e.target.value.toUpperCase(), vinDecoded: false });
            setVinState("idle");
          }}
        />
      </Field>
      <Button variant="outline" full onClick={decode}>
        Decode
      </Button>
      {vinState === "ok" && (
        <div className="mt-4 flex items-center gap-2">
          <Chip tone="success">Verified</Chip>
          <span className="text-sm text-foreground">
            {draft.year} {draft.make} {draft.model} {draft.trim}
          </span>
        </div>
      )}
      {vinState === "fail" && (
        <p className="mt-3 text-sm text-primary">
          Couldn’t decode that VIN. Enter specs manually on the next step — skip is available.
        </p>
      )}
      <button
        type="button"
        className="mt-6 text-sm font-semibold text-trust"
        onClick={() => {
          setDraft({ vinDecoded: false });
          setVinState("idle");
        }}
      >
        Skip VIN decode
      </button>
    </>
  );
}

function SpecsStep({ errors }: { errors: Record<string, string> }) {
  const { draft, setDraft } = useApp();
  return (
    <>
      <h2 className="mb-4 text-[17px] font-semibold">Specs</h2>
      <Field label="Mileage" error={errors.mileage}>
        <Input
          inputMode="numeric"
          value={draft.mileage}
          placeholder="e.g. 42000"
          onChange={(e) => setDraft({ mileage: e.target.value.replace(/\D/g, "") })}
        />
      </Field>
      <Field label="Transmission" error={errors.transmission}>
        <Select value={draft.transmission} onChange={(e) => setDraft({ transmission: e.target.value })}>
          <option value="">Select</option>
          {TRANSMISSIONS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Field label="Fuel Type" error={errors.fuelType}>
        <Select value={draft.fuelType} onChange={(e) => setDraft({ fuelType: e.target.value })}>
          <option value="">Select</option>
          {FUEL_TYPES.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Field label="Drivetrain" error={errors.drivetrain}>
        <Select value={draft.drivetrain} onChange={(e) => setDraft({ drivetrain: e.target.value })}>
          <option value="">Select</option>
          {DRIVETRAINS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Field label="Engine Size">
        <Input value={draft.engineSize} placeholder="e.g. 2.0L" onChange={(e) => setDraft({ engineSize: e.target.value })} />
      </Field>
      <Field label="Exterior Color" error={errors.exteriorColor}>
        <Select value={draft.exteriorColor} onChange={(e) => setDraft({ exteriorColor: e.target.value })}>
          <option value="">Select</option>
          {COLORS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <Field label="Interior Color">
        <Select value={draft.interiorColor} onChange={(e) => setDraft({ interiorColor: e.target.value })}>
          <option value="">Select</option>
          {COLORS.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Seats">
          <Input
            inputMode="numeric"
            value={draft.seats}
            onChange={(e) => setDraft({ seats: e.target.value.replace(/\D/g, "") })}
          />
        </Field>
        <Field label="Doors">
          <Input
            inputMode="numeric"
            value={draft.doors}
            onChange={(e) => setDraft({ doors: e.target.value.replace(/\D/g, "") })}
          />
        </Field>
      </div>
    </>
  );
}

function LocationStep({ errors }: { errors: Record<string, string> }) {
  const { draft, setDraft } = useApp();
  const cities = citiesFor(draft.state);
  return (
    <>
      <h2 className="mb-4 text-[17px] font-semibold">Location</h2>
      <Field label="State" error={errors.state}>
        <Select value={draft.state} onChange={(e) => setDraft({ state: e.target.value, city: "" })}>
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </Field>
      <Field label="City" error={errors.city}>
        <Select
          value={draft.city}
          onChange={(e) => setDraft({ city: e.target.value })}
          options={[{ value: "", label: "Select city" }, ...cities.map((c) => ({ value: c, label: c }))]}
        />
      </Field>
      <Field label="ZIP code" error={errors.zip}>
        <Input
          inputMode="numeric"
          maxLength={5}
          value={draft.zip}
          placeholder="75201"
          onChange={(e) => setDraft({ zip: e.target.value.replace(/\D/g, "").slice(0, 5) })}
        />
      </Field>
    </>
  );
}

function FeaturesStep({ errors }: { errors: Record<string, string> }) {
  const { draft, setDraft } = useApp();
  function toggle(f: string) {
    const has = draft.features.includes(f);
    setDraft({ features: has ? draft.features.filter((x) => x !== f) : [...draft.features, f] });
  }
  return (
    <>
      <h2 className="mb-4 text-[17px] font-semibold">Features</h2>
      {errors.features && <p className="mb-3 text-sm font-medium text-primary">{errors.features}</p>}
      <div className="flex flex-wrap gap-2">
        {FEATURES.map((f) => {
          const on = draft.features.includes(f);
          return (
            <button
              key={f}
              type="button"
              onClick={() => toggle(f)}
              className={cn(
                "inline-flex h-11 min-h-11 items-center border px-3.5 text-[15px] font-medium",
                on ? "border-primary bg-primary text-white" : "border-border bg-card text-foreground",
              )}
            >
              {f}
            </button>
          );
        })}
      </div>
    </>
  );
}

function PricingStep({ errors }: { errors: Record<string, string> }) {
  const { draft, setDraft } = useApp();
  function stance(next: PriceStance) {
    setDraft({ priceStance: draft.priceStance === next ? null : next });
  }
  return (
    <>
      <h2 className="mb-4 text-[17px] font-semibold">Pricing</h2>
      <Field label="Asking Price" error={errors.price}>
        <Input
          inputMode="numeric"
          value={draft.price}
          placeholder="25000"
          onChange={(e) => setDraft({ price: e.target.value.replace(/\D/g, "") })}
        />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => stance("negotiable")}
          className={cn(
            "border px-3 py-3 text-sm font-semibold",
            draft.priceStance === "negotiable" ? "border-primary text-primary" : "border-border",
          )}
        >
          Negotiable
        </button>
        <button
          type="button"
          onClick={() => stance("firm")}
          className={cn(
            "border px-3 py-3 text-sm font-semibold",
            draft.priceStance === "firm" ? "border-primary text-primary" : "border-border",
          )}
        >
          Price Firm
        </button>
      </div>
    </>
  );
}

function MediaStep({
  errors,
  uploadError,
  setUploadError,
  photoCount,
}: {
  errors: Record<string, string>;
  uploadError: string;
  setUploadError: (s: string) => void;
  photoCount: number;
}) {
  const { draft, setDraft } = useApp();

  function addSample() {
    const unused = IMAGES.sampleGallery.find((src) => src !== draft.thumbnail && !draft.gallery.includes(src));
    if (!unused) return;
    if (!draft.thumbnail) setDraft({ thumbnail: unused });
    else setDraft({ gallery: [...draft.gallery, unused] });
  }

  function onFile(kind: "thumb" | "gallery" | "video", file?: File) {
    if (!file) return;
    if (kind === "video") {
      setDraft({ video: URL.createObjectURL(file) });
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (img.width < 1280 || img.height < 720) {
        setUploadError("Thumbnail must be at least 1280×720.");
        return;
      }
      setUploadError("");
      if (kind === "thumb") setDraft({ thumbnail: url });
      else setDraft({ gallery: [...draft.gallery, url] });
    };
    img.src = url;
  }

  return (
    <>
      <h2 className="mb-1 text-[17px] font-semibold">Media</h2>
      <p className="mb-4 text-sm text-muted-foreground">{qualityHint(photoCount)}</p>
      <QualityMeter photos={photoCount} hasVideo={Boolean(draft.video)} />

      <Field label="Thumbnail (required)" error={errors.thumbnail}>
        {draft.thumbnail ? (
          <img src={draft.thumbnail} alt="" className="mb-2 h-36 w-full object-cover" />
        ) : (
          <div className="mb-2 flex h-36 items-center justify-center border border-dashed border-border text-xs text-muted-foreground">
            Hi-res cover photo
          </div>
        )}
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-trust px-3 text-sm font-semibold text-trust">
          <Upload size={16} /> Upload thumbnail
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile("thumb", e.target.files?.[0])}
          />
        </label>
      </Field>
      {uploadError && <p className="mb-3 text-xs text-primary">{uploadError}</p>}

      <Field label={`Gallery · ${draft.gallery.length} photos`} hint="10+ / 30+ / 50+ photos raise Listing Quality.">
        <div className="mb-2 grid grid-cols-3 gap-2">
          {draft.gallery.map((src) => (
            <img key={src} src={src} alt="" className="h-20 w-full object-cover" />
          ))}
        </div>
        <div className="flex gap-2">
          <label className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 border border-trust px-3 text-sm font-semibold text-trust">
            <Plus size={16} /> Add photos
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile("gallery", e.target.files?.[0])}
            />
          </label>
          <Button variant="ghost" type="button" onClick={addSample}>
            Use sample
          </Button>
        </div>
      </Field>

      <Field label="Video (optional)" hint="+5 bonus points">
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 border border-trust px-3 text-sm font-semibold text-trust">
          <Upload size={16} /> {draft.video ? "Replace video" : "Upload video"}
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onFile("video", e.target.files?.[0])}
          />
        </label>
        {draft.video && <p className="mt-2 text-xs text-success">Video attached — +5 Quality bonus</p>}
      </Field>
    </>
  );
}

function HistoryStep() {
  const { draft, setDraft } = useApp();
  return (
    <>
      <h2 className="mb-1 text-[17px] font-semibold">History Report</h2>
      <p className="mb-4 text-sm text-muted-foreground">Optional. Link or note a vehicle history report.</p>
      <Field label="Report URL or reference">
        <Input
          value={draft.historyReport}
          placeholder="https://… or report ID"
          onChange={(e) => setDraft({ historyReport: e.target.value })}
        />
      </Field>
    </>
  );
}

function CommStep() {
  const { draft, setDraft } = useApp();
  const options: { id: CommMode; label: string; body: string }[] = [
    { id: "chat", label: "In-app Chat only", body: "Buyers reach you in Inbox." },
    { id: "chat_phone", label: "Chat + Phone", body: "Share your number after first message." },
    { id: "phone", label: "Phone only", body: "Show your phone on the listing." },
  ];
  return (
    <>
      <h2 className="mb-4 text-[17px] font-semibold">Mode of Communication</h2>
      <div className="space-y-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setDraft({ commMode: o.id })}
            className={cn(
              "w-full border px-3 py-3 text-left",
              draft.commMode === o.id ? "border-2 border-primary" : "border-border",
            )}
          >
            <p className="text-sm font-semibold">{o.label}</p>
            <p className="text-xs text-muted-foreground">{o.body}</p>
          </button>
        ))}
      </div>
    </>
  );
}

function ReviewStep({
  score,
  listing,
  planId,
  addonId,
}: {
  score: ReturnType<typeof computeScore>;
  listing?: Listing;
  planId: string;
  addonId: string;
}) {
  const { draft, plans, addons } = useApp();
  const plan = plans.find((p) => p.id === planId);
  const addon = addons.find((a) => a.id === addonId);
  return (
    <>
      <h2 className="mb-3 text-[17px] font-semibold">Review & Submit</h2>
      <AmberBanner>
        Editing this listing after publishing will set it back to Unpaid until you republish.
      </AmberBanner>
      <article className="mt-4 border border-border bg-card">
        {draft.thumbnail && <img src={draft.thumbnail} alt="" className="h-44 w-full object-cover" />}
        <div className="p-3">
          <div className="flex items-center gap-2">
            {draft.vinDecoded && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-success">
                <Check size={12} /> VIN verified
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold">{listingTitle(draft)}</h3>
          <p className="text-sm font-semibold text-trust">{money(draft.price)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {draft.city}, {draft.state} · {draft.mileage ? `${Number(draft.mileage).toLocaleString()} mi` : "—"}
          </p>
          {draft.features.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">{draft.features.join(" · ")}</p>
          )}
        </div>
      </article>
      <div className="mt-3">
        <RelevanceScore score={score} expanded showHelp />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Plan: {plan?.name ?? "—"}
        {addon ? ` + ${addon.name}` : ""}
        {listing ? ` · current status ${listing.status}` : ""}
      </p>
    </>
  );
}
