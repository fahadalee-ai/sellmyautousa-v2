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
    title: "Find Your Dream Car",
    subtitle: "Find the car of your dreams from the world's largest market.",
  },
  {
    image: IMAGES.onboard2,
    title: "View & List Car Features",
    subtitle: "See the specs that matter — then list yours with the same clarity.",
  },
  {
    image: IMAGES.onboard3,
    title: "Sell Your Car",
    subtitle: "Post your ad to interested buyers around the world.",
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
        subtitle={slide.subtitle}
        image={slide.image}
        imageFocus="object-top"
        onSkip={() => finish(user ? "/home" : "/login")}
        cta={last ? "Get Started" : "Next"}
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
