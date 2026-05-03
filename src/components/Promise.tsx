import { useAdmin } from "@/context/AdminContext";
import * as Icons from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Truck: Icons.Truck,
  ShieldCheck: Icons.ShieldCheck,
  Percent: Icons.Percent,
  Factory: Icons.Factory,
  TrendingDown: Icons.TrendingDown,
  Clock: Icons.Clock,
  Star: Icons.Star,
  Heart: Icons.Heart,
  Award: Icons.Award,
  Gem: Icons.Gem,
};

const Promise = () => {
  const { promises } = useAdmin();

  if (!promises || promises.length === 0) return null;

  return (
    <section className="border-y border-border">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
        {promises.map((it, i) => {
          const Icon = iconMap[it.icon] || Icons.Gem;
          return (
            <div key={i} className="flex items-center gap-3 text-bordeaux">
              <Icon className="h-6 w-6 text-gold shrink-0" strokeWidth={1.4} />
              <div>
                <div className="font-serif text-sm">{it.title}</div>
                <div className="text-xs text-bordeaux/60">{it.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Promise;
