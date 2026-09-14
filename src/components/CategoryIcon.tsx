import {
  Car,
  CircleHelp,
  MessageSquare,
  Plus,
  Search,
  Star,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  browse: Search,
  sell: Plus,
  featured: Star,
  inventory: Car,
  offers: MessageSquare,
};

export function CategoryIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = MAP[name] ?? CircleHelp;
  return <Icon size={size} strokeWidth={1.8} />;
}
