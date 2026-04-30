import LegalPage from "@/components/LegalPage";

const Legal = () => (
  <LegalPage
    title="Mentions légales"
    crumb="Mentions légales"
    sections={[
      { heading: "Éditeur", body: <p>Maison Lune SAS · Capital social : 50 000€ · SIRET 123 456 789 00012 · RCS Paris · N° TVA FR12 123456789<br />12 rue du Faubourg Saint-Honoré, 75008 Paris, France</p> },
      { heading: "Directeur de la publication", body: <p>Mme Camille Lune, Présidente.</p> },
      { heading: "Hébergeur", body: <p>Lovable Cloud — hébergement et distribution en Europe.</p> },
      { heading: "Contact", body: <p>pro@maisonlune.fr · +33 1 42 00 00 00</p> },
      { heading: "Propriété intellectuelle", body: <p>L'ensemble du site (textes, images, logos, graphismes) est protégé par le droit d'auteur et est la propriété exclusive de Maison Lune SAS.</p> },
    ]}
  />
);

export default Legal;
