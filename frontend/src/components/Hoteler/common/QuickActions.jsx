import React from 'react';
import { Plus, Calendar, MessageSquare, BarChart3 } from 'lucide-react';
import Button from './Button';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Hotel',
      description: 'Create a new hotel listing',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => alert('Add New Hotel clicked')
    },
    {
      title: 'View Calendar',
      description: 'Check room availability',
      icon: Calendar,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => alert('View Calendar clicked')
    },
    {
      title: 'Messages',
      description: 'Reply to guest messages',
      icon: MessageSquare,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => alert('Messages clicked')
    },
    {
      title: 'Reports',
      description: 'Generate performance reports',
      icon: BarChart3,
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => alert('Reports clicked')
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              onClick={action.onClick}
              className={`${action.color} p-4 h-auto flex-col items-center text-center`}
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

export default QuickActions;