import api from './api';

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
      localStorage.setItem('auth_token', data.token);
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
      localStorage.setItem('auth_token', data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  me: async () => {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  updateProfile: async (payload: { name?: string; phone?: string }) => {
    const { data } = await api.put('/auth/profile', payload);
    return data.user;
  },
};
