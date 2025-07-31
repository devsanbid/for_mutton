import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 w-screen">
      {/* Fixed Sidebar */}
        <AdminSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
    

      {/* Main content wrapper with margin-left for fixed sidebar */}
      <div className=" flex flex-col h-full">
        {/* Header (sticky if needed) */}
        <div className="sticky top-0 z-10">
          <AdminHeader
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 mt-10 lg:p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
