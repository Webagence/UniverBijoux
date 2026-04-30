import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import Atelier from "@/components/Atelier";
import { useAdmin } from "@/context/AdminContext";

const AtelierPage = () => {
  const { atelier: a } = useAdmin();
  return (
    <Layout>
      <PageHeader
        eyebrow={a.eyebrow || "Notre maison"}
        title={a.title || "L'atelier"}
        subtitle={a.paragraph1 || "Un savoir-faire français, à la main, geste après geste."}
        crumbs={[{ label: "L'Atelier" }]}
      />
      <Atelier />
    </Layout>
  );
};

export default AtelierPage;
