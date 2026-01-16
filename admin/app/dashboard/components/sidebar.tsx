'use client';
import { Package, Users as UsersIcon, Utensils, LogOut, Hotel, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TabType = 'orders' | 'services' | 'users';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void; 
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  
  const menuItems = [
    { label: 'Orders', icon: <Package className="w-5 h-5" />, key: 'orders' as TabType },
    { label: 'Services', icon: <Utensils className="w-5 h-5" />, key: 'services' as TabType },
    { label: 'Users', icon: <UsersIcon className="w-5 h-5" />, key: 'users' as TabType },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      document.cookie = 'admin=; path=/; max-age=0';
      router.push('/');
    }
  };

  return (
    <div className="w-64 bg-linear-to-b from-white to-gray-50 h-screen border-r border-gray-200 flex flex-col shadow-lg">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 bg-linear-to-r from-[#FF4A1C]/5 to-orange-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-linear-to-br from-[#FF4A1C] to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-linear-to-r from-[#FF4A1C] to-orange-600 bg-clip-text text-transparent">
              Aroena Admin
            </h1>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3" />
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left font-semibold transition-all duration-200 relative group ${
                activeTab === item.key 
                  ? 'bg-linear-to-r from-[#FF4A1C] to-orange-600 text-white shadow-lg shadow-[#FF4A1C]/30 transform scale-[1.02]' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
              }`}
            >
              <div className={`transition-transform duration-200 ${activeTab === item.key ? 'text-white scale-110' : 'text-gray-400 group-hover:text-[#FF4A1C]'}`}>
                {item.icon}
              </div>
              <span className="flex-1">{item.label}</span>
              {activeTab === item.key && (
                <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
              {!activeTab && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF4A1C] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border-2 border-transparent transition-all duration-200 font-semibold group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-[-15deg] transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}