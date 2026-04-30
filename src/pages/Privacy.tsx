import LegalPage from "@/components/LegalPage";
import { useAdmin } from "@/context/AdminContext";

const Privacy = () => {
  const { settings } = useAdmin();
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle={`Nous traitons vos données personnelles conformément au RGPD. ${settings.siteName}.`}
      crumb="Confidentialité"
      sections={[
        { heading: "Données collectées", body: <p>Raison sociale, SIRET, nom du contact, email et mot de passe chiffré, historique des commandes.</p> },
        { heading: "Finalités", body: <p>Gestion du compte professionnel, traitement des commandes, facturation, service client, relation commerciale.</p> },
        { heading: "Durée de conservation", body: <p>Données de compte : durée de la relation commerciale + 3 ans. Données de facturation : 10 ans (obligation légale).</p> },
        { heading: "Vos droits", body: <p>Accès, rectification, effacement, portabilité, opposition : écrivez à {settings.email}.</p> },
        { heading: "Cookies", body: <p>Nous utilisons uniquement des cookies strictement nécessaires au bon fonctionnement du site (panier, session).</p> },
      ]}
    />
  );
};

export default Privacy;
