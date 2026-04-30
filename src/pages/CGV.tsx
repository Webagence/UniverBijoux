import LegalPage from "@/components/LegalPage";

const CGV = () => (
  <LegalPage
    eyebrow="Conditions"
    title="Conditions générales de vente"
    subtitle="Applicables aux clients professionnels de Maison Lune."
    crumb="CGV"
    sections={[
      { heading: "1. Objet", body: <p>Les présentes CGV régissent les ventes conclues entre Maison Lune SAS et ses clients professionnels titulaires d'un numéro SIRET valide.</p> },
      { heading: "2. Prix", body: <p>Tous les prix sont exprimés en euros hors taxes (HT). La TVA au taux de 20% s'applique sauf pour les clients intracommunautaires fournissant un numéro de TVA valide.</p> },
      { heading: "3. Commandes", body: <p>La quantité minimale est de 3 pièces par référence. Les commandes sont fermes après validation. Franco de port à partir de 300€ HT en France métropolitaine.</p> },
      { heading: "4. Paiement", body: <p>Paiement à 30 jours date de facture pour les comptes validés. Premier achat : paiement à la commande par virement ou carte.</p> },
      { heading: "5. Livraison", body: <p>Délai standard de 48h après validation pour les pièces en stock. Les risques sont transférés à la remise au transporteur.</p> },
      { heading: "6. Retours & garantie", body: <p>Garantie à vie sur les défauts de fabrication. Retours acceptés sous 14 jours, produits en parfait état et dans leur emballage d'origine.</p> },
      { heading: "7. Propriété intellectuelle", body: <p>Tous les visuels, fiches produit et marques restent la propriété exclusive de Maison Lune.</p> },
      { heading: "8. Litiges", body: <p>Le droit français s'applique. Tout litige relève de la compétence exclusive du Tribunal de Commerce de Paris.</p> },
    ]}
  />
);

export default CGV;
