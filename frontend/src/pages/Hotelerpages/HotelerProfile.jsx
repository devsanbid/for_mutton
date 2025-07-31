import React, { useState, useEffect } from 'react';
import { Upload, MapPin, Phone, Mail, Save, Edit, Camera, X, User } from 'lucide-react';
import Button from '../../components/Hoteler/common/Button';
import Loading from '../../components/common/Loading';
import { hotelsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getImageUrl } from '../../utils/imageUtils';

const HotelProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hotelData, setHotelData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    checkInTime: '',
    checkOutTime: '',
    cancellationPolicy: '',
    childPolicy: '',
    petPolicy: '',
    smokingPolicy: '',
    amenities: [],
    images: [],
    avatar: ''
  });
  const { showToast } = useToast();

  const [newAmenity, setNewAmenity] = useState('');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const fetchHotelProfile = async () => {
    try {
      setLoading(true);
      // Get hotelier's hotels
      const hotelsResponse = await hotelsAPI.getHotelerHotels();
      const hotels = hotelsResponse.hotels || [];
      
      // Get hotelier profile for avatar
      const profileResponse = await hotelsAPI.getHotelerProfile();
      const profile = profileResponse.profile;
      
      // Use first hotel data if available, otherwise use default values
      const hotel = hotels.length > 0 ? hotels[0] : {};
      
      // Extract policies from hotel.policies object
      const policies = hotel.policies || {};
      
      setHotelData({
        id: hotel.id || null,
        name: hotel.name || '',
        description: hotel.description || '',
        location: hotel.location || '',
        address: hotel.address || '',
        phone: hotel.phone || profile.phone || '',
        email: hotel.email || profile.email || '',
        website: hotel.website || '',
        checkInTime: policies.checkIn || '2:00 PM',
        checkOutTime: policies.checkOut || '12:00 PM',
        cancellationPolicy: policies.cancellation || '',
        childPolicy: policies.children || '',
        petPolicy: policies.pets || '',
        avatar: profile.avatar || '',
        smokingPolicy: policies.smoking || '',
        amenities: hotel.amenities || [],
        images: hotel.images || []
      });
    } catch (error) {
      console.error('Error fetching hotel profile:', error);
      showToast('Failed to load hotel profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Update avatar if selected
      if (selectedAvatarFile) {
        const formData = new FormData();
        formData.append('name', hotelData.name);
        formData.append('email', hotelData.email);
        formData.append('phone', hotelData.phone);
        formData.append('avatar', selectedAvatarFile);
        
        const response = await hotelsAPI.updateHotelerProfileWithAvatar(formData);
        if (response.profile && response.profile.avatar) {
          setHotelData(prev => ({ ...prev, avatar: response.profile.avatar }));
        }
      }
      
      // Create or update hotel data
      const hotelFormData = new FormData();
      hotelFormData.append('name', hotelData.name);
      hotelFormData.append('description', hotelData.description);
      hotelFormData.append('location', hotelData.location);
      hotelFormData.append('address', hotelData.address);
      hotelFormData.append('phone', hotelData.phone);
      hotelFormData.append('email', hotelData.email);
      hotelFormData.append('website', hotelData.website);
      hotelFormData.append('amenities', JSON.stringify(hotelData.amenities));
      
      // Combine all policies into a single object
      const policies = {
        checkIn: hotelData.checkInTime,
        checkOut: hotelData.checkOutTime,
        cancellation: hotelData.cancellationPolicy,
        children: hotelData.childPolicy,
        pets: hotelData.petPolicy,
        smoking: hotelData.smokingPolicy
      };
      hotelFormData.append('policies', JSON.stringify(policies));
      
      // Add images to FormData
      hotelData.images.forEach((image, index) => {
        if (image instanceof File) {
          hotelFormData.append('images', image);
        }
      });
      
      let response;
      const isCreating = !hotelData.id;
      
      if (hotelData.id) {
        // Update existing hotel
        response = await hotelsAPI.update(hotelData.id, hotelFormData);
      } else {
        // Create new hotel
        response = await hotelsAPI.create(hotelFormData);
        // Update hotelData with the new hotel ID
        if (response.hotel && response.hotel.id) {
          setHotelData(prev => ({ ...prev, id: response.hotel.id }));
        }
      }
      
      setIsEditing(false);
      setSelectedAvatarFile(null);
      setAvatarPreview('');
      
      // Refresh data from database to show persisted changes
      await fetchHotelProfile();
      
      const successMessage = isCreating ? 'Hotel profile created successfully!' : 'Hotel profile updated successfully!';
      showToast(successMessage, 'success');
    } catch (error) {
      console.error('Error updating hotel profile:', error);
      showToast('Failed to update hotel profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchHotelProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setHotelData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !hotelData.amenities.includes(newAmenity.trim())) {
      setHotelData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity) => {
    setHotelData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...hotelData.images];
      newImages[index] = file; // Store the actual file object
      setHotelData(prev => ({
        ...prev,
        images: newImages
      }));
      showToast(`Image replaced with "${file.name}"!`, 'success');
    }
  };

  const addNewImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotelData(prev => ({
        ...prev,
        images: [...prev.images, file] // Store the actual file object
      }));
      showToast(`Image "${file.name}" added successfully!`, 'success');
    }
  };

  const removeImage = (index) => {
    setHotelData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotel Profile</h2>
          <p className="text-gray-600 mt-1">Manage your hotel information and settings</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={saving}
          style={{ backgroundColor: '#437057' }}
          className="hover:opacity-90"
        >
          {saving ? (
            <>
              <Loading size="small" />
              <span className="ml-2">Saving...</span>
            </>
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Avatar */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Avatar</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              {avatarPreview || hotelData.avatar ? (
                <img
                  src={avatarPreview || `http://localhost:5000/${hotelData.avatar}`}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            )}
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-900">{hotelData.name || 'Hotel Name'}</h4>
            <p className="text-gray-600">{hotelData.email}</p>
            {isEditing && (
              <p className="text-sm text-gray-500 mt-2">
                Click the camera icon to upload a new profile picture
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hotel Images */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hotel Images</h3>
          {isEditing && (
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('add-image-input').click()}
              >
                <Camera className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <input
                id="add-image-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={addNewImage}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotelData.images.map((image, index) => {
            // Handle both file objects and existing URLs
            const imageUrl = getImageUrl(image);
            return (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Hotel image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="flex space-x-2">
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white hover:bg-white hover:text-gray-900"
                        onClick={() => document.getElementById(`replace-image-${index}`).click()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Replace
                      </Button>
                      <input
                        id={`replace-image-${index}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
            {isEditing ? (
              <input
                type="text"
                value={hotelData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{hotelData.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="text"
                  value={hotelData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900 py-2">{hotelData.location}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          {isEditing ? (
            <textarea
              value={hotelData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 py-2 leading-relaxed">{hotelData.description}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="tel"
                  value={hotelData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900 py-2">{hotelData.phone}</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              {isEditing ? (
                <input
                  type="email"
                  value={hotelData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <span className="text-gray-900 py-2">{hotelData.email}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
          {isEditing ? (
            <textarea
              value={hotelData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900 py-2">{hotelData.address}</p>
          )}
        </div>
      </div>

      {/* Hotel Policies */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
            {isEditing ? (
              <input
                type="text"
                value={hotelData.checkInTime}
                onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{hotelData.checkInTime}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
            {isEditing ? (
              <input
                type="text"
                value={hotelData.checkOutTime}
                onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{hotelData.checkOutTime}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
            {isEditing ? (
              <textarea
                value={hotelData.cancellationPolicy}
                onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 leading-relaxed">{hotelData.cancellationPolicy}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Child Policy</label>
            {isEditing ? (
              <textarea
                value={hotelData.childPolicy}
                onChange={(e) => handleInputChange('childPolicy', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2 leading-relaxed">{hotelData.childPolicy}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pet Policy</label>
            {isEditing ? (
              <input
                type="text"
                value={hotelData.petPolicy}
                onChange={(e) => handleInputChange('petPolicy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{hotelData.petPolicy}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Policy</label>
            {isEditing ? (
              <input
                type="text"
                value={hotelData.smokingPolicy}
                onChange={(e) => handleInputChange('smokingPolicy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 py-2">{hotelData.smokingPolicy}</p>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Amenities</h3>
        
        {isEditing && (
          <div className="mb-4 flex space-x-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add new amenity"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addAmenity()}
            />
            <Button
              onClick={addAmenity}
              style={{ backgroundColor: '#437057' }}
              className="hover:opacity-90"
            >
              Add
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {hotelData.amenities.map((amenity, index) => (
            <div
              key={index}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                isEditing ? 'bg-gray-100 border border-gray-200' : 'bg-green-50 border border-green-200'
              }`}
            >
              <span className="text-sm text-gray-700">{amenity}</span>
              {isEditing && (
                <button
                  onClick={() => removeAmenity(amenity)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelProfile;