import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: { value: number; positive: boolean };
  color?: string;
}

const StatCard = ({ icon: Icon, label, value, subValue, trend, color = "bordeaux" }: StatCardProps) => {
  const colorClasses: Record<string, string> = {
    bordeaux: "bg-bordeaux/10 text-bordeaux",
    gold: "bg-gold/15 text-gold-dark",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-ivory border border-border p-6 hover:border-gold/50 transition-smooth">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50 mb-1">{label}</p>
          <p className="font-serif text-2xl text-bordeaux truncate">{value}</p>
          {subValue && <p className="text-xs text-bordeaux/60 mt-1">{subValue}</p>}
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? "text-green-600" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% vs mois dernier
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.bordeaux}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
