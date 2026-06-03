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
  address?: string;
  shipping?: string;
  hours?: string;
  phone?: string;
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
  logo?: string;
  footerBrand?: string;
  siret?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialLinkedin?: string;
  stripePublishableKey?: string;
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


