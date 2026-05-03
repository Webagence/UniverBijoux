// Contenu éditorial par défaut. L'admin peut le modifier via localStorage.

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleEm: string;
  titleLine2: string;
  paragraph: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  quote: string;
  image?: string;
}

export interface AtelierContent {
  eyebrow: string;
  title: string;
  titleEm: string;
  paragraph1: string;
  paragraph2: string;
  badgeNumber: string;
  badgeLabel: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  shop: string;
  text: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  freeShippingFrom: string;
  announcements: string[];
  copyright?: string;
  siret?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialLinkedin?: string;
}

export interface PromiseItem {
  icon: string;
  title: string;
  text: string;
}

export interface SectionHeader {
  eyebrow: string;
  heading: string;
  headingEm: string;
  description: string;
  ctaText?: string;
}

export interface TestimonialsSection {
  eyebrow: string;
  heading: string;
  headingEm: string;
}

export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPageContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  sections: LegalSection[];
}

export interface ContactPageContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  showroomTitle: string;
  showroomText: string;
}

export interface FAQPageHeader {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const defaultTestimonialsSection: TestimonialsSection = {
  eyebrow: "Nos revendeurs en parlent",
  heading: "850 partenaires nous",
  headingEm: "font confiance",
};

export const defaultHero: HeroContent = {
  eyebrow: "Grossiste bijoux · Collection Printemps 2026",
  titleLine1: "Le bijou",
  titleEm: "français",
  titleLine2: "pour les pros",
  paragraph:
    "Bijoux délicats fabriqués en France, distribués en exclusivité aux revendeurs, concept-stores et instituts. Tarifs HT, quantités minimales réduites, réassort 48h.",
  ctaPrimary: "Voir le catalogue",
  ctaSecondary: "Ouvrir un compte pro",
  stat1Value: "850+",
  stat1Label: "revendeurs partenaires",
  stat2Value: "48h",
  stat2Label: "délai de livraison",
  quote: "Un bijou est un sourire qui ne s'efface jamais.",
};

export const defaultLegalContent: Record<string, LegalPageContent> = {
  legal: {
    title: "Mentions légales",
    sections: [
      { heading: "Éditeur", body: "MAISON LUNE · 12 rue Saint-Honoré, 75001 Paris" },
      { heading: "Directeur de la publication", body: "Responsable de la publication." },
      { heading: "Hébergeur", body: "Hébergement et distribution en Europe." },
      { heading: "Contact", body: "pro@maisonlune.fr · +33 1 42 00 00 00" },
      { heading: "Propriété intellectuelle", body: "L'ensemble du site (textes, images, logos, graphismes) est protégé par le droit d'auteur et est la propriété exclusive de MAISON LUNE." },
    ],
  },
  cgv: {
    eyebrow: "Conditions",
    title: "Conditions générales de vente",
    subtitle: "Applicables aux clients professionnels de MAISON LUNE.",
    sections: [
      { heading: "1. Objet", body: "Les présentes CGV régissent les ventes conclues entre MAISON LUNE et ses clients professionnels titulaires d'un numéro SIRET valide." },
      { heading: "2. Prix", body: "Tous les prix sont exprimés en euros hors taxes (HT). La TVA au taux de 20% s'applique sauf pour les clients intracommunautaires fournissant un numéro de TVA valide." },
      { heading: "3. Commandes", body: "La quantité minimale est de 3 pièces par référence. Les commandes sont fermes après validation. Franco de port à partir de 300€ HT en France métropolitaine." },
      { heading: "4. Paiement", body: "Paiement à 30 jours date de facture pour les comptes validés. Premier achat : paiement à la commande par virement ou carte." },
      { heading: "5. Livraison", body: "Délai standard de 48h après validation pour les pièces en stock. Les risques sont transférés à la remise au transporteur." },
      { heading: "6. Retours & garantie", body: "Garantie à vie sur les défauts de fabrication. Retours acceptés sous 14 jours, produits en parfait état et dans leur emballage d'origine." },
      { heading: "7. Propriété intellectuelle", body: "Tous les visuels, fiches produit et marques restent la propriété exclusive de MAISON LUNE." },
      { heading: "8. Litiges", body: "Le droit français s'applique. Tout litige relève de la compétence exclusive du Tribunal de Commerce de Paris." },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    subtitle: "Nous traitons vos données personnelles conformément au RGPD. MAISON LUNE.",
    sections: [
      { heading: "Données collectées", body: "Raison sociale, SIRET, nom du contact, email et mot de passe chiffré, historique des commandes." },
      { heading: "Finalités", body: "Gestion du compte professionnel, traitement des commandes, facturation, service client, relation commerciale." },
      { heading: "Durée de conservation", body: "Données de compte : durée de la relation commerciale + 3 ans. Données de facturation : 10 ans (obligation légale)." },
      { heading: "Vos droits", body: "Accès, rectification, effacement, portabilité, opposition : écrivez à pro@maisonlune.fr." },
      { heading: "Cookies", body: "Nous utilisons uniquement des cookies strictement nécessaires au bon fonctionnement du site (panier, session)." },
    ],
  },
  shipping: {
    eyebrow: "Infos pro",
    title: "Livraison & retours",
    subtitle: "Nos engagements logistiques pour nos partenaires revendeurs. MAISON LUNE.",
    sections: [
      { heading: "Délais & zones", body: "France métropolitaine : 48h ouvrées. UE : 3 à 5 jours ouvrés. International : sur devis." },
      { heading: "Frais de port", body: "Offerts dès 300€ HT en France. 12€ HT en dessous. UE : 25€ HT forfaitaire." },
      { heading: "Suivi", body: "Un email de suivi Colissimo ou Chronopost vous est envoyé dès l'expédition depuis notre atelier." },
      { heading: "Retours", body: "Retours acceptés sous 14 jours, produits non portés et dans leur écrin d'origine. Demandez un bon de retour via votre espace pro." },
      { heading: "Garantie", body: "Tous nos bijoux sont garantis à vie contre les défauts de fabrication. SAV dédié pour nos revendeurs." },
    ],
  },
};

export const defaultContactPage: ContactPageContent = {
  eyebrow: "Nous écrire",
  title: "Contact commercial",
  subtitle: "Une question sur un produit, un devis, ou une demande de partenariat ?",
  showroomTitle: "Showroom sur rendez-vous",
  showroomText: "Du lundi au vendredi, 10h–18h. Prenez contact pour venir découvrir les collections en avant-première.",
};

export const defaultFAQPageHeader: FAQPageHeader = {
  eyebrow: "Aide",
  title: "Questions fréquentes",
  subtitle: "Tout ce que les revendeurs nous demandent le plus souvent.",
};

export const defaultAtelier: AtelierContent = {
  eyebrow: "Notre atelier",
  title: "Le savoir-faire,",
  titleEm: "geste après geste",
  paragraph1:
    "Depuis 2016, Maison Lune façonne des bijoux pensés pour durer. Chaque pièce naît d'un croquis, prend vie sous les mains de nos artisans, et se révèle dans un éclat précieux.",
  paragraph2:
    "Or recyclé, pierres éthiques, finitions à la main : nous avons choisi la lenteur comme luxe ultime.",
  badgeNumber: "12",
  badgeLabel: "Artisans dans notre atelier parisien",
};

export const defaultTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Camille L.",
    shop: "Concept-store Ondine · Lyon",
    text: "Un catalogue qui se vend tout seul. Mes clientes reviennent pour les nouveautés Maison Lune chaque saison.",
  },
  {
    id: "t2",
    name: "Marie D.",
    shop: "Boutique Écrin · Bordeaux",
    text: "Qualité irréprochable, SAV réactif et les réassorts arrivent toujours en 48h. Un vrai partenaire.",
  },
  {
    id: "t3",
    name: "Léa M.",
    shop: "Institut Belle Étoile · Paris",
    text: "Les marges sont confortables et les pièces sont vraiment différenciantes. Indispensable en boutique.",
  },
];

