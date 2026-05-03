import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const Shipping = () => {
  const { legalContent, settings } = useAdmin();
  const content = legalContent.shipping;
  return (
    <LegalPage
      eyebrow={content.eyebrow || "Infos pro"}
      title={content.title || "Livraison & retours"}
      subtitle={content.subtitle || `Nos engagements logistiques pour nos partenaires revendeurs. ${settings.siteName}.`}
      crumb="Livraison"
      sections={(content.sections || []).map((s) => ({
        heading: s.heading,
        body: <p>{s.body}</p>,
      }))}
    />
  );
};

export default Shipping;
