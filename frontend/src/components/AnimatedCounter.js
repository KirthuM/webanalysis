// frontend/src/components/AnimatedCounter.js
import React, { useState, useEffect } from 'react';

const AnimatedCounter = ({ 
  end, 
  duration = 1000, 
  isPercentage = false, 
  decimals = 0,
  startDelay = 0 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now() + startDelay;
    const endValue = Number(end) || 0;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (elapsed < 0) return;
      
      if (elapsed >= duration) {
        setCount(endValue);
        clearInterval(timer);
        return;
      }

      const progress = elapsed / duration;
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = endValue * easeOutProgress;
      
      setCount(currentValue);
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, startDelay]);

  const formatNumber = (num) => {
    const value = Number(num) || 0;
    if (isPercentage) {
      const rounded = Math.round(value * 100) / 100;
      return decimals > 0 ? rounded.toFixed(decimals) : Math.round(rounded);
    }
    return decimals > 0 ? value.toFixed(decimals) : Math.round(value);
  };

  return (
    <span className="tabular-nums">
      {formatNumber(count)}{isPercentage ? '%' : ''}
    </span>
  );
};

export default AnimatedCounter;
