const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  name: { type: String, default: null },
  email: { type: String, default: null },
  file: { type: String, default: null }, // Cloudinary URL
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);