const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

// Create a 2dsphere index for geolocation queries
dealerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Dealer', dealerSchema);
