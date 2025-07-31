import React, { useState, useEffect } from "react";
import { reviewsAPI } from "../../services/api";
import { toast } from "react-hot-toast";

const themeColor = "#2f5249";

// Star Rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "fill-current text-yellow-400" : "text-gray-300"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.92-.755 1.688-1.54 1.118L10 13.347l-3.386 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L3.612 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.97z" />
        </svg>
      ))}
    </div>
  );
};

// Review Card
const ReviewCard = ({ name, rating, comment, date }) => (
  <div className="bg-white shadow border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold text-[#2f5249]">{name}</h3>
      <StarRating rating={rating} />
    </div>
    <p className="text-gray-700 mb-3">{comment}</p>
    <p className="text-sm text-gray-400">
      {new Date(date).toLocaleDateString()}
    </p>
  </div>
);

const HotelReviewPage = ({ hotelId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (hotelId) {
        console.log('🔍 [Reviews] Fetching reviews for hotel:', hotelId);
        const response = await reviewsAPI.getHotelReviews(hotelId);
        console.log('🔍 [Reviews] Received response:', response);
        
        const reviewsData = response.reviews || response.data || [];
        console.log('🔍 [Reviews] Reviews data:', reviewsData);
        
        const formattedReviews = reviewsData.map(review => ({
          id: review.id,
          name: review.user?.name || review.userName || 'Anonymous',
          rating: review.rating,
          comment: review.comment,
          date: review.createdAt || review.date
        }));
        
        setReviews(formattedReviews);
      } else {
        const response = await reviewsAPI.getUserReviews();
        console.log('🔍 [Reviews] User reviews response:', response);
        
        const reviewsData = response.reviews || response.data || [];
        const formattedReviews = reviewsData.map(review => ({
          id: review.id,
          name: review.hotel?.name || 'Hotel',
          rating: review.rating,
          comment: review.comment,
          date: review.createdAt || review.date
        }));
        
        setReviews(formattedReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-10 py-14">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-10" style={{ color: themeColor }}>
            Hotel Reviews
          </h1>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f5249] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 px-10 py-14">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-10" style={{ color: themeColor }}>
            Hotel Reviews
          </h1>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button 
              onClick={fetchReviews}
              className="mt-4 px-6 py-2 bg-[#2f5249] text-white rounded-lg hover:bg-[#1e392f] transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-14">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-4xl font-bold mb-10"
          style={{ color: themeColor }}
        >
          {hotelId ? 'Hotel Reviews' : 'My Reviews'}
        </h1>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {hotelId ? 'No reviews available for this hotel yet.' : 'You haven\'t written any reviews yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelReviewPage;
