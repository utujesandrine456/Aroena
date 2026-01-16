'use client';
import { RefreshCw, BarChart3, TrendingUp, Clock } from 'lucide-react';

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
    <div className="bg-linear-to-br from-white to-orange-50/30 p-6 rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-[#FF4A1C] to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 text-sm mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF4A1C]/10 rounded-lg border border-[#FF4A1C]/20">
              <div className="w-2.5 h-2.5 bg-[#FF4A1C] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">{ordersCount} Orders</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-700">{usersCount} Users</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-700">{servicesCount} Services</span>
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#FF4A1C] hover:text-[#FF4A1C] transition-all duration-200 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>
    </div>
  );
}