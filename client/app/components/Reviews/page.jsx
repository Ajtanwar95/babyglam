import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Send, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchReviews, createReview, updateReview, deleteReview } from '@/app/redux/slices/reviewSlice';
import { useParams } from 'next/navigation';

const Reviews = () => {
  const dispatch = useDispatch();
  const { items: reviews, status, error } = useSelector((state) => state.reviews);
  const { id } = useParams();
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
    setNewReview({ ...newReview, file });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleReviewSubmit = async () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast.error('Please provide a rating and comment', { style: { background: '#EF4444', color: '#fff' } });
      return;
    }
    if (editingReview) {
      await dispatch(updateReview(newReview));
      setEditingReview(null);
      setPreviewUrl(null);
      toast.success('Review updated!', { style: { background: '#10B981', color: '#fff' } });
    } else {
      await dispatch(createReview(newReview));
      setPreviewUrl(null);
      toast.success('Review submitted!', { style: { background: '#10B981', color: '#fff' } });
    }
    setNewReview({ productId: id, rating: 0, comment: '', name: '', email: '', file: null });
  };

  const handleDeleteReview = async (id) => {
    await dispatch(deleteReview(id));
    toast.info('Review deleted!', { style: { background: '#3B82F6', color: '#fff' } });
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  if (status === 'loading') return <p className="text-center text-gray-500 animate-pulse">Loading reviews...</p>;
  if (status === 'failed') return <p className="text-center text-red-500 animate-bounce">Error: {error}</p>;

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-cursive text-gray-800 dark:text-gray-100 mb-8 border-b-4 border-[#9bced3]  dark:border-indigo-700 pb-4 animate-fade-in">
        Customer Reviews
      </h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center animate-pulse">No reviews yet. Be the first to shine!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card
              key={review._id}
              className="p-6 bg-gradient-to-br from-white/80 to-gray-100 dark:from-gray-800/80 dark:to-gray-900 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-slide-up"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`transition-transform ${i < review.rating ? 'text-yellow-400 fill-current scale-110' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse-once">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditReview(review)}
                    className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-transform"
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              <p className="text-gray-800 dark:text-gray-200 mb-4 text-lg leading-relaxed animate-fade-in-delay">
                {review.comment}
              </p>
              {review.name && (
                <p className="text-md text-gray-600 dark:text-gray-400 font-semibold animate-slide-right">
                  By: {review.name}
                </p>
              )}
              {review.email && (
                <p className="text-md text-gray-600 dark:text-gray-400 animate-slide-right delay-100">
                  Email: {review.email}
                </p>
              )}
              {review.file && (
                <div className="mt-4">
                  <img
                    src={review.file}
                    alt="Review attachment"
                    className="w-32 h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-zoom-in"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <Card className="mt-12 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900/80 dark:to-gray-800 rounded-2xl shadow-2xl animate-slide-up-delay">
        <CardHeader>
          <CardTitle className="text-2xl font-cursive text-[#1baebc] dark:text-indigo-200 animate-pulse-once">
            Share Your Thoughts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 justify-center sm:justify-start animate-bounce-in">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={28}
                className={`cursor-pointer transition-all duration-300 ${i < newReview.rating ? 'text-yellow-500 fill-current scale-110' : 'text-gray-300 hover:text-yellow-300'}`}
                onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
              />
            ))}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Share your experience..."
            className="w-full h-32 p-4 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-400 transition-all duration-300 placeholder-gray-400 animate-grow"
          />
          <input
            type="text"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            placeholder="Your name (optional)"
            className="w-full p-3 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-400 transition-all duration-300 placeholder-gray-400 animate-fade-in"
          />
          <input
            type="email"
            value={newReview.email}
            onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
            placeholder="Your email (optional)"
            className="w-full p-3 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-400 transition-all duration-300 placeholder-gray-400 animate-fade-in delay-100"
          />
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border-2 border-indigo-200 bg-[#9bced3] rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-4 focus:ring-indigo-400 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#9bced3] file:text-white hover:file:bg-indigo-700 animate-fade-in delay-200"
            />
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-zoom-in"
                />
              </div>
            )}
          </div>
          <Button
            onClick={handleReviewSubmit}
            className="w-full sm:w-auto bg-[#9bced3] hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 p-3 text-lg flex items-center justify-center animate-pulse-once"
          >
            <Send size={20} className="mr-2" /> {editingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Reviews;