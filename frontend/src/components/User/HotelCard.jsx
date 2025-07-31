import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Car, Coffee, Users } from 'lucide-react';
import { getHotelImageUrl } from '../../utils/imageUtils';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/users/hotel/${hotel.id}`);
  };

  const handleBookNow = () => {
    navigate(`/users/book/${hotel.id}`);
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi size={16} />;
      case 'parking':
        return <Car size={16} />;
      case 'restaurant':
        return <Coffee size={16} />;
      case 'gym':
        return <Users size={16} />;
      default:
        return <div className="w-4 h-4 bg-[#97B067] rounded-full"></div>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={getHotelImageUrl(hotel)} 
          alt={hotel.name}
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{hotel.rating}</span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">{hotel.name}</h3>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1 flex-shrink-0" />
          <span className="text-sm">{hotel.location}</span>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            {hotel.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center text-[#437057]">
                {getAmenityIcon(amenity)}
              </div>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{hotel.amenities.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-[#2F5249]">
              NPR {(hotel.minPrice || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
          <div className="text-sm text-gray-500">
            {hotel.totalReviews || 0} reviews
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleViewDetails}
            className="flex-1 bg-white border-2 border-[#437057] text-[#437057] px-4 py-2 rounded-lg hover:bg-[#437057] hover:text-white transition-colors font-medium"
          >
            View Details
          </button>
          <button 
            onClick={handleBookNow}
            className="flex-1 bg-[#2F5249] text-white px-4 py-2 rounded-lg hover:bg-[#437057] transition-colors font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
