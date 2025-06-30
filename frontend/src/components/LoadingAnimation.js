import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const LoadingAnimation = ({ progress = 0 }) => {
  return (
    <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
          <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1 animate-bounce" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            AI Analysis in Progress...
          </h3>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600">
            {progress < 30 && "Analyzing website structure..."}
            {progress >= 30 && progress < 60 && "Finding competitors..."}
            {progress >= 60 && progress < 100 && "Generating recommendations..."}
            {progress >= 100 && "Almost done!"}
          </p>
        </div>
        
        <div className="text-2xl font-bold text-blue-600">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
