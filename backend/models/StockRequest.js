const mongoose = require('mongoose');

const StockRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, default: '' },
    desiredSize: { type: String, default: '' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    comment: { type: String, default: '' },
    status: { type: String, enum: ['open', 'contacted', 'closed'], default: 'open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockRequest', StockRequestSchema);
