import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Header user={user} />
      <main className="pt-4">
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
