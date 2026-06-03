import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";
import { PageSkeleton } from "@/components/Skeletons";

const Shipping = () => {
  const { legalContent } = useAdmin();
  const content = legalContent?.shipping;
  if (!content) return <PageSkeleton />;
  return (
    <LegalPage
      eyebrow={content.eyebrow}
      title={content.title}
      subtitle={content.subtitle}
      crumb="Livraison"
      sections={content.sections.map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default Shipping;
