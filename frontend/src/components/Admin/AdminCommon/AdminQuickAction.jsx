import React from 'react';
import { UserPlus, Building, Bell, BarChart3 } from 'lucide-react';
import Button from './Button';

const AdminQuickActions = () => {
  const actions = [
    {
      title: 'Approve Hoteliers',
      description: 'Review pending applications',
      icon: Building,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => alert('Navigate to Hotelier Management')
    },
    {
      title: 'Send Notification',
      description: 'Broadcast to all users',
      icon: Bell,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => alert('Navigate to Notifications')
    },
    {
      title: 'View Reports',
      description: 'Generate analytics report',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => alert('Navigate to Analytics')
    },
    {
      title: 'Manage Users',
      description: 'User account management',
      icon: UserPlus,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => alert('Navigate to User Management')
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} p-4 h-auto flex-col items-center text-center text-white`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="font-medium">{action.title}</span>
              <span className="text-xs opacity-90 mt-1">{action.description}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminQuickActions;