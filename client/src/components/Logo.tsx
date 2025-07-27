import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      {/* CVGratis - texto principal */}
      <span className={`font-bold text-blue-600 ${sizeClasses[size]}`}>
        CV<span className="text-blue-800">Gratis</span>
      </span>
      
      {/* online - estilo manuscrito */}
      <span 
        className={`text-gray-600 transform -rotate-3 ${
          size === 'lg' ? 'text-2xl' : 
          size === 'md' ? 'text-lg' : 
          'text-sm'
        }`}
        style={{
          fontFamily: 'Kalam, Caveat, cursive',
          fontWeight: '400',
          marginLeft: '2px'
        }}
      >
        online
      </span>
      
      {/* Linha decorativa */}
      <div className="ml-1">
        <svg 
          width={size === 'lg' ? '40' : size === 'md' ? '30' : '20'} 
          height={size === 'lg' ? '20' : size === 'md' ? '15' : '10'} 
          viewBox="0 0 40 20" 
          className="text-blue-400"
        >
          <path 
            d="M2,18 Q10,5 20,10 T38,8" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
} 