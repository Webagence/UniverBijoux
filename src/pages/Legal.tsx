import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const Legal = () => {
  const { legalContent, settings } = useAdmin();
  const content = legalContent.legal;
  return (
    <LegalPage
      title={content.title || "Mentions légales"}
      crumb="Mentions légales"
      sections={(content.sections || []).map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default Legal;
