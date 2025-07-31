const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath instanceof File) {
    return URL.createObjectURL(imagePath);
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  return `${BASE_URL}/${imagePath}`;
};

export const getHotelImageUrl = (hotel, index = 0) => {
  if (!hotel || !hotel.images || hotel.images.length === 0) {
    return '/api/placeholder/400/300';
  }
  
  const image = hotel.images[index];
  return getImageUrl(image);
};

export const getUserAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  return getImageUrl(avatarPath);
};