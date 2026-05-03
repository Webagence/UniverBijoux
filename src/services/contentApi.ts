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

  getPromises: async () => {
    const { data } = await api.get('/content/promises');
    return data.promises || [];
  },

  getCategoriesSection: async () => {
    const { data } = await api.get('/content/categories_section');
    return data.content || {};
  },

  getProductGridSection: async () => {
    const { data } = await api.get('/content/product_grid_section');
    return data.content || {};
  },

  getNewByUniverseSection: async () => {
    const { data } = await api.get('/content/new_by_universe_section');
    return data.content || {};
  },

  getTestimonialsSection: async () => {
    const { data } = await api.get('/content/testimonials_section');
    return data.content || {};
  },

  getLegalPage: async (page: string) => {
    const { data } = await api.get(`/content/legal/${page}`);
    return data.content || {};
  },

  getContactPage: async () => {
    const { data } = await api.get('/content/contact_page');
    return data.content || {};
  },

  getFAQPageHeader: async () => {
    const { data } = await api.get('/content/faq_page_header');
    return data.content || {};
  },
};
