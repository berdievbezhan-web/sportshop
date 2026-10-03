import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function StockRequestForm() {
  const location = useLocation();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    category: location.state?.category || '',
    desiredSize: location.state?.size || '',
    comment: '',
  });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/requests', { ...form, product: location.state?.productId });
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка');
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-2">Спасибо!</h2>
        <p className="text-gray-600">Мы получили вашу заявку и свяжемся с вами, когда товар появится в наличии.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-2">Товара нет в наличии?</h2>
      <p className="text-gray-500 mb-6 text-sm">Оставьте заявку — мы сообщим, когда он появится.</p>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <input placeholder="Ваше имя" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input placeholder="Номер телефона" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border rounded px-3 py-2" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded px-3 py-2">
          <option value="">Категория товара</option>
          <option value="tshirts">Футболки</option>
          <option value="tracksuits">Спортивки</option>
          <option value="shorts">Шорты</option>
          <option value="pants">Брюки / бриджи</option>
        </select>
        <input placeholder="Желаемый размер" value={form.desiredSize} onChange={(e) => setForm({ ...form, desiredSize: e.target.value })} className="w-full border rounded px-3 py-2" />
        <textarea placeholder="Комментарий" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full border rounded px-3 py-2" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-brand text-white font-semibold py-2.5 rounded-lg hover:opacity-90">Отправить заявку</button>
      </form>
    </div>
  );
}
