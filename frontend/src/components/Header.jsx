import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
  { key: 'tshirts', label: 'Футболки' },
  { key: 'tracksuits', label: 'Спортивки' },
  { key: 'shorts', label: 'Шорты' },
  { key: 'pants', label: 'Брюки / бриджи' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <header className="sticky top-0 z-20 bg-brand text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-wide">
          SPORT<span className="text-brand-accent">FORM</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {categories.map((c) => (
            <NavLink
              key={c.key}
              to={`/catalog/${c.key}`}
              className={({ isActive }) =>
                `hover:text-brand-accent transition ${isActive ? 'text-brand-accent' : ''}`
              }
            >
              {c.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/request" className="hidden sm:inline hover:text-brand-accent">
            Нет размера?
          </Link>
          <Link to="/cart" className="relative hover:text-brand-accent">
            Корзина
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-accent text-white rounded-full text-xs px-1.5">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="hover:text-brand-accent">Админ-панель</Link>
              ) : (
                <Link to="/my-orders" className="hover:text-brand-accent">Мои заказы</Link>
              )}
              <button onClick={logout} className="hover:text-brand-accent">Выйти</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-brand-accent">Войти</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export { categories };
