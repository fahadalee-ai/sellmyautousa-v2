import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { IntroFrame } from "@/components/IntroFrame";
import { IMAGES } from "@/lib/images";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Get started · Sell My Auto USA" }] }),
  component: OnboardingScreen,
});

const SLIDES = [
  {
    image: IMAGES.onboard1,
    focus: "object-[center_42%]",
    title: "Sell direct.",
    accent: "No dealer.",
    subtitle: "Meet real buyers nearby. Keep the money that used to go to a dealership.",
  },
  {
    image: IMAGES.onboard2,
    focus: "object-[center_45%]",
    title: "A listing",
    accent: "buyers tap.",
    subtitle: "VIN, photos, video, and specs — built into a listing that looks ready to buy.",
  },
  {
    image: IMAGES.onboard3,
    focus: "object-[center_40%]",
    title: "Get ranked.",
    accent: "Get offers.",
    subtitle: "Quality listings earn a Relevance Score and rise to the top of search.",
  },
] as const;

function OnboardingScreen() {
  const [i, setI] = useState(0);
  const startX = useRef(0);
  const { markOnboarded, user } = useApp();
  const navigate = useNavigate();
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  function finish(to: "/login" | "/register" | "/home") {
    markOnboarded();
    navigate({ to, replace: true });
  }

  function next() {
    if (last) {
      finish(user ? "/home" : "/register");
      return;
    }
    setI((n) => n + 1);
  }

  return (
    <div
      onTouchStart={(e) => {
        startX.current = e.changedTouches[0]?.clientX ?? 0;
      }}
      onTouchEnd={(e) => {
        const dx = (e.changedTouches[0]?.clientX ?? 0) - startX.current;
        if (dx < -48) next();
        if (dx > 48 && i > 0) setI((n) => n - 1);
      }}
    >
      <IntroFrame
        title={slide.title}
        accent={slide.accent}
        subtitle={slide.subtitle}
        image={slide.image}
        imageFocus={slide.focus}
        step={i + 1}
        steps={4}
        onSkip={() => finish(user ? "/home" : "/login")}
        cta={last ? "Create account" : "Continue"}
        onCta={next}
        footer={
          last ? (
            <p className="mt-3 text-center text-[15px] text-white/55">
              Already have an account?{" "}
              <Link
                to="/login"
                onClick={() => markOnboarded()}
                className="font-semibold text-[#7EB6FF]"
              >
                Log in
              </Link>
            </p>
          ) : null
        }
      />
    </div>
  );
}
