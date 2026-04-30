import api from './api';

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  is_admin: boolean;
  body: string;
  created_at: string;
  author?: { name: string; email: string };
}

export interface Ticket {
  id: string;
  reference: string;
  user_id: string;
  order_id: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  messages?: TicketMessage[];
  order?: { reference: string };
  user?: { name: string; email: string };
}

export const ticketApi = {
  getAll: async (params?: { status?: string; per_page?: number; page?: number }) => {
    const { data } = await api.get('/tickets', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/tickets/${id}`);
    return data.ticket;
  },

  create: async (payload: {
    subject: string;
    order_id?: string;
    priority?: string;
    message: string;
  }) => {
    const { data } = await api.post('/tickets', payload);
    return data;
  },

  reply: async (id: string, message: string) => {
    const { data } = await api.post(`/tickets/${id}/reply`, { message });
    return data;
  },
};
