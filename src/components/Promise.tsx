import { Truck, ShieldCheck, Percent, Factory } from "lucide-react";

const items = [
  { icon: Truck, title: "Livraison 48h", text: "Franco dès 300€ HT" },
  { icon: Percent, title: "Tarifs dégressifs", text: "Dès -10% à 500€" },
  { icon: ShieldCheck, title: "Garantie à vie", text: "Sur toutes les pièces" },
  { icon: Factory, title: "Fabrication française", text: "Atelier parisien" },
];

const Promise = () => (
  <section className="border-y border-border">
    <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
      {items.map((it) => (
        <div key={it.title} className="flex items-center gap-3 text-bordeaux">
          <it.icon className="h-6 w-6 text-gold shrink-0" strokeWidth={1.4} />
          <div>
            <div className="font-serif text-sm">{it.title}</div>
            <div className="text-xs text-bordeaux/60">{it.text}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Promise;
