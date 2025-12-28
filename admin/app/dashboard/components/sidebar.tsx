'use client';
import { Package, Users as UsersIcon, Utensils, LogOut } from 'lucide-react';

type TabType = 'orders' | 'services' | 'users';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void; 
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { label: 'Orders', icon: <Package className="w-5 h-5" />, key: 'orders' as TabType },
    { label: 'Services', icon: <Utensils className="w-5 h-5" />, key: 'services' as TabType },
    { label: 'Users', icon: <UsersIcon className="w-5 h-5" />, key: 'users' as TabType },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-[#FF4A1C]">Aroena Admin</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
                activeTab === item.key 
                  ? 'bg-[#FF4A1C] text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`${activeTab === item.key ? 'text-white' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              {item.label}
              {activeTab === item.key && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 font-medium">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}