import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';

const AddReviewModal = ({ restaurantId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setSubmitError('Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      setSubmitError('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulated API call - replace with actual API endpoint
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          restaurantId,
          rating,
          reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Call the onSubmit prop to trigger parent component's notification
      onSubmit({
        rating,
        text: reviewText,
      });

      // Reset form
      setRating(0);
      setReviewText('');
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Add Your Review</h2>

        {/* Star Rating */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              fill={(hoverRating || rating) >= star ? '#FFD700' : '#E0E0E0'}
              color="#FFD700"
              className="cursor-pointer transition-transform transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <p className="text-center mb-4 text-gray-600">
          {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
        </p>

        {/* Review Text Area */}
        <textarea 
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here (minimum 10 characters)"
          className="w-full h-32 p-2 border rounded-md mb-4"
        />

        {/* Error Message */}
        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {submitError}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`
            w-full py-2 rounded-md text-white font-semibold 
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
            }
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default AddReviewModal;