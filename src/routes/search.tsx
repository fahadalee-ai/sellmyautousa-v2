import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BrowseCard } from "@/components/ListingCard";
import { RequireAuth } from "@/components/RequireAuth";
import { Header, Input, ScrollTabs, Select } from "@/components/kit";
import { BODY_TYPES, MAKES } from "@/lib/catalog";
import { useApp } from "@/lib/store";

type Search = { body?: string; q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    body: typeof s.body === "string" ? s.body : "",
    q: typeof s.q === "string" ? s.q : "",
  }),
  head: () => ({ meta: [{ title: "Search · SellMyAuto" }] }),
  component: () => (
    <RequireAuth>
      <SearchScreen />
    </RequireAuth>
  ),
});

function SearchScreen() {
  const { body = "", q = "" } = Route.useSearch();
  const { marketplace } = useApp();
  const [query, setQuery] = useState(q);
  const [make, setMake] = useState("");
  const [bodyType, setBodyType] = useState(body);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return marketplace.filter((l) => {
      const hay = `${l.year} ${l.make} ${l.model} ${l.city}`.toLowerCase();
      if (needle && !hay.includes(needle)) return false;
      if (make && l.make !== make) return false;
      if (bodyType && l.bodyType !== bodyType) return false;
      return true;
    });
  }, [marketplace, query, make, bodyType]);

  return (
    <div className="min-h-dvh bg-white pb-8">
      <Header title="Search" back={false} />
      <div className="space-y-3 px-4">
        <Input
          placeholder="Make, model, city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select value={make} onChange={(e) => setMake(e.target.value)}>
          <option value="">All makes</option>
          {MAKES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </Select>
        <ScrollTabs
          items={[{ id: "", label: "All" }, ...BODY_TYPES.map((b) => ({ id: b, label: b }))]}
          value={bodyType}
          onChange={setBodyType}
        />
      </div>
      <div className="no-scrollbar mt-4 space-y-3 overflow-y-auto px-4 pb-6">
        <p className="text-xs text-muted-foreground">{results.length} listings</p>
        {results.map((l) => (
          <BrowseCard key={l.id} listing={l} />
        ))}
        {results.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No listings match those filters.</p>
        )}
      </div>
    </div>
  );
}
