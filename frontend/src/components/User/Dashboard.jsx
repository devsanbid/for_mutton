import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import HotelCard from './HotelCard';
import RoomCard from './RoomCard';
import FilterSidebar from './FilterSidebar';
import api from '../../services/api';

const DashboardComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [viewMode, setViewMode] = useState('rooms'); // 'hotels' or 'rooms'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 50000],
    location: '',
    amenities: [],
    rating: 0
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.hotels.getAll();
      console.log('Full API response:', response);
      console.log('Hotels data:', response.hotels);
      console.log('Number of hotels:', response.hotels?.length || 0);
      
      const hotelsData = response.hotels || [];
      if (hotelsData.length > 0) {
        // Extract all rooms from all hotels
        const allRooms = [];
        hotelsData.forEach((hotel, index) => {
          console.log(`Hotel ${index + 1}: ${hotel.name}`);
          console.log('Rooms:', hotel.rooms);
          console.log('Room count:', hotel.rooms?.length || 0);
          
          // Add hotel information to each room
          if (hotel.rooms && hotel.rooms.length > 0) {
            hotel.rooms.forEach(room => {
              console.log('Processing room:', room.name || room.type);
              allRooms.push({
                ...room,
                hotel: {
                  id: hotel.id,
                  name: hotel.name,
                  location: hotel.location,
                  rating: hotel.rating
                }
              });
            });
          }
        });
        
        console.log('All rooms extracted:', allRooms);
        console.log('Total rooms count:', allRooms.length);
        
        setHotels(hotelsData);
        setRooms(allRooms);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !filters.location || 
                             hotel.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesPrice = (!filters.minPrice || hotel.minPrice >= filters.minPrice) &&
                          (!filters.maxPrice || hotel.minPrice <= filters.maxPrice);
      
      const matchesRating = !filters.rating || hotel.rating >= filters.rating;
      
      const matchesAmenities = filters.amenities.length === 0 ||
                              filters.amenities.every(amenity => 
                                hotel.amenities && hotel.amenities.includes(amenity)
                              );
      
      return matchesSearch && matchesLocation && matchesPrice && matchesRating && matchesAmenities;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.minPrice - b.minPrice;
        case 'price-high':
          return b.minPrice - a.minPrice;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [hotels, searchTerm, filters, sortBy]);

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = rooms.filter(room => {
      const matchesSearch = (room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (room.type && room.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (room.hotel && room.hotel.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (room.hotel && room.hotel.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = !filters.location || 
                             (room.hotel && room.hotel.location.toLowerCase().includes(filters.location.toLowerCase()));
      
      const matchesPrice = (!filters.minPrice || room.price >= filters.minPrice) &&
                          (!filters.maxPrice || room.price <= filters.maxPrice);
      
      const matchesRating = !filters.rating || (room.hotel && room.hotel.rating >= filters.rating);
      
      const matchesAmenities = filters.amenities.length === 0 ||
                              filters.amenities.every(amenity => 
                                room.amenities && room.amenities.includes(amenity)
                              );
      
      return matchesSearch && matchesLocation && matchesPrice && matchesRating && matchesAmenities;
    });

    // Sort rooms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.hotel?.rating || 0) - (a.hotel?.rating || 0);
        case 'name':
          return (a.name || a.type).localeCompare(b.name || b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [rooms, searchTerm, filters, sortBy]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2F5249] to-[#437057] text-white rounded-2xl p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Nepal's Finest Hotels
          </h1>
          <p className="text-lg opacity-90 mb-6">
            From the bustling streets of Kathmandu to the serene lakes of Pokhara, 
            find your perfect stay in the heart of the Himalayas.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search hotels, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-[#97B067] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center space-x-2 bg-[#2F5249] text-white px-4 py-2 rounded-lg hover:bg-[#437057] transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

          {/* View Toggle and Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('hotels')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'hotels'
                      ? 'bg-[#437057] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hotels
                </button>
                <button
                  onClick={() => setViewMode('rooms')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    viewMode === 'rooms'
                      ? 'bg-[#437057] text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rooms
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Loading...' : 
                  viewMode === 'hotels' 
                    ? `${filteredAndSortedHotels.length} Hotels Found`
                    : `${filteredAndSortedRooms.length} Rooms Found`
                }
              </h2>
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#437057] mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading hotels...</h3>
              <p className="text-gray-600">Please wait while we fetch the latest hotel listings</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Hotels</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={fetchHotels}
                className="bg-[#437057] text-white px-6 py-2 rounded-lg hover:bg-[#2F5249] transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Hotels/Rooms Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {viewMode === 'hotels' 
                ? filteredAndSortedHotels.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))
                : filteredAndSortedRooms.map(room => (
                    <RoomCard key={`${room.hotel.id}-${room.id}`} room={room} />
                  ))
              }
            </div>
          )}

          {/* No Results */}
          {!loading && !error && (
            (viewMode === 'hotels' && filteredAndSortedHotels.length === 0) ||
            (viewMode === 'rooms' && filteredAndSortedRooms.length === 0)
          ) && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {viewMode} found
              </h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
