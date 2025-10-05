const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { items, total, address, paymentId, orderId } = req.body; // Expect orderId from client

    // Transform items to match the schema
    const formattedItems = items.map(item => ({
      _id: item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      stock: item.stock || 0,
    }));

    const order = new Order({
      orderId, // Use the Razorpay orderId
      items: formattedItems,
      total,
      address,
      paymentId,
    });
    await order.save();
    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

module.exports = router;