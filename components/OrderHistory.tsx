
import React, { useState, useEffect } from 'react';
import { getOrderHistory } from '../services/api';
import type { Order } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getOrderHistory();
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch order history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">Completed</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">Order History</h2>
      {isLoading && <div className="flex justify-center p-8"><Spinner /></div>}
      {error && <p className="text-red-400">{error}</p>}
      {!isLoading && !error && orders.length === 0 && <p className="text-gray-400">You have no orders yet.</p>}
      {!isLoading && !error && orders.length > 0 && (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Points</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
                {orders.map(order => (
                <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">+{order.pointsEarned}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{getStatusChip(order.status)}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      )}
    </Card>
  );
};

export default OrderHistory;