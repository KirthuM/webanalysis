// frontend/src/components/CircularProgress.js
import React, { useState, useEffect } from 'react';

const CircularProgress = ({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showPercentage = true,
  label = '',
  animate = true
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  
  const normalizedPercentage = Math.max(0, Math.min(100, Number(percentage) || 0));
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    if (!animate) {
      setAnimatedPercentage(normalizedPercentage);
      return;
    }

    const startTime = Date.now();
    const duration = 1000;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed >= duration) {
        setAnimatedPercentage(normalizedPercentage);
        clearInterval(timer);
        return;
      }

      const progress = elapsed / duration;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = normalizedPercentage * easeOutProgress;
      
      setAnimatedPercentage(currentValue);
    }, 16);

    return () => clearInterval(timer);
  }, [normalizedPercentage, animate]);

  const getColor = (percent) => {
    if (percent >= 80) return '#10B981';
    if (percent >= 60) return '#3B82F6';  
    if (percent >= 40) return '#F59E0B';
    if (percent >= 20) return '#EF4444';
    return '#6B7280';
  };

  const progressColor = color === 'auto' ? getColor(normalizedPercentage) : color;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-20"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span 
            className="text-2xl font-bold tabular-nums"
            style={{ color: progressColor }}
          >
            {Math.round(animatedPercentage * 100) / 100}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center max-w-20">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
