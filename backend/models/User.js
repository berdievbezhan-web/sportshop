const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    address: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
