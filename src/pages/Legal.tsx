import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const Legal = () => {
  const { settings } = useAdmin();
  return (
    <LegalPage
      title="Mentions légales"
      crumb="Mentions légales"
      sections={[
        { heading: "Éditeur", body: <p>{settings.siteName} · {settings.address}</p> },
        { heading: "Directeur de la publication", body: <p>Responsable de la publication.</p> },
        { heading: "Hébergeur", body: <p>Hébergement et distribution en Europe.</p> },
        { heading: "Contact", body: <p>{settings.email} · {settings.phone}</p> },
        { heading: "Propriété intellectuelle", body: <p>L'ensemble du site (textes, images, logos, graphismes) est protégé par le droit d'auteur et est la propriété exclusive de {settings.siteName}.</p> },
      ]}
    />
  );
};

export default Legal;
