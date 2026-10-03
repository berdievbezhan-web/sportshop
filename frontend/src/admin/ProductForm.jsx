import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { resolveImage } from '../api/client';

const CATEGORY_OPTIONS = [
  { value: 'tshirts', label: 'Футболки' },
  { value: 'tracksuits', label: 'Спортивки' },
  { value: 'shorts', label: 'Шорты' },
  { value: 'pants', label: 'Брюки / бриджи' },
];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('tshirts');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState(ALL_SIZES.map((s) => ({ size: s, stock: 0, enabled: false })));
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setTitle(p.title);
      setDescription(p.description);
      setCategory(p.category);
      setPrice(p.price);
      setExistingImages(p.images);
      setSizes(
        ALL_SIZES.map((s) => {
          const found = p.sizes.find((x) => x.size === s);
          return found ? { size: s, stock: found.stock, enabled: true } : { size: s, stock: 0, enabled: false };
        })
      );
    });
  }, [id]);

  const toggleSize = (size) => {
    setSizes((prev) => prev.map((s) => (s.size === size ? { ...s, enabled: !s.enabled } : s)));
  };
  const setStock = (size, stock) => {
    setSizes((prev) => prev.map((s) => (s.size === size ? { ...s, stock: Number(stock) } : s)));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const activeSizes = sizes.filter((s) => s.enabled).map(({ size, stock }) => ({ size, stock }));
      const fd = new FormData();
      fd.append('title', title);
      fd.append('description', description);
      fd.append('category', category);
      fd.append('price', price);
      fd.append('sizes', JSON.stringify(activeSizes));
      files.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await api.put(`/products/${id}`, fd);
      } else {
        await api.post('/products', fd);
      }
      navigate('/admin');
    } catch (e) {
      setError(e.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{isEdit ? 'Редактировать товар' : 'Новый товар'}</h2>
      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm max-w-xl">
        <input placeholder="Название" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
        <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
          {CATEGORY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <input type="number" min="0" placeholder="Цена (сомони)" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border rounded px-3 py-2" />

        <div>
          <p className="font-semibold text-sm mb-2">Размеры и остатки:</p>
          <div className="space-y-2">
            {sizes.map((s) => (
              <div key={s.size} className="flex items-center gap-3">
                <label className="flex items-center gap-2 w-16">
                  <input type="checkbox" checked={s.enabled} onChange={() => toggleSize(s.size)} />
                  {s.size}
                </label>
                <input
                  type="number"
                  min="0"
                  disabled={!s.enabled}
                  value={s.stock}
                  onChange={(e) => setStock(s.size, e.target.value)}
                  placeholder="Остаток"
                  className="border rounded px-2 py-1 w-28 disabled:bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {existingImages.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((img) => (
              <img key={img} src={resolveImage(img)} className="w-16 h-16 object-cover rounded border" />
            ))}
          </div>
        )}

        <div>
          <p className="font-semibold text-sm mb-2">Добавить фото (до 6):</p>
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={saving} className="w-full bg-brand-accent text-white font-semibold py-2.5 rounded-lg hover:opacity-90">
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}
