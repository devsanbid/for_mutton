import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const { id, message, type, duration } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = 'flex items-center p-4 mb-3 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  const getIcon = () => {
    const iconProps = { className: 'h-5 w-5 mr-3 flex-shrink-0' };
    
    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="h-5 w-5 mr-3 flex-shrink-0 text-green-500" />;
      case 'error':
        return <XCircle {...iconProps} className="h-5 w-5 mr-3 flex-shrink-0 text-red-500" />;
      case 'warning':
        return <AlertTriangle {...iconProps} className="h-5 w-5 mr-3 flex-shrink-0 text-yellow-500" />;
      case 'info':
        return <Info {...iconProps} className="h-5 w-5 mr-3 flex-shrink-0 text-blue-500" />;
      default:
        return <Info {...iconProps} className="h-5 w-5 mr-3 flex-shrink-0 text-gray-500" />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;