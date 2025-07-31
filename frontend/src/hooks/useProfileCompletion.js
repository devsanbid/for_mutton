import { useState, useEffect } from 'react';
import { hotelsAPI } from '../services/api';

export const useProfileCompletion = () => {
  const [hasProfile, setHasProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      setLoading(true);
      const response = await hotelsAPI.getHotelerHotels();
      const hotelsList = response.hotels || [];
      setHotels(hotelsList);
      setHasProfile(hotelsList.length > 0);
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    checkProfileCompletion();
  };

  return {
    hasProfile,
    loading,
    hotels,
    refreshProfile
  };
};

export default useProfileCompletion;