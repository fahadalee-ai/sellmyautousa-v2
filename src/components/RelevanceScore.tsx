import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SCORE_CAPS, type computeScore } from "@/lib/score";
import { cn } from "@/lib/utils";

type Score = ReturnType<typeof computeScore>;

const ROWS: { key: keyof Omit<Score, "total">; label: string; cap: number }[] = [
  { key: "recency", label: "Recency", cap: SCORE_CAPS.recency },
  { key: "quality", label: "Listing Quality", cap: SCORE_CAPS.quality },
  { key: "engagement", label: "Engagement", cap: SCORE_CAPS.engagement },
  { key: "completeness", label: "Completeness & Accuracy", cap: SCORE_CAPS.completeness },
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
  const [open, setOpen] = useState(Boolean(expanded));

  return (
    <div className="border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Listing Relevance Score
          </p>
          <p className={cn("font-semibold tabular-nums text-foreground", compact ? "text-[17px]" : "text-[22px]")}>
            {score.total}
            <span className="text-sm font-medium text-muted-foreground">/100</span>
          </p>
        </div>
        <ChevronDown
          size={18}
          className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-border px-3 py-3">
          {ROWS.map((row) => (
            <ScoreBar key={row.key} label={row.label} value={score[row.key]} cap={row.cap} />
          ))}
          {showHelp && (
            <Link to="/point-notes" className="mt-1 inline-block text-xs font-semibold text-trust">
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
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums text-foreground">
          {value}/{cap}
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function QualityMeter({ photos, hasVideo }: { photos: number; hasVideo: boolean }) {
  const pct = Math.min(100, (photos / 50) * 100);
  return (
    <div className="border border-border bg-card p-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">Listing Quality</span>
        <span className="tabular-nums text-muted-foreground">
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
