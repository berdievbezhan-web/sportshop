import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { resolveImage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import api from '../api/client';

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (!address) return setError('Укажите адрес доставки');
    setSubmitting(true);
    setError('');
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
        address,
        comment,
      });
      clear();
      navigate('/my-orders');
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка оформления заказа');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Корзина пуста</p>
        <Link to="/catalog/tshirts" className="text-brand-accent underline">В каталог</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Корзина</h2>
      <div className="space-y-4 mb-8">
        {items.map((i) => (
          <div key={`${i.productId}-${i.size}`} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
              {i.image && <img src={resolveImage(i.image)} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{i.title}</p>
              <p className="text-sm text-gray-500">Размер: {i.size}</p>
            </div>
            <input
              type="number"
              min="1"
              value={i.quantity}
              onChange={(e) => updateQuantity(i.productId, i.size, Math.max(1, Number(e.target.value)))}
              className="w-16 border rounded px-2 py-1"
            />
            <p className="font-semibold w-24 text-right">{i.price * i.quantity} сомони</p>
            <button onClick={() => removeItem(i.productId, i.size)} className="text-red-500 text-sm">Убрать</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <p className="text-xl font-bold">Итого: {total} сомони</p>
        <input
          placeholder="Адрес доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Комментарий к заказу (необязательно)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full bg-brand-accent hover:bg-red-600 transition text-white font-semibold py-3 rounded-lg"
        >
          {submitting ? 'Оформляем...' : user ? 'Оформить заказ' : 'Войти и оформить заказ'}
        </button>
      </div>
    </div>
  );
}
