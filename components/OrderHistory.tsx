
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getOrderHistory } from '../services/api';
import type { Order } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

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
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">{t('common.completed')}</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">{t('common.pending')}</span>;
      case 'failed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">{t('common.failed')}</span>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-4">{t('common.orderHistory')}</h2>
      {isLoading && <div className="flex justify-center p-8"><Spinner /></div>}
      {error && <p className="text-red-400">{error}</p>}
      {!isLoading && !error && orders.length === 0 && <p className="text-gray-400">{t('common.noOrdersYet')}</p>}
      {!isLoading && !error && orders.length > 0 && (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('common.date')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('payment.amount')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('payment.points')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('common.status')}</th>
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