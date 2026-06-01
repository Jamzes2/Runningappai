import React from 'react';

interface LogoProps {
  className?: string;
  height?: number;
  width?: number;
  color?: string;
}

export default function Logo({ 
  className = "", 
  height = 40, 
  width = 160, 
  color = "var(--accent)" 
}: LogoProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 160 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Slanted RS branding */}
      <g transform="skewX(-16) translate(15, 0)">
        {/* Trailing speed lines on the left side of R */}
        <line x1="5" y1="18" x2="25" y2="18" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="0" y1="28" x2="30" y2="28" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="8" y1="38" x2="22" y2="38" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="3" y1="48" x2="27" y2="48" stroke={color} strokeWidth="4" strokeLinecap="round" />

        {/* Letter R */}
        <path 
          d="M45,15 H72 C81.5,15 88,20 88,28.5 C88,36.5 81.5,41 72,41 H56 V55 M56,38 H70 C74.5,38 78,35.5 78,30 C78,24.5 74.5,22 70,22 H56 V38 M56,41 L76,55" 
          stroke={color} 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Letter S */}
        <path 
          d="M102,23 C102,18 108,15.5 116,15.5 C124,15.5 128,19.5 128,24.5 C128,32 118,34 110,36 C102,38 97,41.5 97,48.5 C97,55 103,59.5 113,59.5 C123,59.5 129,55 129,50" 
          stroke={color} 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Extra Top speed stroke on S */}
        <line x1="88" y1="15.5" x2="98" y2="15.5" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
