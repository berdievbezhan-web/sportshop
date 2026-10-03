import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { resolveImage } from '../api/client';
import { categories } from '../components/Header';

export default function Catalog() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', { params: category ? { category } : {} })
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, [category]);

  const label = categories.find((c) => c.key === category)?.label || 'Все товары';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">{label}</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">
          Товаров пока нет.{' '}
          <Link to="/request" className="text-brand-accent underline">
            Оставить заявку
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {p.images?.[0] ? (
                  <img src={resolveImage(p.images[0])} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Нет фото</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                <p className="text-brand-accent font-bold">{p.price} сомони</p>
                {p.totalStock === 0 && (
                  <p className="text-xs text-red-500 mt-1">Нет в наличии</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
