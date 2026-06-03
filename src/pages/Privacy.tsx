import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";
import { PageSkeleton } from "@/components/Skeletons";

const Privacy = () => {
  const { legalContent } = useAdmin();
  const content = legalContent?.privacy;
  if (!content) return <PageSkeleton />;
  return (
    <LegalPage
      title={content.title}
      subtitle={content.subtitle}
      crumb="Confidentialité"
      sections={content.sections.map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default Privacy;
