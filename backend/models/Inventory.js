const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  dealer: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
}, { timestamps: true });

// A dealer should only have one inventory entry per product
inventorySchema.index({ dealer: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
