import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SafeImg } from "@/components/SafeImg";
import { cn } from "@/lib/utils";

export function IntroFrame({
  title,
  accent,
  subtitle,
  image,
  imageFocus = "object-center",
  step,
  steps,
  onSkip,
  cta,
  onCta,
  footer,
}: {
  title: string;
  accent?: string;
  subtitle: string;
  image: string;
  imageFocus?: string;
  step?: number;
  steps?: number;
  onSkip?: () => void;
  cta: string;
  onCta: () => void;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-black px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <header className="flex h-11 items-center justify-between">
        <Logo tone="white" size="sm" className="max-w-[9.5rem] object-left" />
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex h-11 items-center text-[17px] font-medium text-white/50"
          >
            Skip
          </button>
        )}
      </header>

      <section className="pt-4">
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-tight text-white">
          {title}
          {accent ? (
            <>
              <br />
              <span className="text-primary">{accent}</span>
            </>
          ) : null}
        </h1>
        <p className="mt-2 max-w-[20rem] text-[15px] leading-snug text-white/50">{subtitle}</p>
      </section>

      <div className="mt-4 min-h-0 flex-1">
        <div className="relative h-full overflow-hidden bg-[#111]">
          <SafeImg
            src={image}
            alt=""
            className={cn("absolute inset-0 h-full w-full object-cover", imageFocus)}
          />
        </div>
      </div>

      {typeof step === "number" && typeof steps === "number" && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {Array.from({ length: steps }, (_, idx) => (
            <span
              key={idx}
              className={cn("h-1.5", idx === step ? "w-4 bg-primary" : "w-1.5 bg-white/20")}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onCta}
        className="inline-flex h-11 w-full items-center justify-center gap-1.5 bg-primary text-[17px] font-semibold text-white"
      >
        {cta}
        <ArrowRight size={16} strokeWidth={2.2} />
      </button>
      {footer}
    </div>
  );
}
