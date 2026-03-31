const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true } // Price at time of order
});

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dealer: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
