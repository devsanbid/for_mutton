import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = ({ onLoginClick, onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#2F5249]">HeavenStay</span>
            <span className="text-2xl font-bold text-[#437057]">Nepal</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-[#2F5249] hover:text-[#437057] transition-colors">Home</a>
            <a href="#hotels" className="text-[#2F5249] hover:text-[#437057] transition-colors">Hotels</a>
            <a href="#destinations" className="text-[#2F5249] hover:text-[#437057] transition-colors">Destinations</a>
            {/* <a href="#about" className="text-[#2F5249] hover:text-[#437057] transition-colors">About</a>
            <a href="#contact" className="text-[#2F5249] hover:text-[#437057] transition-colors">Contact</a> */}
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="text-[#2F5249] hover:text-[#437057] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onSignupClick}
              className="bg-[#437057] text-white px-6 py-2 rounded-lg hover:bg-[#2F5249] transition-colors"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#2F5249]"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#home" className="text-[#2F5249] hover:text-[#437057] transition-colors">Home</a>
              <a href="#hotels" className="text-[#2F5249] hover:text-[#437057] transition-colors">Hotels</a>
              <a href="#destinations" className="text-[#2F5249] hover:text-[#437057] transition-colors">Destinations</a>
              {/* <a href="#about" className="text-[#2F5249] hover:text-[#437057] transition-colors">About</a>
              <a href="#contact" className="text-[#2F5249] hover:text-[#437057] transition-colors">Contact</a> */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={onLoginClick}
                  className="text-left text-[#2F5249] hover:text-[#437057] transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={onSignupClick}
                  className="text-left bg-[#437057] text-white px-4 py-2 rounded-lg hover:bg-[#2F5249] transition-colors w-fit"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;