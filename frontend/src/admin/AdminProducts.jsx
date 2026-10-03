import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { resolveImage } from '../api/client';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = () => api.get('/products/admin/all').then((res) => setProducts(res.data));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('Удалить товар?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Товары ({products.length})</h2>
        <Link to="/admin/products/new" className="bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Добавить</Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm divide-y">
        {products.map((p) => (
          <div key={p._id} className="flex items-center gap-4 p-3">
            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0">
              {p.images?.[0] && <img src={resolveImage(p.images[0])} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{p.title}</p>
              <p className="text-xs text-gray-500">{p.category} · {p.price} сомони · остаток: {p.totalStock}</p>
            </div>
            <Link to={`/admin/products/${p._id}/edit`} className="text-sm text-brand underline">Редактировать</Link>
            <button onClick={() => remove(p._id)} className="text-sm text-red-500">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}
