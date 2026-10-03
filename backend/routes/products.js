const express = require('express');
const Product = require('../models/Product');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { upload, extractUrl } = require('../middleware/upload');

const router = express.Router();

// Публичный список товаров с фильтром по категории
router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

// Админ: список всех товаров (включая неактивные)
router.get('/admin/all', requireAuth, requireAdmin, async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Товар не найден' });
  res.json(product);
});

// --- Админ: создание/редактирование/удаление ---
router.post('/', requireAuth, requireAdmin, upload.array('images', 6), async (req, res) => {
  try {
    const { title, description, category, price, sizes } = req.body;
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    const images = (req.files || []).map(extractUrl);
    const product = await Product.create({
      title,
      description,
      category,
      price,
      sizes: parsedSizes || [],
      images,
    });
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: 'Ошибка создания товара', error: e.message });
  }
});

router.put('/:id', requireAuth, requireAdmin, upload.array('images', 6), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Товар не найден' });

    const { title, description, category, price, sizes, isActive } = req.body;
    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
    if (sizes !== undefined) {
      product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    }
    if (req.files && req.files.length) {
      const images = req.files.map(extractUrl);
      product.images = [...product.images, ...images];
    }
    await product.save();
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: 'Ошибка обновления товара', error: e.message });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Товар удалён' });
});

module.exports = router;
