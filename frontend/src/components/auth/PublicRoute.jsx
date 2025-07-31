import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated()) {
    const redirectPath = user?.role === 'admin' ? '/admin' : 
                        user?.role === 'hotelier' ? '/hoteler' : '/users';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;