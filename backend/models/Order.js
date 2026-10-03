const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: String,
    size: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'shipped', 'completed', 'cancelled'],
      default: 'new',
    },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
