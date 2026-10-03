import { useEffect, useState } from 'react';
import api from '../api/client';

const STATUSES = ['new', 'confirmed', 'shipped', 'completed', 'cancelled'];
const LABELS = { new: 'Новый', confirmed: 'Подтверждён', shipped: 'В пути', completed: 'Завершён', cancelled: 'Отменён' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const load = () => api.get('/orders').then((res) => setOrders(res.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Заказы ({orders.length})</h2>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{o.user?.name} · {o.phone}</p>
                <p className="text-xs text-gray-500">{o.address}</p>
              </div>
              <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)} className="border rounded px-2 py-1 text-sm h-fit">
                {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
              </select>
            </div>
            {o.items.map((i, idx) => (
              <p key={idx} className="text-sm text-gray-600">{i.title} — {i.size} × {i.quantity}</p>
            ))}
            {o.comment && <p className="text-sm text-gray-500 italic mt-1">«{o.comment}»</p>}
            <p className="font-bold mt-2">Итого: {o.total} сомони</p>
          </div>
        ))}
      </div>
    </div>
  );
}
