import React from 'react';

const Loading = ({ 
  size = 'medium', 
  color = 'blue', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  };

  const spinnerClass = `
    ${sizeClasses[size]} 
    border-4 
    border-gray-200 
    ${colorClasses[color]} 
    border-t-transparent 
    rounded-full 
    animate-spin
  `;

  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div className={spinnerClass}></div>
        {text && (
          <p className="text-gray-600 text-sm font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton loading component for content placeholders
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  animate = true 
}) => {
  const animationClass = animate ? 'animate-pulse' : '';
  
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className={`bg-gray-200 rounded ${animationClass}`}>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

// Card skeleton loader
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="animate-pulse">
        <div className="bg-gray-200 h-48 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          <div className="bg-gray-200 h-4 rounded w-1/2"></div>
          <div className="bg-gray-200 h-4 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoading = ({ 
  text = 'Loading...', 
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
      <span>{text}</span>
    </div>
  );
};

export default Loading;