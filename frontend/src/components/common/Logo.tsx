import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <div className={`${className} flex items-center justify-center rounded-lg bg-white/10 p-2`}>
      <img src="/logo.svg" alt="RoomSync Logo" className="w-full h-full" />
    </div>
  );
};

export default Logo; 