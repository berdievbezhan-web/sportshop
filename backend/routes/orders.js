const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Покупатель оформляет заказ (нужна регистрация/вход)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { items, address, comment } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Корзина пуста' });

    let total = 0;
    const orderItems = [];
    for (const it of items) {
      const product = await Product.findById(it.productId);
      if (!product) continue;
      const sizeEntry = product.sizes.find((s) => s.size === it.size);
      if (!sizeEntry || sizeEntry.stock < it.quantity) {
        return res.status(400).json({ message: `Недостаточно товара "${product.title}" размера ${it.size}` });
      }
      sizeEntry.stock -= it.quantity;
      await product.save();

      total += product.price * it.quantity;
      orderItems.push({
        product: product._id,
        title: product.title,
        size: it.size,
        price: product.price,
        quantity: it.quantity,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      phone: req.user.phone,
      address,
      items: orderItems,
      total,
      comment: comment || '',
    });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка оформления заказа', error: e.message });
  }
});

// Свои заказы
router.get('/my', requireAuth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
});

// --- Админ ---
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name phone');
  res.json(orders);
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Заказ не найден' });
  res.json(order);
});

module.exports = router;
