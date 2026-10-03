const express = require('express');
const StockRequest = require('../models/StockRequest');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Заявка на товар не в наличии — доступна и гостю, и авторизованному
router.post('/', async (req, res) => {
  try {
    const { name, phone, category, desiredSize, product, comment } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'Укажите имя и телефон' });
    const request = await StockRequest.create({
      name,
      phone,
      category,
      desiredSize,
      product: product || undefined,
      comment,
      user: req.user ? req.user.id : undefined,
    });
    res.status(201).json(request);
  } catch (e) {
    res.status(500).json({ message: 'Ошибка создания заявки', error: e.message });
  }
});

// --- Админ ---
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const list = await StockRequest.find().sort({ createdAt: -1 }).populate('product', 'title');
  res.json(list);
});

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const item = await StockRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(item);
});

module.exports = router;
