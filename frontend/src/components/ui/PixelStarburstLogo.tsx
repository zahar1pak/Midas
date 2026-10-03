import React from 'react';

interface PixelStarburstLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const PixelStarburstLogo: React.FC<PixelStarburstLogoProps> = ({
  size = 40,
  showText = true,
  className = ''
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        userSelect: 'none'
      }}
    >
      {/* Pixel Starburst Emblem from Reference 1 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(198, 255, 51, 0.45))',
          flexShrink: 0
        }}
      >
        {/* Pixel Circle Perimeter */}
        {/* White Arc (left & bottom) */}
        <g fill="#FFFFFF">
          <rect x="44" y="16" width="3" height="3" />
          <rect x="40" y="18" width="3" height="3" />
          <rect x="36" y="21" width="3" height="3" />
          <rect x="33" y="25" width="3" height="3" />
          <rect x="30" y="30" width="3" height="3" />
          <rect x="28" y="36" width="3" height="3" />
          <rect x="27" y="42" width="3" height="3" />
          <rect x="27" y="48" width="3" height="3" />
          <rect x="28" y="54" width="3" height="3" />
          <rect x="31" y="60" width="3" height="3" />
          <rect x="35" y="65" width="3" height="3" />
          <rect x="40" y="69" width="3" height="3" />
          <rect x="46" y="71" width="3" height="3" />
          <rect x="52" y="71" width="3" height="3" />
          <rect x="58" y="69" width="3" height="3" />
          <rect x="63" y="66" width="3" height="3" />
        </g>

        {/* Lime Arc (top & right) */}
        <g fill="#C6FF33">
          <rect x="50" y="16" width="3" height="3" />
          <rect x="56" y="17" width="3" height="3" />
          <rect x="62" y="20" width="3" height="3" />
          <rect x="67" y="25" width="3" height="3" />
          <rect x="70" y="31" width="3" height="3" />
          <rect x="72" y="37" width="3" height="3" />
          <rect x="72" y="43" width="3" height="3" />
          <rect x="71" y="49" width="3" height="3" />
          <rect x="68" y="55" width="3" height="3" />
        </g>

        {/* Dither pattern connecting circle to star */}
        <g fill="#C6FF33" opacity="0.85">
          <rect x="34" y="42" width="2" height="2" />
          <rect x="38" y="40" width="2" height="2" />
          <rect x="36" y="44" width="2" height="2" />
          <rect x="40" y="42" width="2" height="2" />
          <rect x="38" y="46" width="2" height="2" />
          <rect x="42" y="44" width="2" height="2" />
          <rect x="40" y="48" width="2" height="2" />
          <rect x="44" y="46" width="2" height="2" />
          <rect x="42" y="50" width="2" height="2" />
          <rect x="46" y="48" width="2" height="2" />
          <rect x="44" y="52" width="2" height="2" />
          <rect x="48" y="50" width="2" height="2" />
          <rect x="46" y="54" width="2" height="2" />
        </g>

        {/* Diagonal Trail Pixels */}
        <g fill="#C6FF33">
          <rect x="18" y="48" width="4" height="4" />
          <rect x="22" y="48" width="4" height="4" />
          <rect x="26" y="49" width="3" height="3" />
          <rect x="28" y="62" width="3" height="3" />
          <rect x="29" y="66" width="3" height="3" />
          <rect x="31" y="70" width="3" height="3" />
        </g>

        {/* Main Central Starburst Spikes (Neon Lime #C6FF33) */}
        <g fill="#C6FF33">
          {/* Top-Right Long Spike */}
          <rect x="52" y="32" width="6" height="6" />
          <rect x="56" y="28" width="5" height="5" />
          <rect x="60" y="23" width="5" height="6" />
          <rect x="64" y="17" width="5" height="7" />
          <rect x="68" y="10" width="4" height="8" />
          <rect x="71" y="5" width="3" height="6" />

          {/* Right Spikes */}
          <rect x="58" y="37" width="8" height="5" />
          <rect x="65" y="38" width="9" height="4" />
          <rect x="73" y="40" width="8" height="4" />
          <rect x="80" y="41" width="6" height="3" />

          <rect x="64" y="45" width="8" height="4" />
          <rect x="71" y="47" width="9" height="4" />

          {/* Bottom & Center Spikes */}
          <rect x="48" y="38" width="10" height="10" />
          <rect x="45" y="44" width="8" height="8" />
          <rect x="52" y="46" width="8" height="8" />
          <rect x="54" y="53" width="5" height="8" />
          <rect x="56" y="60" width="4" height="7" />

          {/* Left Inner Core Spikes */}
          <rect x="42" y="36" width="7" height="6" />
          <rect x="36" y="37" width="7" height="5" />
          <rect x="30" y="38" width="6" height="4" />
        </g>

        {/* White Accent Highlight Pixels at Center Core */}
        <g fill="#FFFFFF">
          <rect x="48" y="40" width="4" height="4" />
          <rect x="50" y="36" width="3" height="4" />
          <rect x="46" y="44" width="4" height="3" />
          <rect x="54" y="42" width="3" height="4" />
        </g>
      </svg>

      {/* Brand Logotype */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontFamily: "'Space Grotesk', monospace",
              fontWeight: 900,
              fontSize: `${Math.round(size * 0.52)}px`,
              letterSpacing: '-0.5px',
              color: '#FFFFFF'
            }}>
              MIDAS
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#0A0910',
              backgroundColor: '#C6FF33',
              padding: '1px 6px',
              borderRadius: '4px',
              letterSpacing: '0.5px'
            }}>
              2026
            </span>
          </div>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            color: '#7D39EB',
            letterSpacing: '1.2px',
            textTransform: 'uppercase'
          }}>
            Fintech Club
          </span>
        </div>
      )}
    </div>
  );
};

export default PixelStarburstLogo;
