import api from './api';

export const stripeApi = {
  createPaymentIntent: async (payload: {
    items: { product_id: string; quantity: number }[];
    shipping_address: Record<string, string>;
    carrier?: string;
    notes?: string;
    discount_code?: string;
  }) => {
    const { data } = await api.post('/stripe/create-payment-intent', payload);
    return data;
  },

  confirmPayment: async (orderId: string, paymentIntentId: string) => {
    const { data } = await api.post('/stripe/confirm', {
      order_id: orderId,
      payment_intent_id: paymentIntentId,
    });
    return data;
  },
};
