const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // Add orderId with unique constraint
  paymentId: { type: String, required: true },
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      stock: { type: Number, required: true },
      media: [{ type: String }]
    },
  ],
  total: { type: Number, required: true },
  address: {
    name: String,
    email: String,
    phone: String,
    line1: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  paymentId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);