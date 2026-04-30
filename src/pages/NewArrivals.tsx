import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { useAdmin } from "@/context/AdminContext";

const NewArrivals = () => {
  const { products } = useAdmin();
  const items = products.filter((p) => p.isNew).slice(0, 50);
  return (
    <Layout>
      <PageHeader
        eyebrow="Collection"
        title="Nouveautés"
        subtitle="Les dernières pièces référencées au catalogue, tous univers confondus."
        crumbs={[{ label: "Nouveautés" }]}
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

export default NewArrivals;
