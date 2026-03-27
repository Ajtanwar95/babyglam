// server/routes/trackOrder.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .select('orderId status total createdAt address items'); // Explicitly select needed fields

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Enhanced response with full item details (including media/images)
    const response = {
      orderId: order.orderId,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      address: {
        name: order.address.name,
        line1: order.address.line1,
        city: order.address.city,
        state: order.address.state,
        zip: order.address.zip,
        country: order.address.country,
        phone: order.address.phone,
        email: order.address.email,
      },
      items: order.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        media: item.media || [],           // ← Added: Product images
        _id: item._id
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;