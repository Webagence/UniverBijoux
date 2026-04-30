import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Promise from "@/components/Promise";
import ProductGrid from "@/components/ProductGrid";
import Categories from "@/components/Categories";
import NewByUniverse from "@/components/NewByUniverse";
import Atelier from "@/components/Atelier";
import Testimonials from "@/components/Testimonials";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Maison Lune · Grossiste bijoux faits main à Paris";
    const desc =
      "Maison Lune — grossiste B2B de bijoux délicats en or recyclé, fabriqués à Paris. Catalogue colliers, boucles, bagues, bracelets pour revendeurs.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <Layout>
      <Hero />
      <Promise />
      <ProductGrid />
      <Categories />
      <NewByUniverse />
      <Atelier />
      <Testimonials />
    </Layout>
  );
};

export default Index;
