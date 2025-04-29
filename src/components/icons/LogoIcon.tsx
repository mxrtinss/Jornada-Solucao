import React from 'react';
import logoImage from '/src/public/logo.png';  // Adjust path as needed

interface LogoIconProps {
  className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ className }) => {
  return (
    <img 
      src={logoImage}
      alt="Industrial Ops Logo" 
      className={className}
    />
  );
};


