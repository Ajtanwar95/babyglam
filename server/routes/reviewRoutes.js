const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const multer = require('multer');
const cloudinary = require('../lib/cloudinary');
const { body, validationResult } = require('express-validator');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Get Reviews by Product ID
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews: ' + error.message });
  }
});

// Create Review
router.post(
  '/:productId',
  upload.single('file'),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Invalid email format'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let fileUrl = null;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'reviews', format: 'webp', access_mode: 'public' },
            (error, result) => (error ? reject(error) : resolve(result))
          ).end(req.file.buffer);
        });
        fileUrl = result.secure_url;
      }

      const review = new Review({
        productId: req.params.productId,
        rating: req.body.rating,
        comment: req.body.comment,
        name: req.body.name || null,
        email: req.body.email || null,
        file: fileUrl || null,
      });

      await review.save();
      res.status(201).json({ message: 'Review created', review });
    } catch (error) {
      console.error('Review creation error:', error);
      res.status(500).json({ error: 'Failed to create review: ' + error.message });
    }
  }
);

// Update Review
router.patch(
  '/:id',
  upload.single('file'),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required'),
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Invalid email format'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });

      let fileUrl = review.file;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'reviews', format: 'webp', access_mode: 'public' },
            (error, result) => (error ? reject(error) : resolve(result))
          ).end(req.file.buffer);
        });
        fileUrl = result.secure_url;
      }

      review.rating = req.body.rating || review.rating;
      review.comment = req.body.comment || review.comment;
      review.name = req.body.name || review.name;
      review.email = req.body.email || review.email;
      review.file = fileUrl;

      await review.save();
      res.json({ message: 'Review updated', review });
    } catch (error) {
      console.error('Review update error:', error);
      res.status(500).json({ error: 'Failed to update review: ' + error.message });
    }
  }
);

// Delete Review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.file) {
      const publicId = review.file.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`reviews/${publicId}`);
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Review delete error:', error);
    res.status(500).json({ error: 'Failed to delete review: ' + error.message });
  }
});

module.exports = router;