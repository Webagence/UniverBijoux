import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";
import { PageSkeleton } from "@/components/Skeletons";

const Legal = () => {
  const { legalContent } = useAdmin();
  const content = legalContent?.legal;
  if (!content) return <PageSkeleton />;
  return (
    <LegalPage
      title={content.title}
      crumb="Mentions légales"
      sections={content.sections.map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default Legal;
