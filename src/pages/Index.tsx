import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Promise from "@/components/Promise";
import ProductGrid from "@/components/ProductGrid";
import Categories from "@/components/Categories";
import NewByUniverse from "@/components/NewByUniverse";
import Atelier from "@/components/Atelier";
import Testimonials from "@/components/Testimonials";
import { useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

const Index = () => {
  const { settings, hero } = useAdmin();

  useEffect(() => {
    document.title = `${settings.siteName} · ${settings.tagline}`;
    const desc = hero.paragraph || settings.tagline;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [settings, hero]);

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
