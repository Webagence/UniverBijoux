import api from './api';

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
  author: string;
  role: string;
  shop: string;
  quote: string;
  rating: number;
  display_order: number;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  active: boolean;
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

export const contentApi = {
  getHero: async () => {
    const { data } = await api.get('/content/hero');
    return data.content as HeroContent;
  },

  getAtelier: async () => {
    const { data } = await api.get('/content/atelier');
    return data.content as AtelierContent;
  },

  getTestimonials: async () => {
    const { data } = await api.get('/content/testimonials');
    return data.testimonials as Testimonial[];
  },

  getFaq: async (category?: string) => {
    const { data } = await api.get('/content/faq', { params: { category } });
    return data.faq as FaqItem[];
  },

  getSettings: async () => {
    const { data } = await api.get('/content/settings');
    return data.settings as SiteSettings;
  },
};
