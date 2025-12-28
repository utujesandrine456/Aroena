'use client';

import { Order, api } from '@/lib/api';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface OrdersProps {
  orders: Order[];
}

export default function OrdersPage({ orders }: OrdersProps) {
  const statusConfig: Record<string, {
    bg: string,
    text: string,
    icon: React.ReactNode,
    dot: string
  }> = {
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      icon: <Clock className="w-4 h-4" />,
      dot: 'bg-amber-500'
    },
    processing: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      icon: <AlertCircle className="w-4 h-4" />,
      dot: 'bg-blue-500'
    },
    completed: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      icon: <CheckCircle className="w-4 h-4" />,
      dot: 'bg-emerald-500'
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      icon: <XCircle className="w-4 h-4" />,
      dot: 'bg-red-500'
    },
  };

  return (
    <div className="p-0">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage all customer orders</p>
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order: Order) => {
                const status = order.status.toLowerCase();
                const statusInfo = statusConfig[status] || statusConfig.pending;

                const handleStatusUpdate = async (newStatus: 'APPROVED' | 'REJECTED') => {
                  if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this order?`)) return;
                  try {
                    await api.updateOrderStatus(order.id, newStatus);
                    window.location.reload();
                  } catch (error) {
                    console.error('Failed to update status:', error);
                    alert('Failed to update status');
                  }
                };

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {order.service?.title || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || 'No email'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.quantity}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#FF4A1C]">{order.total.toFixed(2)} Frw</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${statusInfo.dot}`}></div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                          {statusInfo.icon}
                          {order.status}
                        </span>
                      </div>
                      {status === 'pending' && (
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate('APPROVED');
                            }}
                            className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate('REJECTED');
                            }}
                            className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Total: <span className="font-medium text-gray-800">{orders.length} orders</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}