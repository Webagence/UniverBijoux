import { Link } from "react-router-dom";
import { Product, formatEUR } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface Props {
  product: Product;
}

const ProductCard = ({ product: p }: Props) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const isOutOfStock = p.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast({ title: "Rupture de stock", description: `${p.name} n'est pas disponible.` });
      return;
    }
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous à votre compte professionnel pour commander.",
      });
      return;
    }
    addItem(p.id, p.moq);
    toast({ title: "Ajouté au panier", description: `${p.name} × ${p.moq}` });
  };

  return (
    <article className={`group ${isOutOfStock ? "opacity-60" : ""}`}>
      <Link to={isOutOfStock ? "#" : `/produit/${p.slug}`} className="block">
        <div className="relative overflow-hidden bg-cream aspect-[4/5] mb-4">
          <img
            src={p.images[0]}
            alt={p.name}
            loading="lazy"
            width={800}
            height={1000}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {p.tag && (
              <span className="bg-ivory text-bordeaux text-[10px] tracking-luxe uppercase px-3 py-1.5">
                {p.tag}
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-bordeaux text-ivory text-[10px] tracking-luxe uppercase px-3 py-1.5">
                Épuisé
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Ajouter aux favoris"
            onClick={(e) => {
              e.preventDefault();
              toast({ title: "Ajouté à vos favoris", description: p.name });
            }}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-ivory/90 flex items-center justify-center text-bordeaux hover:text-gold hover:bg-ivory transition-smooth"
          >
            <Heart className="h-4 w-4" />
          </button>
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-smooth">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full bg-bordeaux text-ivory text-xs tracking-luxe uppercase py-3.5 hover:bg-gold transition-smooth"
              >
                Ajouter au panier
              </button>
            </div>
          )}
        </div>
        <div className="space-y-1 px-1">
          <p className="text-[11px] uppercase tracking-luxe text-bordeaux/50">
            {p.universeLabel} · Réf. {p.reference}
            {p.qualityGrade && <span className="ml-1 text-gold">({p.qualityGrade})</span>}
          </p>
          <h3 className="font-serif text-lg text-bordeaux">{p.name}</h3>
          <div className="flex items-baseline gap-2">
            {p.salePriceHT ? (
              <>
                <span className="text-red-600 font-medium">{formatEUR(p.salePriceHT)} HT</span>
                <span className="text-bordeaux/40 text-xs line-through">{formatEUR(p.priceHT)}</span>
              </>
            ) : (
              <span className="text-bordeaux font-medium">{formatEUR(p.priceHT)} HT</span>
            )}
            <span className="text-bordeaux/40 text-xs">
              Min. {p.moq} pcs
            </span>
          </div>
          <p className="text-[11px] text-bordeaux/50">
            PVC conseillé : {formatEUR(p.retailTTC)} TTC
          </p>
          <p className="text-[10px] text-bordeaux/40">
            Stock : {p.stock} pcs
          </p>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
