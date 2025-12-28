'use client';

import { useEffect, useState } from 'react';
import Orders from './components/orders';
import Services from './components/services';
import Users from './components/users';
import Sidebar from './components/sidebar';
import Header from './components/header';
import { api } from '@/lib/api';

type TabType = 'orders' | 'services' | 'users';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, servicesRes] = await Promise.all([
        api.getOrders(),
        api.getUsers(),
        api.getServices(),
      ]);
      setOrders(ordersRes);
      setUsers(usersRes);
      setServices(servicesRes);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 rounded-full border-4 border-[#FF4A1C] border-t-transparent" />
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 space-y-8">
        {/* Header */}
        <Header
          ordersCount={orders.length}
          usersCount={users.length}
          servicesCount={services.length}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchAllData();
          }}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Orders', value: orders.length, color: 'border-l-4 border-[#FF4A1C]' },
            { label: 'Active Users', value: users.length, color: 'border-l-4 border-blue-500' },
            { label: 'Services', value: services.length, color: 'border-l-4 border-emerald-500' },
            { 
              label: 'Total Revenue', 
              value: `${orders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()} Frw`,
              color: 'border-l-4 border-amber-500'
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className={`pl-4 ${s.color}`}>
                <p className="text-sm text-gray-500 font-medium mb-2">{s.label}</p>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {activeTab === 'orders' && <Orders orders={orders} />}
          {activeTab === 'services' && <Services services={services} />}
          {activeTab === 'users' && <Users users={users} />}
        </div>
      </div>
    </div>
  );
}