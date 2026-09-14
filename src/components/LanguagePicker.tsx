import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const LANGS = [
  { id: "en", label: "English", note: "Continue in English" },
  { id: "es", label: "Español", note: "Continuar en español" },
] as const;

export type LanguageId = (typeof LANGS)[number]["id"];

export function LanguagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: LanguageId) => void;
}) {
  return (
    <div className="space-y-2">
      {LANGS.map((l) => {
        const selected = value === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => onChange(l.id)}
            className={cn(
              "flex h-11 min-h-11 w-full items-center justify-between border px-3.5 text-left",
              selected ? "border-primary bg-primary/5" : "border-border bg-card",
            )}
          >
            <span>
              <span className="block text-base font-semibold leading-none text-foreground">{l.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{l.note}</span>
            </span>
            {selected && <Check size={20} className="shrink-0 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
