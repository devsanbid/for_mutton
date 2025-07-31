import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Wifi, Car, Coffee, Users,
  Phone, Mail, ArrowLeft, Heart, ChevronLeft, ChevronRight
} from 'lucide-react';
import { hotelsAPI } from '../../services/api';
import BookingForm from './BookingForm';
import { getImageUrl } from '../../utils/imageUtils';

const HotelDetailsComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching hotel details for ID:', id);
        const response = await hotelsAPI.getById(id);
        console.log('Hotel details response:', response);
        setHotel(response.hotel);
        setError(null);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError(err.message || 'Failed to load hotel details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#437057] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hotel details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error loading hotel details</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#437057] text-white px-4 py-2 rounded-lg hover:bg-[#2F5249]"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">Hotel not found</div>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#437057] text-white px-4 py-2 rounded-lg hover:bg-[#2F5249]"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate minimum price from rooms
  const minPrice = hotel.rooms && hotel.rooms.length > 0 
    ? Math.min(...hotel.rooms.map(room => parseFloat(room.price)))
    : 0;

  // Get total reviews count
  const totalReviews = hotel.reviews ? hotel.reviews.length : 0;

  // Calculate average rating from reviews
  const averageRating = hotel.reviews && hotel.reviews.length > 0
    ? (hotel.reviews.reduce((sum, review) => sum + review.rating, 0) / hotel.reviews.length).toFixed(1)
    : hotel.rating || 0;

  const handleBookNow = () => {
    if (selectedRoom) {
      navigate(`/users/book/${selectedRoom._id || selectedRoom.id}`);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi size={20} />;
      case 'parking': return <Car size={20} />;
      case 'restaurant': return <Coffee size={20} />;
      case 'gym': return <Users size={20} />;
      default: return <div className="w-5 h-5 bg-[#97B067] rounded-full"></div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button + Favorite */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#437057] hover:text-[#2F5249]"
        >
          <ArrowLeft size={20} />
          <span>Back to Hotels</span>
        </button>
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className={`p-2 rounded-full ${isFavorited ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
        >
          <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{hotel.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{averageRating}</span>
                  <span className="ml-1">({totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-[#2F5249]">
                NPR {minPrice > 0 ? minPrice.toLocaleString() : 'N/A'}
              </div>
              <div className="text-gray-600">per night (starting from)</div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200">
            <img
              src={hotel.images && hotel.images.length > 0 ? getImageUrl(hotel.images[selectedImageIndex]) : '/placeholder-hotel.jpg'}
              alt={hotel.name}
              className="w-full h-80 md:h-96 object-cover"
            />
          </div>
          {hotel.images && hotel.images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {hotel.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex ? 'border-white' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={getImageUrl(image)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              </div>
            </div>
          )}
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Hotel</h2>
            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-[#437057]">{getAmenityIcon(amenity)}</div>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Room Types */}
          {hotel.rooms && hotel.rooms.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.rooms.map((room, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedRoom(room)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRoom?._id === room._id 
                        ? 'border-[#437057] bg-[#437057]/10 ring-2 ring-[#437057]/30 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-[#437057] hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                          selectedRoom?._id === room._id 
                            ? 'border-[#437057] bg-[#437057] shadow-md' 
                            : 'border-gray-300 hover:border-[#437057]'
                        }`}>
                          {selectedRoom?._id === room._id && (
                            <div className="w-full h-full rounded-full bg-white scale-50 flex items-center justify-center">
                              <div className="w-2 h-2 bg-[#437057] rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{room.type || room.roomType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#2F5249]">NPR {room.price.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Up to {room.capacity || 'N/A'} guests</span>
                      {room.description && (
                        <>
                          <span>•</span>
                          <span>{room.description}</span>
                        </>
                      )}
                    </div>
                    {selectedRoom?._id === room._id && (
                      <div className="mt-3 p-2 bg-[#437057] text-white rounded-md text-sm font-medium text-center">
                        ✓ Selected for Booking
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies */}
          {hotel.policies && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Policies</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.policies.checkIn && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Check-in</h3>
                      <p className="text-gray-700">{hotel.policies.checkIn}</p>
                    </div>
                  )}
                  {hotel.policies.checkOut && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Check-out</h3>
                      <p className="text-gray-700">{hotel.policies.checkOut}</p>
                    </div>
                  )}
                </div>
                {hotel.policies.cancellation && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                    <p className="text-gray-700">{hotel.policies.cancellation}</p>
                  </div>
                )}
                {hotel.policies.pets && (
                   <div>
                     <h3 className="font-semibold text-gray-900 mb-2">Pet Policy</h3>
                     <p className="text-gray-700">{hotel.policies.pets}</p>
                   </div>
                 )}
                 {hotel.policies.smoking && (
                   <div>
                     <h3 className="font-semibold text-gray-900 mb-2">Smoking Policy</h3>
                     <p className="text-gray-700">{hotel.policies.smoking}</p>
                   </div>
                 )}
               </div>
             </div>
           )}
           
          {/* Reviews */}
          {hotel.reviews && hotel.reviews.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
              <div className="space-y-6">
                {hotel.reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {review.user?.name ? review.user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h3>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-[#2F5249] mb-2">
                NPR {selectedRoom ? selectedRoom.price.toLocaleString() : (minPrice > 0 ? minPrice.toLocaleString() : 'N/A')}
              </div>
              <div className="text-gray-600">
                {selectedRoom ? 'per night (selected room)' : 'per night (starting from)'}
              </div>
            </div>
            {!selectedRoom && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  Please select a room from the "Available Rooms" section below to proceed with booking.
                </p>
              </div>
            )}
            <button
              onClick={handleBookNow}
              disabled={!selectedRoom}
              className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-colors ${
                selectedRoom 
                  ? 'bg-[#2F5249] text-white hover:bg-[#437057]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedRoom ? 'Book Selected Room' : 'Select a Room to Book'}
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {hotel.contact?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-[#437057]" />
                  <span className="text-gray-700">{hotel.contact.phone}</span>
                </div>
              )}
              {hotel.contact?.email && (
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-[#437057]" />
                  <span className="text-gray-700">{hotel.contact.email}</span>
                </div>
              )}
              {hotel.location && (
                 <div className="flex items-start space-x-3">
                   <MapPin size={16} className="text-[#437057] mt-1" />
                   <span className="text-gray-700">{hotel.location}</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HotelDetailsComponent;
