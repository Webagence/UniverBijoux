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

export const discountApi = {
  validate: async (payload: ValidateDiscountPayload): Promise<ValidateDiscountResponse> => {
    const { data } = await api.post('/discounts/validate', payload);
    return data;
  },
};
