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
}

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
