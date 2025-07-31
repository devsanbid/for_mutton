import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useProfileCompletion from '../../../hooks/useProfileCompletion';
import ProfileCompletionModal from './ProfileCompletionModal';
import Loading from '../../common/Loading';

const ProtectedHotelerRoute = ({ children }) => {
  const { hasProfile, loading } = useProfileCompletion();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  // Allow access to hotel-profile route without profile completion check
  const isProfileRoute = location.pathname === '/hoteler/hotel-profile';

  useEffect(() => {
    if (!loading && !hasProfile && !isProfileRoute) {
      setShowModal(true);
    }
  }, [hasProfile, loading, isProfileRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="large" />
      </div>
    );
  }

  // If no profile and not on profile route, show modal and prevent access
  if (!hasProfile && !isProfileRoute) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Profile Required
            </h2>
            <p className="text-gray-600">
              Please complete your hotel profile to continue.
            </p>
          </div>
        </div>
        <ProfileCompletionModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </>
    );
  }

  return children;
};

export default ProtectedHotelerRoute;