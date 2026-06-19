import api from './api';
import { saveToken, clearToken } from '@/lib/auth';

export interface ProProfile {
  id: string;
  email: string;
  company_name: string;
  siret: string;
  contact_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  vat_number: string;
  approved: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  approved: boolean;
  roles: { name: string }[];
  profile?: ProProfile;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      saveToken(data.token);
    }
    return data;
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
    company_name?: string;
    siret?: string;
  }) => {
    const { data } = await api.post('/auth/register', payload);
    if (data.token) {
      saveToken(data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearToken();
    }
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return { user: data.user, profile: data.profile };
  },

  updateProfile: async (payload: {
    name?: string;
    contact_name?: string;
    phone?: string;
    company_name?: string;
    siret?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    vat_number?: string;
  }) => {
    const { data } = await api.put('/auth/profile', payload);
    return { user: data.user, profile: data.profile };
  },
};
