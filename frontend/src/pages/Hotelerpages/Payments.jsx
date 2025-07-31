import React, { useState } from "react";

const PaymentPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    alert("Payment submitted! (Demo)");
    // You can integrate Stripe or other gateway here
  };

  return (
    <div className="min-h-screen bg-gray-100 py-14 px-10">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-8 grid grid-cols-2 gap-8">
        {/* LEFT: Billing Summary */}
        <div>
          <h2 className="text-3xl font-bold text-[#2f5249] mb-6">Booking Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Hotel Name:</span>
              <span className="font-semibold text-[#2f5249]">HeavenStay Pokhara</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Nights:</span>
              <span>3</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-700">Price per night:</span>
              <span>Rs. 2500</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>Rs. 7500</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Payment Form */}
        <div>
          <h2 className="text-3xl font-bold text-[#2f5249] mb-6">Payment Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f5249]"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f5249]"
            />
            <input
              type="text"
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              placeholder="Card Number"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f5249]"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="expiry"
                value={form.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f5249]"
              />
              <input
                type="text"
                name="cvc"
                value={form.cvc}
                onChange={handleChange}
                placeholder="CVC"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f5249]"
              />
            </div>
            <button
              onClick={handlePayment}
              className="mt-4 w-full bg-[#2f5249] text-white py-3 rounded-lg hover:bg-[#26433b] transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
