import { Link } from 'react-router-dom';
import { categories } from '../components/Header';

export default function Home() {
  return (
    <div>
      <section className="bg-brand text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Мужская спортивная одежда для настоящих результатов
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Футболки, спортивные костюмы, шорты и брюки — качество, удобство, стиль.
          </p>
          <Link
            to="/catalog/tshirts"
            className="inline-block bg-brand-accent hover:bg-red-600 transition px-6 py-3 rounded-lg font-semibold"
          >
            Смотреть каталог
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((c) => (
          <Link
            key={c.key}
            to={`/catalog/${c.key}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-8 text-center font-semibold border border-gray-100"
          >
            {c.label}
          </Link>
        ))}
      </section>
    </div>
  );
}
