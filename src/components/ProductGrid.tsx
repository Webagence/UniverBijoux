import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useAdmin } from "@/context/AdminContext";
import { useLang } from "@/context/LanguageContext";

const ProductGrid = () => {
  const { products, productGridSection } = useAdmin();
  const { t } = useLang();
  const list = products.filter((p) => p.tag === "Best-seller").slice(0, 4);
  return (
    <section id="collection" className="container py-20 md:py-28">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="text-gold text-xs tracking-luxe uppercase">{productGridSection.eyebrow || t("bestsellers.eyebrow") || "Best-sellers"}</div>
        <h2 className="font-serif text-4xl md:text-5xl text-bordeaux">
          {productGridSection.heading || t("bestsellers.heading") || "Les pièces que"} <em>{productGridSection.headingEm || t("bestsellers.headingEm") || "vos clients adorent"}</em>
        </h2>
        <p className="text-bordeaux/60">
          {productGridSection.description || t("bestsellers.description") || ""}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="text-center mt-16">
        <Link
          to="/boutique"
          className="inline-block border-b border-gold text-bordeaux text-xs tracking-luxe uppercase pb-1 hover:text-gold transition-smooth"
        >
          {productGridSection.ctaText || t("common.seeAllCatalog") || "Voir tout le catalogue →"}
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
