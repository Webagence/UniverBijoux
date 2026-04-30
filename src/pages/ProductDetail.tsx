import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Layout from "@/components/Layout";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import { formatEUR } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";
import { Minus, Plus, ShieldCheck, Truck, Factory } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useAdmin();
  const product = slug ? products.find((p) => p.slug === slug) : undefined;
  const { user } = useAuth();
  const { addItem } = useCart();
  const [qty, setQty] = useState(product?.moq ?? 1);

  if (!product) return <Navigate to="/boutique" replace />;

  const related = products.filter((p) => p.universe === product.universe && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous à votre compte pro pour commander.",
      });
      return;
    }
    if (qty < product.moq) {
      toast({ title: "Quantité insuffisante", description: `Minimum ${product.moq} pièces.` });
      return;
    }
    addItem(product.id, qty);
    toast({ title: "Ajouté au panier", description: `${product.name} × ${qty}` });
  };

  return (
    <Layout>
      <div className="container py-8">
        <nav className="text-[11px] tracking-luxe uppercase text-bordeaux/50 flex items-center gap-2 mb-8">
          <Link to="/" className="hover:text-gold transition-smooth">Accueil</Link>
          <span>/</span>
          <Link to={`/boutique/${product.universe}`} className="hover:text-gold transition-smooth">
            {product.universeLabel}
          </Link>
          <span>/</span>
          <span className="text-bordeaux">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <ProductGallery images={product.images} alt={product.name} />

          <div className="space-y-6">
            {product.tag && (
              <span className="inline-block bg-cream text-bordeaux text-[10px] tracking-luxe uppercase px-3 py-1.5">
                {product.tag}
              </span>
            )}
            <div>
              <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50 mb-2">
                {product.universeLabel} · Réf. {product.reference}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-bordeaux">{product.name}</h1>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl text-bordeaux">{formatEUR(product.priceHT)}</span>
                <span className="text-xs tracking-luxe uppercase text-bordeaux/50">HT / pièce</span>
              </div>
              <p className="text-sm text-bordeaux/60">
                Prix public conseillé : {formatEUR(product.retailTTC)} TTC
              </p>
            </div>

            <p className="text-bordeaux/70 leading-relaxed">{product.description}</p>

            <dl className="grid grid-cols-2 gap-4 text-sm border-y border-border py-5">
              <div>
                <dt className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Matière</dt>
                <dd className="text-bordeaux">{product.material}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Finition</dt>
                <dd className="text-bordeaux">{product.finish}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Quantité minimale</dt>
                <dd className="text-bordeaux">{product.moq} pièces</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Conditionnement</dt>
                <dd className="text-bordeaux">Par {product.packSize}</dd>
              </div>
            </dl>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(product.moq, q - product.packSize))}
                  aria-label="Diminuer"
                  className="h-12 w-12 flex items-center justify-center text-bordeaux hover:bg-cream transition-smooth"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                  className="w-16 h-12 text-center bg-transparent focus:outline-none text-bordeaux"
                />
                <button
                  onClick={() => setQty((q) => q + product.packSize)}
                  aria-label="Augmenter"
                  className="h-12 w-12 flex items-center justify-center text-bordeaux hover:bg-cream transition-smooth"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 bg-bordeaux text-ivory px-8 py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
              >
                Ajouter au panier · {formatEUR(product.priceHT * qty)} HT
              </button>
            </div>

            {!user && (
              <p className="text-sm text-bordeaux/60">
                <Link to="/connexion" className="text-gold border-b border-gold">
                  Connectez-vous
                </Link>{" "}
                à votre compte professionnel pour commander.
              </p>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-bordeaux/70">
              <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-gold" /> Livraison 48h</li>
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Garantie à vie</li>
              <li className="flex items-center gap-2"><Factory className="h-4 w-4 text-gold" /> Fabrication française</li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-3xl text-bordeaux mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
