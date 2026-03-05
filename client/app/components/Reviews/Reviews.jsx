'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, Send, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchReviews, createReview, updateReview, deleteReview } from '@/app/redux/slices/reviewSlice';

const Reviews = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { items: reviews, status, error, totalReviews, averageRating } = useSelector((state) => state.reviews);

  const [newReview, setNewReview] = useState({
    productId: id,
    rating: 0,
    comment: '',
    name: '',
    email: '',
    file: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  useEffect(() => {
    if (id) dispatch(fetchReviews(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (editingReview) {
      setNewReview({ ...editingReview, productId: id });
      setPreviewUrl(editingReview.file || null);
    }
  }, [editingReview, id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReview({ ...newReview, file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleReviewSubmit = async () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast.error('Rating & comment are required');
      return;
    }
    if (editingReview) {
      await dispatch(updateReview(newReview));
      setEditingReview(null);
      toast.success('Review updated!');
    } else {
      await dispatch(createReview(newReview));
      toast.success('Thank you for your review!');
    }
    setNewReview({ productId: id, rating: 0, comment: '', name: '', email: '', file: null });
    setPreviewUrl(null);
  };

  const handleDelete = async (reviewId) => {
    await dispatch(deleteReview(reviewId));
    toast.info('Review deleted');
  };

  const handleHelpful = (reviewId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    toast.success('Thanks for your feedback!');
  };

  const renderStars = (rating, size = 20, interactive = false, onClick = null) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = i === Math.floor(rating) && rating % 1 >= 0.5;

          return (
            <Star
              key={i}
              size={size}
              className={`
                ${filled || half ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
              `}
              fill={filled ? 'currentColor' : half ? 'url(#halfStar)' : 'none'}
              onClick={interactive ? () => onClick?.(i + 1) : undefined}
            />
          );
        })}
        {/* Half-star gradient */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  if (status === 'loading') return <div className="text-center py-12 animate-pulse">Loading reviews...</div>;
  if (status === 'failed') return <div className="text-center text-red-600 py-12">Error: {error}</div>;

  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({
    stars: r,
    count: reviews.filter((rev) => Math.round(rev.rating) === r).length,
  }));

  const maxCount = Math.max(...ratingDistribution.map((d) => d.count), 1);

  return (
    <section className="py-12 lg:py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Overall Rating Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Average Rating */}
          <div className="text-center lg:text-left">
            <div className="text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white">
              {averageRating?.toFixed(1) || '0.0'}
            </div>
            <div className="flex justify-center lg:justify-start mt-2">
              {renderStars(averageRating || 0, 28)}
            </div>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Based on {totalReviews || reviews.length} reviews
            </p>
          </div>

          {/* Middle: Rating Bars */}
          <div className="space-y-3">
            {ratingDistribution.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="w-8 text-right font-medium">{stars} ★</span>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-1000"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-sm text-gray-500 dark:text-gray-400">{count}</span>
              </div>
            ))}
          </div>

          {/* Right: Write Review Button */}
          <div className="flex items-center justify-center lg:justify-end">
            <Button
              onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#9bced3] hover:bg-[#8ab8c0] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-xl">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((review) => (
              <Card
                key={review._id}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Reviewer Info + Stars */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-[#9bced3]/20 flex items-center justify-center text-[#9bced3] font-bold text-xl">
                        {review.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {review.name || 'Anonymous'}
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">
                          Verified Buyer
                        </span>
                      </div>
                      <div className="flex mt-1">{renderStars(review.rating, 18)}</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Helpful + Actions */}
                  <div className="flex items-center gap-6 sm:gap-4">
                    <button
                      onClick={() => handleHelpful(review._id)}
                      className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#9bced3] transition"
                    >
                      <ThumbsUp size={18} />
                      <span>{helpfulVotes[review._id] || review.helpful || 0}</span>
                    </button>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingReview(review)}>
                        <Edit2 size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(review._id)}>
                        <Trash2 size={18} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="mt-5 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {review.comment}
                </p>

                {/* Review Image */}
                {review.file && (
                  <div className="mt-6">
                    <img
                      src={review.file}
                      alt="Review photo"
                      width={120}
                      height={120}
                      className="rounded-lg shadow-md object-cover hover:shadow-xl transition-shadow"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Write Review Form */}
        <Card id="review-form" className="mt-12 lg:mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {editingReview ? 'Edit Your Review' : 'Write a Review'}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Share your honest experience with other customers
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Rating
              </label>
              <div className="flex gap-1">
                {renderStars(newReview.rating, 32, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="What did you like or dislike?..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#9bced3] focus:border-[#9bced3] transition"
              />
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#9bced3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={newReview.email}
                  onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#9bced3]"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Add Photo (optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 transition">
                  <span>Choose File</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
                {previewUrl && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleReviewSubmit}
              className="w-full sm:w-auto bg-[#9bced3] hover:bg-[#8ab8c0] text-white font-semibold py-6 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
            >
              <Send size={20} />
              {editingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default Reviews;