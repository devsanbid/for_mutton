import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Bed, Users, DollarSign, Upload } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';
import Modal from '../../components/Hoteler/common/Modal';
import RoomForm from './RoomForms';
import { roomsAPI, hotelsAPI } from '../../services/api';
import Loading from '../../components/common/Loading';
import { useToast } from '../../context/ToastContext';
import { getImageUrl } from '../../utils/imageUtils';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [hotels, setHotels] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoomsAndHotels();
  }, []);

  const fetchRoomsAndHotels = async () => {
    try {
      setLoading(true);
      const [roomsResponse, hotelsResponse] = await Promise.all([
        roomsAPI.getHotelerRooms(),
        hotelsAPI.getHotelerHotels()
      ]);
      
      setRooms(roomsResponse.rooms || []);
      setHotels(hotelsResponse.hotels || []);
    } catch (error) {
      console.error('Error fetching rooms and hotels:', error);
      toast.error('Failed to load rooms data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        await roomsAPI.delete(id);
        setRooms(rooms.filter(room => room.id !== id));
        toast.success('Room deleted successfully');
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
      }
    }
  };

  const handleSaveRoom = async (roomData) => {
    try {
      if (editingRoom) {
        await roomsAPI.update(editingRoom.id, roomData);
        toast.success('Room updated successfully');
      } else {
        if (hotels.length === 0) {
          toast.error('Please create a hotel first before adding rooms');
          return;
        }
        const hotelId = hotels[0].id;
        await roomsAPI.create(hotelId, roomData);
        toast.success('Room created successfully');
      }
      
      await fetchRoomsAndHotels();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error(editingRoom ? 'Failed to update room' : 'Failed to create room');
    }
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
          <p className="text-gray-600 mt-1">Manage your room types and availability</p>
        </div>
        <Button
          onClick={handleAddRoom}
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90 flex items-center"
          disabled={hotels.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Room
        </Button>
      </div>

      {hotels.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Please create a hotel profile first before adding rooms.
          </p>
        </div>
      )}

      {/* Room Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Bed className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first room type</p>
            {hotels.length > 0 && (
              <Button
                onClick={handleAddRoom}
                style={{ backgroundColor: '#437057' }}
                className="hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Room
              </Button>
            )}
          </div>
        ) : (
          rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="relative">
              <img 
                src={room.images && room.images.length > 0 ? getImageUrl(room.images[0]) : '/api/placeholder/400/300'} 
                alt={room.roomType || room.type}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-white text-gray-700">
                  {room.totalRooms || 0} rooms
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{room.roomType || room.type}</h3>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-medium">Rs. {(room.pricePerNight || room.price || 0).toLocaleString()}/night</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{room.description || 'No description available'}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Up to {room.maxOccupancy || room.capacity || 0} guests</span>
                </div>
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="text-sm text-gray-600">{room.totalRooms || 0} rooms</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities:</h4>
                <div className="flex flex-wrap gap-1">
                  {(room.amenities || []).slice(0, 4).map((amenity, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {(room.amenities || []).length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{(room.amenities || []).length - 4} more
                    </span>
                  )}
                  {(!room.amenities || room.amenities.length === 0) && (
                    <span className="text-gray-500 text-xs">No amenities listed</span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleEditRoom(room)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteRoom(room.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingRoom ? 'Edit Room Type' : 'Add New Room Type'}
      >
        <RoomForm
          room={editingRoom}
          onSave={handleSaveRoom}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Rooms;