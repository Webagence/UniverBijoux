import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import Atelier from "@/components/Atelier";

const AtelierPage = () => (
  <Layout>
    <PageHeader
      eyebrow="Notre maison"
      title="L'atelier Maison Lune"
      subtitle="Un savoir-faire français, à la main, geste après geste."
      crumbs={[{ label: "L'Atelier" }]}
    />
    <Atelier />
  </Layout>
);

export default AtelierPage;
