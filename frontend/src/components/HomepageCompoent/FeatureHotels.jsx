import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';

const FeaturedHotels = () => {
  const featuredHotels = [
    {
      id: 1,
      name: "Himalayan Grand Hotel",
      location: "Kathmandu",
      price: "$120",
      rating: 4.8,
      image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1",
      amenities: ["Wifi", "Parking", "Restaurant", "Gym"]
    },
    {
      id: 2,
      name: "Everest View Resort",
      location: "Pokhara",
      price: "$85",
      rating: 4.6,
      image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1",
      amenities: ["Mountain View", "Spa", "Restaurant", "Wifi"]
    },
    {
      id: 3,
      name: "Annapurna Boutique Hotel",
      location: "Chitwan",
      price: "$95",
      rating: 4.7,
      image: "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&dpr=1",
      amenities: ["Safari", "Pool", "Restaurant", "Wifi"]
    }
  ];

  return (
    <section id="hotels" className="py-20 bg-[#97B067]/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F5249] mb-4">Featured Hotels</h2>
          <p className="text-xl text-[#437057]">Discover our handpicked luxury accommodations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-[#E3DE61] fill-current" />
                    <span className="text-sm font-semibold text-[#2F5249]">{hotel.rating}</span>
                  </div>
                </div>
                <button className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-[#437057] hover:text-red-500" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#2F5249] mb-2">{hotel.name}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-4 w-4 text-[#437057]" />
                  <span className="text-[#437057]">{hotel.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity, index) => (
                    <span key={index} className="px-3 py-1 bg-[#97B067]/20 text-[#2F5249] rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#437057]">{hotel.price}</span>
                    <span className="text-[#2F5249]">/night</span>
                  </div>
                  <button className="bg-[#437057] text-white px-6 py-2 rounded-lg hover:bg-[#2F5249] transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedHotels;