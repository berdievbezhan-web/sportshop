import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ phone: '', password: '', name: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = mode === 'login' ? await login(form.phone, form.password) : await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === 'login' ? 'Вход' : 'Регистрация'}
      </h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        {mode === 'register' && (
          <input
            placeholder="Имя"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        )}
        <input
          placeholder="Номер телефона (+992...)"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        {mode === 'register' && (
          <input
            placeholder="Адрес доставки (необязательно)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="w-full bg-brand text-white font-semibold py-2.5 rounded-lg hover:opacity-90"
        >
          {loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        {mode === 'login' ? (
          <>Нет аккаунта? <button className="text-brand-accent underline" onClick={() => setMode('register')}>Зарегистрироваться</button></>
        ) : (
          <>Уже есть аккаунт? <button className="text-brand-accent underline" onClick={() => setMode('login')}>Войти</button></>
        )}
      </p>
    </div>
  );
}
