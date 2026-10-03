import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-brand text-white' : 'hover:bg-gray-100'}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[200px_1fr] gap-8">
      <aside className="space-y-1">
        <NavLink to="/admin" end className={linkClass}>Товары</NavLink>
        <NavLink to="/admin/products/new" className={linkClass}>Добавить товар</NavLink>
        <NavLink to="/admin/orders" className={linkClass}>Заказы</NavLink>
        <NavLink to="/admin/requests" className={linkClass}>Заявки</NavLink>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
