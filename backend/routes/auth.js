const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function sign(user) {
  return jwt.sign(
    { id: user._id, role: user.role, phone: user.phone, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Регистрация покупателя по номеру телефона
router.post('/register', async (req, res) => {
  try {
    const { phone, name, password, address } = req.body;
    if (!phone || !name || !password) {
      return res.status(400).json({ message: 'Заполните телефон, имя и пароль' });
    }
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: 'Этот номер уже зарегистрирован' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ phone, name, passwordHash, address: address || '' });
    const token = sign(user);
    res.status(201).json({
      token,
      user: { id: user._id, phone: user.phone, name: user.name, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера', error: e.message });
  }
});

// Вход (для покупателей и админа — единая точка входа)
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ message: 'Неверный телефон или пароль' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Неверный телефон или пароль' });
    const token = sign(user);
    res.json({
      token,
      user: { id: user._id, phone: user.phone, name: user.name, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: 'Ошибка сервера', error: e.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

module.exports = router;
