import React from 'react';

interface PixelMidasLogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  glow?: boolean;
}

export const PixelMidasLogo: React.FC<PixelMidasLogoProps> = ({
  size = 'md',
  color = '#D8F834',
  glow = true
}) => {
  const heights = {
    sm: 18,
    md: 24,
    lg: 32
  };

  const h = heights[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        userSelect: 'none'
      }}
    >
      <svg
        height={h}
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: glow ? `drop-shadow(0 0 10px ${color}40)` : 'none'
        }}
      >
        {/* Pixel font rendering for 'MIDAS' in 8-bit grid */}
        {/* M */}
        <g fill={color}>
          <rect x="0" y="4" width="6" height="32" />
          <rect x="6" y="8" width="6" height="6" />
          <rect x="12" y="14" width="6" height="6" />
          <rect x="18" y="8" width="6" height="6" />
          <rect x="24" y="4" width="6" height="32" />
        </g>

        {/* I */}
        <g fill={color} transform="translate(38, 0)">
          <rect x="0" y="4" width="20" height="6" />
          <rect x="7" y="10" width="6" height="20" />
          <rect x="0" y="30" width="20" height="6" />
        </g>

        {/* D */}
        <g fill={color} transform="translate(68, 0)">
          <rect x="0" y="4" width="6" height="32" />
          <rect x="6" y="4" width="16" height="6" />
          <rect x="6" y="30" width="16" height="6" />
          <rect x="22" y="10" width="6" height="20" />
        </g>

        {/* A */}
        <g fill={color} transform="translate(104, 0)">
          <rect x="6" y="4" width="16" height="6" />
          <rect x="0" y="10" width="6" height="26" />
          <rect x="22" y="10" width="6" height="26" />
          <rect x="6" y="18" width="16" height="6" />
        </g>

        {/* S */}
        <g fill={color} transform="translate(140, 0)">
          <rect x="6" y="4" width="20" height="6" />
          <rect x="0" y="10" width="6" height="8" />
          <rect x="6" y="17" width="16" height="6" />
          <rect x="20" y="23" width="6" height="8" />
          <rect x="0" y="30" width="20" height="6" />
        </g>
      </svg>
    </div>
  );
};

export default PixelMidasLogo;
