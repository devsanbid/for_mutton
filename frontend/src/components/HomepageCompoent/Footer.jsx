import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2F5249] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl font-bold">HeavenStay Nepal</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your gateway to experiencing the magnificent beauty of Nepal with world-class hospitality.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-300 hover:text-[#E3DE61] cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-300 hover:text-[#E3DE61] cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-300 hover:text-[#E3DE61] cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {/* <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li> */}
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hotels</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Destinations</a></li>
              {/* <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li> */}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cancellation Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#97B067]" />
                <span className="text-gray-300">+977-1-4444444</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#97B067]" />
                <span className="text-gray-300">info@heavenstaynepal.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-[#97B067]" />
                <span className="text-gray-300">Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#437057] mt-12 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 HeavenStay Nepal. All rights reserved. | Designed with ❤️ for Nepal Tourism
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;