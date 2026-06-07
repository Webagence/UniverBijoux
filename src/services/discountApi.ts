import api from './api';

export interface Discount {
  id: string;
  code: string | null;
  name: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  amount_ht: number;
}

export interface ValidateDiscountPayload {
  code: string;
  items: { product_id: string; quantity: number }[];
  subtotal_ht: number;
}

export interface ValidateDiscountResponse {
  valid: boolean;
  message?: string;
  discount?: Discount;
}

export interface AutoDiscount {
  id: string;
  code: null;
  name: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  amount_ht?: number;
}

export const discountApi = {
  getMyDiscounts: async (): Promise<AutoDiscount[]> => {
    const { data } = await api.get('/discounts/my');
    return data.discounts || [];
  },

  validate: async (payload: ValidateDiscountPayload): Promise<ValidateDiscountResponse> => {
    const { data } = await api.post('/discounts/validate', payload);
    return data;
  },
};
