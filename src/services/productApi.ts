import api from './api';

export interface Product {
  id: string;
  slug: string;
  name: string;
  reference: string;
  description: string;
  universe_id: string;
  price_ht: number;
  retail_ttc: number;
  vat_rate: number;
  moq: number;
  pack_size: number;
  stock: number;
  images: string[];
  material: string;
  finish: string;
  tag: string;
  is_new: boolean;
  active: boolean;
  universe?: Universe;
}

export interface Universe {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
  products_count?: number;
}

export const productApi = {
  getAll: async (params?: { universe?: string; search?: string; new?: boolean; tag?: string; per_page?: number; page?: number }) => {
    const { data } = await api.get('/products', { params });
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await api.get(`/products/${slug}`);
    return data.product;
  },

  getUniverses: async () => {
    const { data } = await api.get('/products/universes');
    return data.universes;
  },

  getNewArrivals: async (limit = 12) => {
    const { data } = await api.get('/products/new-arrivals', { params: { limit } });
    return data.products;
  },

  getBestsellers: async (limit = 8) => {
    const { data } = await api.get('/products/bestsellers', { params: { limit } });
    return data.products;
  },
};
