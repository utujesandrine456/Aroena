'use client';

import { User } from '@/lib/api';

interface UsersProps{
  users: User[];
}

export default function UsersPage({ users} : UsersProps) {
  const roleColors: Record<string, { bg: string, text: string }> = {
    admin: { bg: 'bg-red-100', text: 'text-red-800' },
    manager: { bg: 'bg-blue-100', text: 'text-blue-800' },
    staff: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    guest: { bg: 'bg-gray-100', text: 'text-gray-800' },
  };

  const statusColors: Record<string, { dot: string, text: string }> = {
    active: { dot: 'bg-emerald-500', text: 'text-emerald-700' },
    inactive: { dot: 'bg-amber-500', text: 'text-amber-700' },
    pending: { dot: 'bg-blue-500', text: 'text-blue-700' },
    suspended: { dot: 'bg-red-500', text: 'text-red-700' },
  };

  return (
    <div className="p-0">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800">Users Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all user accounts and permissions</p>
      </div>
      
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: User) => {
                const statusInfo = statusColors[user.status?.toLowerCase() || 'active'] || statusColors.active;
                const roleInfo = roleColors[user.role?.toLowerCase() || 'guest'] || roleColors.guest;
                
                return (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="font-medium text-gray-600">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleInfo.bg} ${roleInfo.text}`}>
                        {user.role || 'guest'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dot}`}></div>
                        <span className={`text-sm font-medium ${statusInfo.text}`}>
                          {user.status || 'active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.joinDate && new Date(user.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{users.length}</span> users
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm bg-[#FF4A1C] text-white rounded-md hover:bg-[#FF4A1C]/90">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}