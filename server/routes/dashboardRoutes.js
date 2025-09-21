const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Category = require('../models/Category');

// Dashboard Metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Recent Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ date: -1 })
      .limit(5)
      .select('orderId customerName amount date status');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sales Data (for Line Chart)
router.get('/sales', async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = sales.map((s) => s._id); // e.g., ['2025-01', '2025-02']
    const values = sales.map((s) => s.total); // e.g., [1200, 1900]

    res.json({ labels, values });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Category Data (for Pie Chart)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const labels = categories.map((c) => c._id); // e.g., ['Toys', 'Protection', 'Beauty']
    const values = categories.map((c) => c.count); // e.g., [50, 30, 20]

    res.json({ labels, values });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;