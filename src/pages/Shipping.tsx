import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const Shipping = () => {
  const { settings } = useAdmin();
  return (
    <LegalPage
      eyebrow="Infos pro"
      title="Livraison & retours"
      subtitle={`Nos engagements logistiques pour nos partenaires revendeurs. ${settings.siteName}.`}
      crumb="Livraison"
      sections={[
        { heading: "Délais & zones", body: <p>France métropolitaine : 48h ouvrées. UE : 3 à 5 jours ouvrés. International : sur devis.</p> },
        { heading: "Frais de port", body: <p>Offerts dès {settings.freeShippingFrom}€ HT en France. 12€ HT en dessous. UE : 25€ HT forfaitaire.</p> },
        { heading: "Suivi", body: <p>Un email de suivi Colissimo ou Chronopost vous est envoyé dès l'expédition depuis notre atelier.</p> },
        { heading: "Retours", body: <p>Retours acceptés sous 14 jours, produits non portés et dans leur écrin d'origine. Demandez un bon de retour via votre espace pro.</p> },
        { heading: "Garantie", body: <p>Tous nos bijoux sont garantis à vie contre les défauts de fabrication. SAV dédié pour nos revendeurs.</p> },
      ]}
    />
  );
};

export default Shipping;
