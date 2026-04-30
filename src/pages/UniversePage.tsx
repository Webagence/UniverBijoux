import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { universes, Universe } from "@/data/products";
import { useAdmin } from "@/context/AdminContext";

const UniversePage = () => {
  const { universe } = useParams<{ universe: string }>();
  const { products } = useAdmin();
  const meta = universes.find((u) => u.key === universe);
  if (!meta) return <Navigate to="/boutique" replace />;
  const items = products.filter((p) => p.universe === (universe as Universe));

  return (
    <Layout>
      <PageHeader
        eyebrow="Univers"
        title={meta.label}
        subtitle={`${items.length} pièces disponibles. Tous les prix sont HT, réservés aux professionnels.`}
        crumbs={[{ label: "Boutique", to: "/boutique" }, { label: meta.label }]}
      />
      <section className="container py-12 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default UniversePage;
