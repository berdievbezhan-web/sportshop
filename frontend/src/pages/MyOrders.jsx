import { useEffect, useState } from 'react';
import api from '../api/client';

const statusLabels = {
  new: 'Новый', confirmed: 'Подтверждён', shipped: 'В пути', completed: 'Завершён', cancelled: 'Отменён',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders/my').then((res) => setOrders(res.data)); }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Мои заказы</h2>
      {orders.length === 0 && <p className="text-gray-500">Заказов пока нет.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <p className="font-semibold">Заказ от {new Date(o.createdAt).toLocaleDateString('ru-RU')}</p>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">{statusLabels[o.status]}</span>
            </div>
            {o.items.map((i, idx) => (
              <p key={idx} className="text-sm text-gray-600">{i.title} — {i.size} × {i.quantity}</p>
            ))}
            <p className="font-bold mt-2">Итого: {o.total} сомони</p>
          </div>
        ))}
      </div>
    </div>
  );
}
