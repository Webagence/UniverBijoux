import api from './api';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_reference: string;
  unit_price_ht: number;
  quantity: number;
  line_total_ht: number;
}

export interface Order {
  id: string;
  reference: string;
  user_id: string;
  status: string;
  subtotal_ht: number;
  vat_amount: number;
  shipping_ht: number;
  total_ttc: number;
  shipping_address: Record<string, string>;
  tracking_number: string;
  carrier: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  user?: { name: string; email: string };
}

export const orderApi = {
  getAll: async (params?: { status?: string; per_page?: number; page?: number }) => {
    const { data } = await api.get('/orders', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  },

  create: async (payload: {
    items: { product_id: string; quantity: number }[];
    shipping_address: Record<string, string>;
    carrier?: string;
    notes?: string;
  }) => {
    const { data } = await api.post('/orders', payload);
    return data;
  },

  cancel: async (id: string) => {
    const { data } = await api.post(`/orders/${id}/cancel`);
    return data;
  },
};
