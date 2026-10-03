const mongoose = require('mongoose');

const SizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['tshirts', 'tracksuits', 'shorts', 'pants'],
    },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    sizes: [SizeStockSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.virtual('totalStock').get(function () {
  return this.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
});
ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
