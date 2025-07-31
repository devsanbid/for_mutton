import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { getHotelImageUrl } from '../../utils/imageUtils';

const PaymentComponent = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const bookingData = location.state?.bookingData;

  if (!bookingData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
        <p className="text-gray-600 mb-6">The booking information could not be found.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#2F5249] text-white px-6 py-3 rounded-lg hover:bg-[#437057] transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
    }

    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substr(0, 5);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      navigate('/mybookings', {
        state: {
          paymentSuccess: true,
          bookingId: bookingData.bookingId
        }
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-[#437057] hover:text-[#2F5249] transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Booking</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Lock className="text-green-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Secure Payment</h1>
          </div>
{/* Payment Methods */}
<div className="mb-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
  <div className="space-y-3">
    <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <input
        type="radio"
        name="paymentMethod"
        value="card"
        checked={paymentMethod === 'card'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="text-[#437057] focus:ring-[#437057]"
      />
      <CreditCard className="text-[#437057]" size={20} />
      <span className="font-medium">e-Sewa</span>
    </label>
    <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <input
        type="radio"
        name="paymentMethod"
        value="payAtHotel"
        checked={paymentMethod === 'payAtHotel'}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="text-[#437057] focus:ring-[#437057]"
      />
      <div className="w-5 h-5 bg-[#97B067] rounded-full"></div>
      <span className="font-medium">Pay at Hotel</span>
    </label>
  </div>
</div>

{/* e-Sewa Payment Form */}
{paymentMethod === 'card' && (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div>
      <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
        Name
      </label>
      <input
        type="text"
        id="cardholderName"
        name="cardholderName"
        value={paymentData.cardholderName}
        onChange={handleInputChange}
        placeholder="John Doe"
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
      />
    </div>

    <div>
      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
        e-Sewa ID
      </label>
      <input
        type="text"
        id="cardNumber"
        name="cardNumber"
        value={paymentData.cardNumber}
        onChange={handleInputChange}
        placeholder="98XXXXXXXX"
        maxLength={10}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#437057] focus:border-transparent"
      />
    </div>

    <button
      type="submit"
      disabled={isProcessing}
      className="w-full bg-[#2F5249] text-white py-3 px-6 rounded-lg hover:bg-[#437057] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Lock size={16} />
          <span>Pay NPR {bookingData.total.toLocaleString()}</span>
        </>
      )}
    </button>
  </form>
)}


          {/* Pay at Hotel */}
          {paymentMethod === 'payAtHotel' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Pay at Hotel Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Payment is due at check-in</li>
                  <li>• Accepted payment methods: Cash, Card</li>
                  <li>• Please bring valid ID for verification</li>
                  <li>• Cancellation policy still applies</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/mybookings')}
                className="w-full bg-[#2F5249] text-white py-3 px-6 rounded-lg hover:bg-[#437057] transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>Confirm Booking</span>
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Lock className="inline w-4 h-4 mr-1" />
              Your payment information is secure and encrypted
            </p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={getHotelImageUrl(bookingData.hotel)}
                alt={bookingData.hotel.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{bookingData.hotel.name}</h3>
                <p className="text-gray-600">{bookingData.hotel.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">{bookingData.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">{bookingData.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">{bookingData.nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{bookingData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium">{bookingData.selectedRoom?.name}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room charge ({bookingData.nights} nights)</span>
                <span className="font-medium">NPR {bookingData.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (13%)</span>
                <span className="font-medium">NPR {bookingData.tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#2F5249]">NPR {bookingData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
