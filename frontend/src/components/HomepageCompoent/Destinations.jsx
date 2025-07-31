import React from 'react';

const Destinations = () => {
  const destinations = [
    {
      name: "Kathmandu",
      image: "https://images.pexels.com/photos/5225693/pexels-photo-5225693.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      hotels: "250+ Hotels"
    },
    {
      name: "Pokhara",
      image: "https://images.pexels.com/photos/7740160/pexels-photo-7740160.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      hotels: "180+ Hotels"
    },
    {
      name: "Chitwan",
      image: "https://images.pexels.com/photos/3593865/pexels-photo-3593865.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      hotels: "95+ Hotels"
    },
    {
      name: "Lumbini",
      image: "https://images.pexels.com/photos/6177638/pexels-photo-6177638.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      hotels: "75+ Hotels"
    }
  ];

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F5249] mb-4">Popular Destinations</h2>
          <p className="text-xl text-[#437057]">Explore the beauty of Nepal's finest locations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div key={index} className="relative group cursor-pointer overflow-hidden rounded-2xl">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2F5249]/70 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                <p className="text-sm opacity-90">{destination.hotels}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;