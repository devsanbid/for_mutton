import React from 'react';
import ProfileComponent from '../../../components/User/Profile';
import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  return (
    <ProfileComponent user={user} setUser={setUser} />
  );
};

export default Profile;
