import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Star, DollarSign, Eye } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';
import Modal from '../../components/Hoteler/common/Modal';
import HotelForm from '../../components/Hoteler/forms/HotelForm';
import { getHotelImageUrl } from '../../utils/imageUtils';


const Hotels = () => {
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: 'Grand Paradise Resort',
      location: 'Bali, Indonesia',
      rating: 4.8,
      rooms: 45,
      price: '$120/night',
      status: 'Active',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      name: 'Ocean View Hotel',
      location: 'Maldives',
      rating: 4.9,
      rooms: 32,
      price: '$250/night',
      status: 'Active',
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      name: 'Mountain Lodge',
      location: 'Swiss Alps',
      rating: 4.7,
      rooms: 28,
      price: '$180/night',
      status: 'Maintenance',
      image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);

  const handleAddHotel = () => {
    setEditingHotel(null);
    setShowModal(true);
  };

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setShowModal(true);
  };

  const handleDeleteHotel = (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      setHotels(hotels.filter(hotel => hotel.id !== id));
    }
  };

  const handleSaveHotel = (hotelData) => {
    if (editingHotel) {
      setHotels(hotels.map(hotel => 
        hotel.id === editingHotel.id ? { ...hotel, ...hotelData } : hotel
      ));
    } else {
      const newHotel = {
        ...hotelData,
        id: Date.now(),
        rating: 4.5,
        status: 'Active'
      };
      setHotels([...hotels, newHotel]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotel Management</h2>
          <p className="text-gray-600">Manage your hotel listings and properties</p>
        </div>
        <Button
          onClick={handleAddHotel}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Hotel
        </Button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img 
              src={getHotelImageUrl(hotel)} 
              alt={hotel.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hotel.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {hotel.status}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{hotel.location}</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{hotel.rating}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium">{hotel.price}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 mb-4">
                {hotel.rooms} rooms available
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEditHotel(hotel)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteHotel(hotel.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Hotel Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
      >
        <HotelForm
          hotel={editingHotel}
          onSave={handleSaveHotel}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Hotels;