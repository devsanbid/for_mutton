import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2F5249]/80 to-[#437057]/70 z-10"></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1')"
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Discover Paradise in
          <span className="text-[#E3DE61] block">Nepal</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Experience the majesty of the Himalayas with luxury accommodations
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
