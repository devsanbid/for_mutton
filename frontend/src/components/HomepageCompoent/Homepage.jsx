import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturedHotels from './FeatureHotels';
import Destinations from './Destinations';
import WhyChooseUs from './WhyChooseUs';
import Footer from './Footer';

const Homepage = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
      <HeroSection />
      <FeaturedHotels />
      <Destinations />
      <WhyChooseUs />
      <Footer />
    </div>
  );
};

export default Homepage;