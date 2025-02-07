import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-pulse" />
        
        {/* Inner spinning ring */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-indigo-400 text-sm font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 