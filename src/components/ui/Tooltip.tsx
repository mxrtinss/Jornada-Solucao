import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2',
  };
  
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full rotate-180',
    left: 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 rotate-90',
    right: 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 -rotate-90',
  };
  
  const handleMouseEnter = () => {
    setIsVisible(true);
  };
  
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          className={`
            absolute z-50 w-max max-w-xs
            px-3 py-2 text-sm font-medium text-white
            bg-gray-900 rounded-md shadow-sm
            transition-opacity duration-300
            ${positionClasses[position]}
            ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          role="tooltip"
        >
          {content}
          <div 
            className={`
              absolute w-3 h-3 bg-gray-900 transform rotate-45
              ${arrowClasses[position]}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;