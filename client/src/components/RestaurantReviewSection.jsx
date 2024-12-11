import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import styles from './AddReviewModal.module.css'; // Import CSS module

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
      console.log("all of the logic is working so far through review modal");
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
      console.log("restaurant.id: " + response.restaurantId);
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
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <button 
          onClick={onClose} 
          className={styles.closeButton}
        >
          <X size={24} />
        </button>

        <h2 className={styles.title}>Add Your Review</h2>

        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              fill={(hoverRating || rating) >= star ? '#FFD700' : '#E0E0E0'}
              color="#FFD700"
              className={styles.star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <p className={styles.ratingText}>
          {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
        </p>

        <textarea 
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here (minimum 10 characters)"
          className={styles.textArea}
        />

        {submitError && (
          <div className={styles.errorMessage}>
            {submitError}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`${styles.submitButton} ${
            isSubmitting ? styles.submitButtonDisabled : styles.submitButtonEnabled
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

const RestaurantReviewSection = ({ restaurantId }) => {
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleReviewSubmit = (reviewData) => {
    // Show notification
    setNotification({
      type: 'success',
      message: `Thank you for your ${reviewData.rating}-star review!`
    });

    // Automatically hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);

    // Close the modal
    setShowModal(false);
  };

  return (
    <div>
      {/* Add Review Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
      >

        
        <Star className="mr-2" size={20} /> Add Review 
      </button>

      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`
            flex items-center 
            bg-green-500 text-white 
            px-4 py-2 rounded-md 
            shadow-lg transition-all
          `}>
            <CheckCircle className="mr-2" />
            {notification.message}
          </div>
        </div>
      )}

      {showModal && (
        <AddReviewModal
          restaurantId={restaurantId}
          onClose={() => setShowModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      
    </div>
  );
};

export default RestaurantReviewSection;