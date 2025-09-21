const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  media: [{ type: String }], // Array of Cloudinary URLs for images/videos
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  costPerItem: { type: Number, required: true, min: 0 },
  margin: { type: Number, required: true, min: 0 }, // Percentage
  profit: { type: Number, required: true, min: 0 }, // Dollars
  weight: { type: Number, required: true, min: 0 }, // In grams
  stock: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);