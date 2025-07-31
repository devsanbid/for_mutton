import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';

const RoomForm = ({ room, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    type: room?.type || '',
    price: room?.price || '',
    capacity: room?.capacity || '',
    totalRooms: room?.totalRooms || '',
    description: room?.description || '',
    amenities: room?.amenities?.join(', ') || '',
    images: room?.images || []
  });

  const [imageFiles, setImageFiles] = useState([]);

  const roomTypes = [
    { value: 'standard', label: 'Standard Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'presidential', label: 'Presidential Suite' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const roomData = {
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      totalRooms: parseInt(formData.totalRooms),
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      images: imageFiles.length > 0 ? imageFiles : []
    };
    onSave(roomData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // In a real app, you would upload these to a server
      // For now, we'll create object URLs for preview
      const newImages = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      setImageFiles(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter room name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Type
        </label>
        <select
          required
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select room type</option>
          {roomTypes.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per Night (Rs.)
          </label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="3500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guest Capacity
          </label>
          <input
            type="number"
            required
            min="1"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Rooms
        </label>
        <input
          type="number"
          required
          min="1"
          value={formData.totalRooms}
          onChange={(e) => handleChange('totalRooms', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the room features and amenities"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amenities (comma separated)
        </label>
        <input
          type="text"
          value={formData.amenities}
          onChange={(e) => handleChange('amenities', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="WiFi, AC, TV, Private Bathroom"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Room Images
        </label>
        
        {/* Image Upload */}
        <div className="mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> room images
              </p>
              <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Image Preview */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Room ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90"
        >
          {room ? 'Update Room' : 'Add Room'}
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;