import type { ReactNode } from "react";
import { SafeImg } from "@/components/SafeImg";
import { cn } from "@/lib/utils";

export function IntroFrame({
  title,
  subtitle,
  image,
  imageFocus = "object-center",
  onSkip,
  cta,
  onCta,
  footer,
  showSkip = true,
}: {
  title: string;
  subtitle: string;
  image: string;
  imageFocus?: string;
  onSkip?: () => void;
  cta: string;
  onCta: () => void;
  footer?: ReactNode;
  showSkip?: boolean;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-black text-white">
      <SafeImg
        src={image}
        alt=""
        className={cn("absolute inset-0 h-full w-full object-cover", imageFocus)}
      />

      <div className="relative z-10 flex min-h-dvh flex-col px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <header className="flex h-11 items-center justify-end">
          {showSkip && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="inline-flex h-11 items-center text-[17px] font-medium text-white/70"
            >
              Skip
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1" />

        <section className="pb-5 text-center">
          <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-white">{title}</h1>
          <p className="mx-auto mt-2 max-w-[20rem] text-[15px] leading-snug text-white/60">{subtitle}</p>
        </section>

        <button
          type="button"
          onClick={onCta}
          className="inline-flex h-11 w-full items-center justify-center bg-primary text-[17px] font-semibold text-white"
        >
          {cta}
        </button>
        {footer}
      </div>
    </div>
  );
}
