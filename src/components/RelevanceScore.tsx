import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SCORE_CAPS, type computeScore } from "@/lib/score";
import { cn } from "@/lib/utils";

type Score = ReturnType<typeof computeScore>;

const ROWS: { key: keyof Omit<Score, "total">; label: string; cap: number }[] = [
  { key: "recency", label: "Recency", cap: SCORE_CAPS.recency },
  { key: "quality", label: "Quality", cap: SCORE_CAPS.quality },
  { key: "engagement", label: "Engage", cap: SCORE_CAPS.engagement },
  { key: "completeness", label: "Complete", cap: SCORE_CAPS.completeness },
];

export function RelevanceScore({
  score,
  expanded,
  compact,
  showHelp,
}: {
  score: Score;
  expanded?: boolean;
  compact?: boolean;
  showHelp?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(expanded) || Boolean(compact));

  return (
    <div className="border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between gap-2 px-3 text-left"
      >
        <p className="min-w-0 truncate text-[13px] font-semibold text-foreground">Relevance Score</p>
        <div className="flex shrink-0 items-baseline gap-1">
          <span className="text-[17px] font-semibold tabular-nums leading-none text-foreground">{score.total}</span>
          <span className="text-[13px] font-medium tabular-nums text-muted-foreground">/100</span>
          <ChevronDown
            size={16}
            className={cn("ml-0.5 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </div>
      </button>
      {open && (
        <div className="space-y-2 border-t border-border px-3 py-2.5">
          {ROWS.map((row) => (
            <ScoreBar key={row.key} label={row.label} value={score[row.key]} cap={row.cap} />
          ))}
          {showHelp && (
            <Link to="/point-notes" className="inline-flex h-8 items-center text-[13px] font-medium text-trust">
              What does this mean?
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function ScoreBar({ label, value, cap }: { label: string; value: number; cap: number }) {
  const pct = cap ? Math.min(100, (value / cap) * 100) : 0;
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="w-[4.25rem] shrink-0 truncate text-[13px] leading-none text-muted-foreground">{label}</span>
      <div className="h-1.5 min-w-0 flex-1 bg-muted">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-[13px] font-semibold tabular-nums leading-none text-foreground">
        {value}/{cap}
      </span>
    </div>
  );
}

export function QualityMeter({ photos, hasVideo }: { photos: number; hasVideo: boolean }) {
  const pct = Math.min(100, (photos / 50) * 100);
  return (
    <div className="border border-border bg-card px-3 py-2.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold text-foreground">Listing Quality</span>
        <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
          {photos} photo{photos === 1 ? "" : "s"}
          {hasVideo ? " · video" : ""}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
