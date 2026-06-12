import api from './api';

export interface ShippingboSettings {
  client_id: string;
  client_secret: string | null;
  app_id: string;
  webhook_secret: string | null;
  is_connected: boolean;
  token_expires_at: string;
  webhook_url: string;
}

export interface ShippingboSyncStatus {
  is_connected: boolean;
  products: {
    total: number;
    synced: number;
    pending: number;
  };
  orders: {
    total: number;
    synced: number;
    pending: number;
  };
  webhook_url: string;
}

export const shippingboApi = {
  getSettings: () => api.get<ShippingboSettings>('/admin/shippingbo/settings'),

  updateSettings: (data: { client_id: string; client_secret: string; app_id: string }) =>
    api.put('/admin/shippingbo/settings', data),

  getAuthorizationUrl: () => api.get<{ authorization_url: string }>('/admin/shippingbo/authorize'),

  getSyncStatus: () => api.get<ShippingboSyncStatus>('/admin/shippingbo/sync-status'),

  syncAllProducts: () => api.post('/admin/shippingbo/sync/products'),

  syncProduct: (productId: string) =>
    api.post(`/admin/shippingbo/sync/products/${productId}`),

  syncOrder: (orderId: string) =>
    api.post(`/admin/shippingbo/sync/orders/${orderId}`),
};
