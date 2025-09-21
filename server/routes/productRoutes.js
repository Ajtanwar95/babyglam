const express = require('express');
const router = express.Router();
const cloudinary = require('../lib/cloudinary');
const Product = require('../models/Product');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit per file

// Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Add Product
router.post(
  '/add',
  upload.array('media', 5),
  [
    body('title').notEmpty().withMessage('Product title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('costPerItem').isFloat({ min: 0 }).withMessage('Cost per item must be a positive number'),
    body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'At least one media file is required' });
      }

      const uploadPromises = req.files.map((file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'babyglam',
              format: file.mimetype.startsWith('video') ? 'mp4' : 'webp',
              overwrite: true,
              use_filename: true,
              unique_filename: true,
              access_mode: 'public',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          ).end(file.buffer);
        })
      );

      const mediaUrls = await Promise.all(uploadPromises);
      const price = parseFloat(req.body.price);
      const costPerItem = parseFloat(req.body.costPerItem);
      const profit = price - costPerItem;
      const margin = price > 0 ? (profit / price) * 100 : 0;

      const product = new Product({
        title: req.body.title,
        description: req.body.description,
        media: mediaUrls,
        category: req.body.category,
        price,
        costPerItem,
        margin,
        profit,
        weight: parseFloat(req.body.weight),
        stock: parseInt(req.body.stock),
      });

      await product.save();
      res.json({ message: 'Product added', product });
    } catch (error) {
      console.error('Product add error:', error);
      res.status(500).json({ error: 'Failed to add product: ' + error.message });
    }
  }
);

// Update Product
router.patch(
  '/:id',
  upload.array('media', 5),
  [
    body('title').notEmpty().withMessage('Product title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('costPerItem').isFloat({ min: 0 }).withMessage('Cost per item must be a positive number'),
    body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      let mediaUrls = product.media; // Keep existing media if no new files
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              {
                folder: 'babyglam',
                format: file.mimetype.startsWith('video') ? 'mp4' : 'webp',
                overwrite: true,
                use_filename: true,
                unique_filename: true,
                access_mode: 'public',
              },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            ).end(file.buffer);
          })
        );
        mediaUrls = await Promise.all(uploadPromises);
      }

      const price = parseFloat(req.body.price);
      const costPerItem = parseFloat(req.body.costPerItem);
      const profit = price - costPerItem;
      const margin = price > 0 ? (profit / price) * 100 : 0;

      product.title = req.body.title;
      product.description = req.body.description;
      product.media = mediaUrls;
      product.category = req.body.category;
      product.price = price;
      product.costPerItem = costPerItem;
      product.margin = margin;
      product.profit = profit;
      product.weight = parseFloat(req.body.weight);
      product.stock = parseInt(req.body.stock);

      await product.save();
      res.json({ message: 'Product updated', product });
    } catch (error) {
      console.error('Product update error:', error);
      res.status(500).json({ error: 'Failed to update product: ' + error.message });
    }
  }
);

// Delete Product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Optionally delete media from Cloudinary
    await Promise.all(
      product.media.map((url) => {
        const publicId = url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`babyglam/${publicId}`);
      })
    );
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Product delete error:', error);
    res.status(500).json({ error: 'Failed to delete product: ' + error.message });
  }
});

module.exports = router;