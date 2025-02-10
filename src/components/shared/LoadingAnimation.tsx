import React from 'react';
import { Bot } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-indigo-600 p-4 rounded-2xl shadow-xl animate-bounce">
            <Bot className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-xl font-semibold text-white">Loading</h2>
          {/* Loading Dots */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-1/2 rounded-full 
            animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl animate-pulse [animation-delay:0.5s]"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 