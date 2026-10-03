import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { resolveImage } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => {
      setProduct(res.data);
      const firstAvailable = res.data.sizes.find((s) => s.stock > 0);
      if (firstAvailable) setSize(firstAvailable.size);
    });
  }, [id]);

  if (!product) return <div className="max-w-6xl mx-auto px-4 py-10">Загрузка...</div>;

  const sizeEntry = product.sizes.find((s) => s.size === size);
  const inStock = sizeEntry && sizeEntry.stock > 0;

  const handleAdd = () => {
    addItem(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="grid grid-cols-2 gap-2">
        {(product.images.length ? product.images : [null]).map((img, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {img ? <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-400">Нет фото</span>}
          </div>
        ))}
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-brand-accent text-2xl font-extrabold mb-4">{product.price} сомони</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <p className="font-semibold mb-2">Размер:</p>
        <div className="flex gap-2 mb-6 flex-wrap">
          {product.sizes.map((s) => (
            <button
              key={s.size}
              onClick={() => setSize(s.size)}
              disabled={s.stock === 0}
              className={`px-4 py-2 rounded border text-sm font-semibold
                ${size === s.size ? 'bg-brand text-white border-brand' : 'border-gray-300'}
                ${s.stock === 0 ? 'opacity-40 cursor-not-allowed line-through' : 'hover:border-brand'}`}
            >
              {s.size}
            </button>
          ))}
        </div>

        {inStock ? (
          <button
            onClick={handleAdd}
            className="w-full md:w-auto bg-brand-accent hover:bg-red-600 transition text-white font-semibold px-8 py-3 rounded-lg"
          >
            {added ? 'Добавлено!' : 'Добавить в корзину'}
          </button>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="mb-3 text-sm text-gray-700">
              Этого размера нет в наличии. Оставьте заявку — мы сообщим, когда товар появится.
            </p>
            <button
              onClick={() => navigate('/request', { state: { productId: product._id, category: product.category, size } })}
              className="bg-brand text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90"
            >
              Оставить заявку
            </button>
          </div>
        )}

        {!user && (
          <p className="text-xs text-gray-500 mt-4">
            Для оформления заказа потребуется <Link to="/login" className="underline">вход или регистрация</Link> по номеру телефона.
          </p>
        )}
      </div>
    </div>
  );
}
