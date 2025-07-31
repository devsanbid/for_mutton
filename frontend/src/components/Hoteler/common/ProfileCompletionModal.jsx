import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Hotel, ArrowRight } from 'lucide-react';
import Button from './Button';

const ProfileCompletionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleCreateProfile = () => {
    navigate('/hoteler/hotel-profile');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Complete Your Hotel Profile
          </h3>
          
          <p className="text-gray-600 mb-6">
            You need to create your hotel profile before accessing other features. 
            Please add your hotel information to get started.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Hotel className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800 font-medium">
                Create your first hotel listing to unlock all features
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              className="flex-1 bg-[#437057] hover:bg-[#2F5249] text-white"
            >
              <span>Create Profile</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;