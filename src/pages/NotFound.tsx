import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="container py-24 md:py-32 text-center space-y-6">
        <div className="text-gold text-xs tracking-luxe uppercase">Erreur 404</div>
        <h1 className="font-serif text-6xl md:text-8xl text-bordeaux">Page introuvable</h1>
        <p className="text-bordeaux/60 max-w-md mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-block bg-bordeaux text-ivory px-10 py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
        >
          Retour à l'accueil
        </Link>
      </section>
    </Layout>
  );
};

export default NotFound;
