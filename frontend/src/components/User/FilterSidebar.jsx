import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const locations = ['Kathmandu', 'Pokhara', 'Chitwan', 'Lumbini', 'Bhaktapur', 'Patan'];
  const amenities = ['WiFi', 'Parking', 'Restaurant', 'Gym', 'Pool', 'Spa', 'Bar', 'Room Service'];

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], value]
    }));
  };

  const handleLocationChange = (location) => {
    setLocalFilters(prev => ({
      ...prev,
      location: prev.location === location ? '' : location
    }));
  };

  const handleAmenityChange = (amenity) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRatingChange = (rating) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceRange: [0, 50000],
      location: '',
      amenities: [],
      rating: 0
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2F5249] flex items-center">
              <Filter className="mr-2" size={20} />
              Filters
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-screen">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={localFilters.priceRange[1]}
                onChange={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>NPR 0</span>
                <span>NPR {localFilters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="space-y-2">
              {locations.map(location => (
                <label key={location} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    checked={localFilters.location === location}
                    onChange={() => handleLocationChange(location)}
                    className="text-[#437057] focus:ring-[#437057]"
                  />
                  <span className="text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div className="space-y-2">
              {amenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="text-[#437057] focus:ring-[#437057] rounded"
                  />
                  <span className="text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Minimum Rating</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors ${
                    localFilters.rating === rating
                      ? 'bg-[#437057] text-white border-[#437057]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#437057]'
                  }`}
                >
                  {rating}+ Stars
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button
              onClick={applyFilters}
              className="w-full bg-[#2F5249] text-white py-3 px-4 rounded-lg hover:bg-[#437057] transition-colors font-medium"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
