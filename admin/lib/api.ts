import axios from 'axios';

export const API_URL = 'https://aroena.onrender.com/';

export interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  available: boolean;
  features: string[];
  orders?: { total: number }[]
}

export interface Order {
  id: number;
  quantity: number;
  total: number;
  date: string;
  serviceId: number;
  userId: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  service?: Service;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role?: 'admin' | 'guest';
  status?: 'active' | 'inactive' | 'pending';
  joinDate?: string;
}

export interface Admin {
  id: number;
  email: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalServices: number;
  totalRevenue: number;
  orderStats: {
    completed: number;
    pending: number;
    processing: number;
    cancelled: number;
  };
  userStats: {
    active: number;
    inactive: number;
    pending: number;
  };
  revenueTrend: { date: string; revenue: number }[];
  serviceStats: { category: string; count: number; revenue: number }[];
  popularServices: { id: number; title: string; orders?: { id: number }[]; }[];
}


class ApiClient {
  private api = axios.create({ baseURL: API_URL });

  constructor() {
    this.api.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }


  // ================= Dashboard =================
  async getDashboardStats(): Promise<DashboardStats> {
    const [orders, users, services] = await Promise.all([
      this.getOrders(),
      this.getUsers(),
      this.getServices(),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    const orderStats = {
      completed: orders.filter(o => o.status === 'completed').length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    const revenueTrend = this.calculateRevenueTrend(orders);
    const serviceStats = this.calculateServiceStats(orders, services);

    const popularServices = services
      .map(service => ({
        id: service.id,
        title: service.title,
        orders: orders.filter(o => o.serviceId === service.id),
      }))
      .sort((a, b) => (b.orders?.length || 0) - (a.orders?.length || 0))
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      totalUsers: users.length,
      totalServices: services.length,
      totalRevenue,
      orderStats,
      userStats: {
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        pending: users.filter(u => u.status === 'pending').length,
      },
      revenueTrend,
      serviceStats,
      popularServices,
    };
  }

  private calculateRevenueTrend(orders: Order[]): { date: string; revenue: number }[] {
    const trend: { date: string; revenue: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dailyRevenue = orders
        .filter(order => order.date.startsWith(dateStr))
        .reduce((sum, order) => sum + order.total, 0);

      trend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dailyRevenue,
      });
    }

    return trend;
  }

  private calculateServiceStats(orders: Order[], services: Service[]) {
    const statsMap = new Map<string, { count: number; revenue: number }>();

    orders.forEach(order => {
      const service = services.find(s => s.id === order.serviceId);
      if (service) {
        const category = service.category;
        const current = statsMap.get(category) || { count: 0, revenue: 0 };
        statsMap.set(category, {
          count: current.count + 1,
          revenue: current.revenue + order.total,
        });
      }
    });

    return Array.from(statsMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      revenue: data.revenue,
    }));
  }

  // ================= Orders =================
  async getOrders(): Promise<Order[]> {
    const res = await this.api.get('/orders');
    return res.data;
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    const res = await this.api.put(`/orders/${id}`, data);
    return res.data;
  }

  async deleteOrder(id: number): Promise<void> {
    await this.api.delete(`/orders/${id}`);
  }

  async updateOrderStatus(id: number, status: 'APPROVED' | 'REJECTED'): Promise<Order> {
    const res = await this.api.put(`/orders/${id}/status`, { status });
    return res.data;
  }

  // ================= Services =================
  async getServices(): Promise<Service[]> {
    const res = await this.api.get('/services');
    return res.data;
  }


  async createService(data: Partial<Service>, file: File | null) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    // Only append file if it exists, otherwise backend will use image URL from body
    if (file) {
      formData.append('image', file);
    }

    const res = await this.api.post('/services', formData);
    return res.data;
  }


  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    const { orders, id:_, ...updateData } = data as any;
    const res = await this.api.put(`/services/${id}`, updateData);
    
    return res.data;
  }

  async deleteService(id: number): Promise<void> {
    const res = await this.api.delete(`/services/${id}`);
    return res.data;
  }


  // ================= Users =================
  async getUsers(): Promise<User[]> {
    const res = await this.api.get('/users');
    return res.data;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const res = await this.api.put(`/users/${id}`, data);
    return res.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // ================= Admin =================
  async login(email: string, password: string): Promise<{ token: string; admin: Admin }> {
    const res = await this.api.post('/admin/login', { email, password });
    return res.data;
  }

  async createAdmin(email: string, password: string): Promise<Admin> {
    const res = await this.api.post('/admin/create', { email, password });
    return res.data;
  }

  async getAllAdmins(): Promise<Admin[]> {
    const res = await this.api.get('/admin');
    return res.data;
  }

  async deleteAdmin(id: number): Promise<void> {
    await this.api.delete(`/admin/${id}`);
  }
}

export const api = new ApiClient();
