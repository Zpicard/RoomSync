import React from 'react';
import { HomeIcon } from '@heroicons/react/24/solid';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <div className={`${className} flex items-center justify-center rounded-lg bg-white/10 p-2`}>
      <HomeIcon className="w-full h-full text-current" />
    </div>
  );
};

export default Logo; 