export const defaultFaq: FaqItem[] = [
  { id: "f1", q: "Qui peut commander sur Maison Lune ?", a: "Le site est strictement réservé aux professionnels titulaires d'un numéro SIRET valide : revendeurs, concept-stores, instituts, hôtels." },
  { id: "f2", q: "Quelle est la quantité minimale de commande ?", a: "3 pièces par référence. Pas de minimum global pour une première commande." },
  { id: "f3", q: "Quels sont vos délais de livraison ?", a: "48h ouvrées après validation pour les pièces en stock. Envoi depuis notre atelier parisien." },
  { id: "f4", q: "Proposez-vous des tarifs dégressifs ?", a: "Oui : -10% dès 500€ HT, -15% dès 1 500€ HT, -20% dès 3 000€ HT. Remises appliquées automatiquement au panier." },
  { id: "f5", q: "Comment sont fabriqués vos bijoux ?", a: "Tous nos bijoux sont dessinés et fabriqués à la main dans notre atelier parisien, en or recyclé et avec des pierres éthiques." },
  { id: "f6", q: "Avez-vous un showroom ?", a: "Oui, à Paris 8e, sur rendez-vous. Contactez notre équipe commerciale pour réserver un créneau." },
  { id: "f7", q: "Quelles sont les conditions de paiement ?", a: "Première commande : paiement à la commande. Ensuite, paiement à 30 jours date de facture pour les comptes validés." },
  { id: "f8", q: "Proposez-vous un support marketing ?", a: "Oui : photos HD, fiches produit, PLV, formations vendeurs. Disponibles sur demande auprès de votre commercial dédié." },
];

export const defaultSettings: SiteSettings = {
  siteName: "MAISON LUNE",
  tagline: "Grossiste bijoux français",
  email: "pro@maisonlune.fr",
  phone: "+33 1 42 00 00 00",
  address: "12 rue Saint-Honoré, 75001 Paris",
  freeShippingFrom: "300",
  announcements: [
    "Réservé aux professionnels",
    "Prix HT — TVA 20%",
    "Franco de port dès 300€ HT",
    "Fabrication française",
    "Tarifs dégressifs",
    "Livraison 48h",
  ],
};

export const defaultPromises: PromiseItem[] = [
  { icon: "Truck", title: "Livraison 48h", text: "Franco dès 300€ HT" },
  { icon: "TrendingDown", title: "Tarifs dégressifs", text: "Dès -10% à 500€" },
  { icon: "ShieldCheck", title: "Garantie à vie", text: "Sur toutes les pièces" },
  { icon: "Factory", title: "Fabrication française", text: "Atelier parisien" },
];

export const defaultCategoriesSection: SectionHeader = {
  eyebrow: "Univers",
  heading: "Explorez nos",
  headingEm: "collections",
  description: "Chaque pièce est dessinée et fabriquée dans nos ateliers français.",
};

export const defaultProductGridSection: SectionHeader = {
  eyebrow: "Best-sellers",
  heading: "Les pièces que vos clients",
  headingEm: "adorent",
  description: "Les références les plus commandées par notre réseau de revendeurs.",
  ctaText: "Voir tout le catalogue →",
};

export const defaultNewByUniverseSection: SectionHeader = {
  eyebrow: "Nouveautés par univers",
  heading: "Les",
  headingEm: "nouvelles pièces",
  description: "Les 4 dernières références dans chacun de nos univers.",
  ctaText: "Voir tout →",
};
