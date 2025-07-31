import React, { useState, useEffect } from 'react';
import { Star, Reply, Flag, User, ThumbsUp, Filter } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';
import { reviewsAPI } from '../../services/api';
import Loading from '../../components/common/Loading';
import { useToast } from '../../context/ToastContext';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getHotelerReviews();
      setReviews(response.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showToast('Failed to load reviews', 'error');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [ratingFilter, setRatingFilter] = useState('all');

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleReply = async (reviewId) => {
    if (replyText.trim()) {
      try {
        await reviewsAPI.reply(reviewId, { reply: replyText });
        setReviews(reviews.map(review =>
          review.id === reviewId
            ? { ...review, replied: true, reply: replyText }
            : review
        ));
        setReplyText('');
        setReplyingTo(null);
        showToast('Reply sent successfully', 'success');
      } catch (error) {
        console.error('Error sending reply:', error);
        showToast('Failed to send reply', 'error');
      }
    }
  };

  const handleFlag = (reviewId) => {
    if (window.confirm('Are you sure you want to flag this review as inappropriate?')) {
      alert('Review has been flagged for moderation.');
    }
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const filteredReviews = ratingFilter === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(ratingFilter));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
          <p className="text-gray-600">Manage and respond to guest reviews</p>
        </div>
        
        {/* Rating Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mb-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-gray-600">Based on {reviews.length} reviews</div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center space-x-2">
                <span className="text-sm font-medium w-6">{item.rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: '#97B067'
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reviews</span>
              <span className="font-medium">{reviews.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Replied</span>
              <span className="font-medium">{reviews.filter(r => r.replied).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Reply</span>
              <span className="font-medium text-orange-600">{reviews.filter(r => !r.replied).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">5-Star Reviews</span>
              <span className="font-medium text-green-600">{reviews.filter(r => r.rating === 5).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {ratingFilter === 'all' ? 'No reviews yet' : `No ${ratingFilter}-star reviews`}
          </h3>
          <p className="text-gray-600">
            {ratingFilter === 'all' 
              ? 'Reviews from guests will appear here once they start sharing their experiences.'
              : `No reviews with ${ratingFilter} stars found.`
            }
          </p>
        </div>
      )}

      {/* Reviews List */}
      {filteredReviews.length > 0 && (
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{review.user?.fullName || review.guestName || 'Anonymous'}</h4>
                    {(review.verified || review.user?.verified) && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{review.room?.roomType || review.roomType || 'N/A'}</p>
                  <p className="text-xs text-gray-400">{review.user?.email || review.guestEmail || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt || review.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">{review.helpful} helpful</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setReplyingTo(review.id)}
                  variant="outline"
                  size="sm"
                  disabled={review.replied}
                  style={review.replied ? {} : { borderColor: '#437057', color: '#437057' }}
                  className={review.replied ? '' : 'hover:bg-green-50'}
                >
                  <Reply className="h-4 w-4 mr-1" />
                  {review.replied ? 'Replied' : 'Reply'}
                </Button>
                <Button
                  onClick={() => handleFlag(review.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Flag
                </Button>
              </div>
            </div>

            {/* Reply */}
            {review.replied && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: '#437057' }}>
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#437057' }}>
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">Hotel Manager</span>
                  <span className="ml-2 text-xs text-gray-500">Official Response</span>
                </div>
                <p className="text-sm text-gray-700">{review.reply}</p>
              </div>
            )}

            {/* Reply Form */}
            {replyingTo === review.id && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your professional response to this review..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <Button
                    onClick={() => setReplyingTo(null)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleReply(review.id)}
                    size="sm"
                    style={{ backgroundColor: '#437057' }}
                    className="hover:opacity-90"
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default Reviews;