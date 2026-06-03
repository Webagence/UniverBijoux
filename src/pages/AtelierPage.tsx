import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import Atelier from "@/components/Atelier";
import { useAdmin } from "@/context/AdminContext";
import { PageSkeleton } from "@/components/Skeletons";

const AtelierPage = () => {
  const { atelier: a } = useAdmin();
  if (!a) return <Layout><PageSkeleton /></Layout>;
  return (
    <Layout>
      <PageHeader
        eyebrow={a.eyebrow}
        title={a.title}
        subtitle={a.paragraph1}
        crumbs={[{ label: "L'Atelier" }]}
      />
      <Atelier />
    </Layout>
  );
};

export default AtelierPage;
