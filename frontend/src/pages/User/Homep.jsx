import React, { useState } from 'react';

import Login from '../../components/HomepageCompoent/Login';
import Signup from '../../components/HomepageCompoent/Sigin';
import Homepage from '../../components/HomepageCompoent/Homepage';

function HomeP() {
  const [currentPage, setCurrentPage] = useState('homepage');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login 
          onBack={() => setCurrentPage('homepage')} 
          onSignupClick={() => setCurrentPage('signup')}
        />;
      case 'signup':
        return <Signup 
          onBack={() => setCurrentPage('homepage')} 
          onLoginClick={() => setCurrentPage('login')}
        />;
      default:
        return (
          <Homepage
            onLoginClick={() => setCurrentPage('login')}
            onSignupClick={() => setCurrentPage('signup')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}

export default HomeP;