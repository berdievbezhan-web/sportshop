import { useEffect, useState } from 'react';
import api from '../api/client';

const STATUSES = ['open', 'contacted', 'closed'];
const LABELS = { open: 'Открыта', contacted: 'Связались', closed: 'Закрыта' };

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const load = () => api.get('/requests').then((res) => setRequests(res.data));
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/requests/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Заявки на отсутствующий товар ({requests.length})</h2>
      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-semibold">{r.name} · {r.phone}</p>
                <p className="text-xs text-gray-500">
                  {r.category} {r.desiredSize && `· размер ${r.desiredSize}`} {r.product?.title && `· ${r.product.title}`}
                </p>
              </div>
              <select value={r.status} onChange={(e) => setStatus(r._id, e.target.value)} className="border rounded px-2 py-1 text-sm h-fit">
                {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
              </select>
            </div>
            {r.comment && <p className="text-sm text-gray-600 italic">«{r.comment}»</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
