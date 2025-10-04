const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// Routes
app.use('/api/v2', userRoutes);
app.use('/api/v2/dashboard', dashboardRoutes);
app.use('/api/v2/products', productRoutes);
app.use('/api/v2/reviews', reviewRoutes);
app.use('/api/v2/payments', paymentRoutes);
app.use('/api/v2/orders', orderRoutes);
app.get('/', (req, res) => res.send('API is running'));

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.log(err));