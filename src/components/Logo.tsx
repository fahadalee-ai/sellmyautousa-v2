import logoColor from "@/img/logo.png";
import logoWhite from "@/img/logo-w.png";
import logoWhiteBlue from "@/img/logo-wb.png";
import iconColor from "@/img/fav-icon_01.png";
import iconWhite from "@/img/fav-icon_02.png";
import { cn } from "@/lib/utils";

const heights = {
  xs: "h-9",
  sm: "h-11",
  md: "h-11",
  lg: "h-16",
  xl: "h-24",
} as const;

const iconSizes = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
} as const;

/** color = light screens, white = dark screens, whiteBlue = dark + brand accent */
export type LogoTone = "color" | "white" | "whiteBlue";

const FULL: Record<LogoTone, string> = {
  color: logoColor,
  white: logoWhite,
  whiteBlue: logoWhiteBlue,
};

const ICON: Record<LogoTone, string> = {
  color: iconColor,
  white: iconWhite,
  whiteBlue: iconColor,
};

export function Logo({
  className,
  tone = "color",
  size = "md",
}: {
  className?: string;
  tone?: LogoTone;
  size?: keyof typeof heights;
  inverted?: boolean;
  plate?: boolean;
}) {
  return (
    <img
      src={FULL[tone]}
      alt="Sell My Auto USA — America's For Sale By Owner Online Automotive Marketplace"
      className={cn(heights[size], "w-auto max-w-full object-contain object-left", className)}
    />
  );
}

export function BrandIcon({
  className,
  tone = "color",
  size = "md",
}: {
  className?: string;
  tone?: LogoTone;
  size?: keyof typeof iconSizes;
}) {
  return (
    <img
      src={ICON[tone]}
      alt=""
      className={cn(iconSizes[size], "object-contain", className)}
    />
  );
}

export function Mark({ size = "md", inverted }: { inverted?: boolean; size?: keyof typeof iconSizes }) {
  return <BrandIcon size={size} tone={inverted ? "white" : "color"} />;
}

export function Wordmark({ className, inverted }: { className?: string; inverted?: boolean }) {
  return <Logo size="sm" tone={inverted ? "white" : "color"} className={className} />;
}
