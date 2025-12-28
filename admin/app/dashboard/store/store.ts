import { create } from 'zustand';
import { api } from '@/lib/api';
import type { Order, User, Service } from '@/lib/api';

interface DashboardState {
  stats: any;
  users: User[];
  orders: Order[];
  services: Service[];
  fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  users: [],
  orders: [],
  services: [],

  fetchAll: async () => {
    const [orders, users, services] = await Promise.all([
      api.getOrders(),
      api.getUsers(),
      api.getServices(),
    ]);

    set({
      stats: await api.getDashboardStats(),
      users,
      orders,
      services,
    });
  },
}));
