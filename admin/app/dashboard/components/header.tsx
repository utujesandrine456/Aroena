'use client';
import { RefreshCw, BarChart3 } from 'lucide-react';

interface HeaderProps {
  ordersCount: number;
  usersCount: number;
  servicesCount: number;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Header({
  ordersCount,
  usersCount,
  servicesCount,
  refreshing,
  onRefresh,
}: HeaderProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FF4A1C]/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#FF4A1C]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-500 text-sm">
                Welcome to your admin dashboard
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF4A1C] rounded-full"></div>
              <span className="text-sm text-gray-600">{ordersCount} Orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{usersCount} Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">{servicesCount} Services</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}