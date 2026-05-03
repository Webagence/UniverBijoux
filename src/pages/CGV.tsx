import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const CGV = () => {
  const { legalContent, settings } = useAdmin();
  const content = legalContent.cgv;
  return (
    <LegalPage
      eyebrow={content.eyebrow || "Conditions"}
      title={content.title || "Conditions générales de vente"}
      subtitle={content.subtitle || `Applicables aux clients professionnels de ${settings.siteName}.`}
      crumb="CGV"
      sections={(content.sections || []).map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default CGV;
