import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import HotelCard from '../../../components/User/HotelCard';

const HotelListOnlyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const hotels = [
    {
      id: 1,
      name: "Himalayan Retreat",
      location: "Pokhara",
      price: 120,
      rating: 4.5,
      featured: true,
      image: "/images/himalayan-retreat.jpg",
      amenities: ["wifi", "parking", "breakfast"],
    },
    {
      id: 2,
      name: "Kathmandu Inn",
      location: "Kathmandu",
      price: 90,
      rating: 4.2,
      featured: false,
      image: "/images/kathmandu-inn.jpg",
      amenities: ["wifi", "parking"],
    },
    {
      id: 3,
      name: "Lumbini Garden Hotel",
      location: "Lumbini",
      price: 75,
      rating: 4.0,
      featured: true,
      image: "/images/lumbini-garden.jpg",
      amenities: ["wifi", "breakfast"],
    },
    {
      id: 4,
      name: "Everest Base Camp Lodge",
      location: "Lukla",
      price: 150,
      rating: 4.8,
      featured: false,
      image: "/images/everest-lodge.jpg",
      amenities: ["wifi", "parking", "breakfast"],
    },
    {
      id: 5,
      name: "Chitwan Safari Resort",
      location: "Chitwan",
      price: 110,
      rating: 4.3,
      featured: true,
      image: "/images/chitwan-safari.jpg",
      amenities: ["wifi", "parking", "breakfast"],
    }
  ];

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel => {
      return hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    });

    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'featured':
      default:
        return filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [searchTerm, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center my-6">
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search hotels, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#97B067] focus:outline-none"
          />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAndSortedHotels.length > 0 ? (
          filteredAndSortedHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 py-20 text-xl">
            No hotels found.
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelListOnlyComponent;
