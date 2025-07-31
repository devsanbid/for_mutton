import React from 'react';
import { Shield, Award, Phone } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-[#E3DE61]/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2F5249] mb-4">Why Choose HeavenStay Nepal?</h2>
          <p className="text-xl text-[#437057]">Experience the difference with our premium service</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="bg-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
              <Shield className="h-10 w-10 text-[#437057]" />
            </div>
            <h3 className="text-xl font-bold text-[#2F5249] mb-4">Secure Booking</h3>
            <p className="text-[#437057]">Your bookings are protected with bank-level security and instant confirmation</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
              <Award className="h-10 w-10 text-[#437057]" />
            </div>
            <h3 className="text-xl font-bold text-[#2F5249] mb-4">Best Price Guarantee</h3>
            <p className="text-[#437057]">Find the same hotel cheaper elsewhere? We'll match the price and give you extra discount</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-white p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
              <Phone className="h-10 w-10 text-[#437057]" />
            </div>
            <h3 className="text-xl font-bold text-[#2F5249] mb-4">24/7 Support</h3>
            <p className="text-[#437057]">Our dedicated support team is available round the clock to assist you</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;