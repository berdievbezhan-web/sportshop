const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const mongoose = require('mongoose');

require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  await connectDB();
  const phone = process.env.ADMIN_PHONE;
  const password = process.env.ADMIN_PASSWORD;
  if (!phone || !password) {
    console.error('Задайте ADMIN_PHONE и ADMIN_PASSWORD в .env');
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { phone },
    { phone, name: 'Администратор', passwordHash, role: 'admin' },
    { upsert: true, new: true }
  );
  console.log('Администратор готов:', user.phone);
  process.exit(0);
})();
