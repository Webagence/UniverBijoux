import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const Privacy = () => {
  const { legalContent, settings } = useAdmin();
  const content = legalContent.privacy;
  return (
    <LegalPage
      title={content.title || "Politique de confidentialité"}
      subtitle={content.subtitle || `Nous traitons vos données personnelles conformément au RGPD. ${settings.siteName}.`}
      crumb="Confidentialité"
      sections={(content.sections || []).map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default Privacy;
