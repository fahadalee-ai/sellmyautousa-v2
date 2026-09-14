import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IntroFrame } from "@/components/IntroFrame";
import { IMAGES } from "@/lib/images";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sell My Auto USA" },
      { name: "description", content: "List it. Price it. Sell it direct." },
    ],
  }),
  component: SplashScreen,
});

function SplashScreen() {
  const { markOnboarded, user } = useApp();
  const navigate = useNavigate();

  return (
    <IntroFrame
      title="Sell My Auto USA"
      subtitle="America's FSBO marketplace. No dealer. No markup."
      image={IMAGES.splash}
      imageFocus="object-center"
      showSkip
      onSkip={() => {
        markOnboarded();
        navigate({ to: user ? "/home" : "/login", replace: true });
      }}
      cta="Get Started"
      onCta={() => navigate({ to: "/onboarding", replace: true })}
    />
  );
}
