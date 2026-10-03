import React from 'react';

interface PixelMidasPlanetLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const PixelMidasPlanetLogo: React.FC<PixelMidasPlanetLogoProps> = ({
  size = 40,
  showText = true,
  className = '',
  onClick
}) => {
  return (
    <div
      className={`inline-flex items-center gap-3 select-none cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* 8-bit Pixel Planet Emblem with M & Star Orbit from Reference */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-[0_0_12px_rgba(198,255,51,0.5)]"
      >
        {/* Top-Right 4-Point Pixel Star (Yellow-Lime #C6FF33) */}
        <g fill="#C6FF33">
          <rect x="67" y="11" width="2" height="12" />
          <rect x="62" y="16" width="12" height="2" />
          <rect x="65" y="14" width="6" height="6" />
          <rect x="66" y="15" width="4" height="4" fill="#FFFFFF" />
        </g>

        {/* Orbit Ring (Tilted Oval passing around planet) */}
        {/* Orbit Top-Right Curve */}
        <g fill="#C6FF33">
          <rect x="68" y="27" width="8" height="2" />
          <rect x="75" y="28" width="5" height="3" />
          <rect x="79" y="30" width="3" height="5" />
          <rect x="77" y="34" width="4" height="2" />
          <rect x="70" y="36" width="7" height="2" />
          <rect x="64" y="39" width="7" height="2" />
        </g>

        {/* Orbit Bottom-Left Curve */}
        <g fill="#C6FF33">
          <rect x="23" y="55" width="8" height="3" />
          <rect x="20" y="57" width="5" height="3" />
          <rect x="18" y="60" width="3" height="4" />
          <rect x="21" y="63" width="7" height="3" />
          <rect x="27" y="62" width="8" height="2" />
        </g>

        {/* Planet Circular Outline (White Pixel Arc) */}
        <g fill="#FFFFFF">
          {/* Top Arc */}
          <rect x="42" y="17" width="14" height="2" />
          <rect x="36" y="19" width="7" height="2" />
          <rect x="55" y="19" width="6" height="2" />
          <rect x="31" y="22" width="6" height="2" />
          <rect x="60" y="22" width="5" height="2" />

          {/* Left Upper Arc */}
          <rect x="28" y="25" width="4" height="4" />
          <rect x="26" y="29" width="3" height="6" />

          {/* Right Arc */}
          <rect x="64" y="25" width="3" height="6" />
          <rect x="66" y="31" width="3" height="7" />
          <rect x="66" y="44" width="3" height="8" />
          <rect x="64" y="52" width="3" height="7" />
          <rect x="61" y="58" width="4" height="4" />

          {/* Bottom Arc */}
          <rect x="56" y="61" width="6" height="2" />
          <rect x="48" y="63" width="9" height="2" />
          <rect x="40" y="63" width="9" height="2" />
          <rect x="34" y="60" width="7" height="2" />
          <rect x="30" y="56" width="5" height="3" />
        </g>

        {/* Dither Texture Inside Left Half of Planet */}
        <g fill="#C6FF33">
          <rect x="34" y="30" width="2" height="2" />
          <rect x="38" y="30" width="2" height="2" />
          <rect x="36" y="32" width="2" height="2" />
          <rect x="40" y="32" width="2" height="2" />
          <rect x="34" y="34" width="2" height="2" />
          <rect x="38" y="34" width="2" height="2" />
          <rect x="42" y="34" width="2" height="2" />
          <rect x="32" y="36" width="2" height="2" />
          <rect x="36" y="36" width="2" height="2" />
          <rect x="40" y="36" width="2" height="2" />
          <rect x="44" y="36" width="2" height="2" />

          <rect x="34" y="38" width="2" height="2" />
          <rect x="38" y="38" width="2" height="2" />
          <rect x="42" y="38" width="2" height="2" />
          <rect x="32" y="40" width="2" height="2" />
          <rect x="36" y="40" width="2" height="2" />
          <rect x="40" y="40" width="2" height="2" />
          <rect x="44" y="40" width="2" height="2" />

          <rect x="34" y="42" width="2" height="2" />
          <rect x="38" y="42" width="2" height="2" />
          <rect x="42" y="42" width="2" height="2" />
          <rect x="36" y="44" width="2" height="2" />
          <rect x="40" y="44" width="2" height="2" />
          <rect x="44" y="44" width="2" height="2" />

          <rect x="38" y="46" width="2" height="2" />
          <rect x="42" y="46" width="2" height="2" />
          <rect x="36" y="48" width="2" height="2" />
          <rect x="40" y="48" width="2" height="2" />
          <rect x="44" y="48" width="2" height="2" />

          <rect x="38" y="50" width="2" height="2" />
          <rect x="42" y="50" width="2" height="2" />
          <rect x="40" y="52" width="2" height="2" />
          <rect x="44" y="52" width="2" height="2" />
        </g>

        {/* Scattered Pixel Particles Dispersing to the Left */}
        <g fill="#C6FF33">
          <rect x="18" y="38" width="2" height="2" />
          <rect x="14" y="42" width="3" height="3" />
          <rect x="20" y="40" width="3" height="3" />
          <rect x="23" y="36" width="2" height="2" />
          <rect x="17" y="45" width="2" height="2" />
          <rect x="21" y="44" width="3" height="3" />
          <rect x="25" y="42" width="3" height="3" />
          <rect x="28" y="39" width="3" height="3" />
          <rect x="24" y="47" width="2" height="2" />
          <rect x="28" y="46" width="3" height="3" />
        </g>

        {/* Prominent Pixel 'M' Letter in the Center (Solid Lime #C6FF33) */}
        <g fill="#C6FF33">
          {/* Left Vertical Leg of M */}
          <rect x="43" y="30" width="4" height="23" />
          <rect x="41" y="32" width="2" height="19" />

          {/* Diagonal Slants V-Center */}
          <rect x="47" y="33" width="3" height="5" />
          <rect x="50" y="37" width="3" height="6" />
          <rect x="53" y="33" width="3" height="5" />

          {/* Right Vertical Leg of M */}
          <rect x="56" y="27" width="4" height="26" />
          <rect x="60" y="30" width="2" height="20" />
        </g>
      </svg>

      {/* Futuristic 8-Bit Pixel Font Typography matching reference: "MIDAS" */}
      {showText && (
        <div className="flex flex-col">
          {/* Pixelated MIDAS Wordmark built with pixel letterforms */}
          <div className="flex items-center gap-1.5">
            <svg height={Math.round(size * 0.44)} viewBox="0 0 140 24" fill="none" className="overflow-visible">
              {/* M */}
              <g fill="#FFFFFF">
                <rect x="0" y="0" width="4" height="24" />
                <rect x="4" y="4" width="4" height="6" />
                <rect x="8" y="8" width="4" height="6" />
                <rect x="12" y="4" width="4" height="6" />
                <rect x="16" y="0" width="4" height="24" />
              </g>

              {/* I */}
              <g fill="#FFFFFF">
                <rect x="26" y="0" width="6" height="24" />
              </g>

              {/* D */}
              <g fill="#FFFFFF">
                <rect x="38" y="0" width="5" height="24" />
                <rect x="43" y="0" width="10" height="4" />
                <rect x="43" y="20" width="10" height="4" />
                <rect x="53" y="4" width="5" height="16" />
              </g>

              {/* A */}
              <g fill="#FFFFFF">
                <rect x="65" y="4" width="5" height="20" />
                <rect x="70" y="0" width="10" height="4" />
                <rect x="80" y="4" width="5" height="20" />
                <rect x="70" y="11" width="10" height="4" />
              </g>

              {/* S (Unique angular 8-bit S from reference) */}
              <g fill="#FFFFFF">
                <rect x="92" y="0" width="18" height="4" />
                <rect x="92" y="4" width="5" height="7" />
                <rect x="92" y="10" width="18" height="4" />
                <rect x="105" y="14" width="5" height="7" />
                <rect x="92" y="20" width="18" height="4" />
              </g>
            </svg>
          </div>

          <div className="text-[9px] font-extrabold text-[#8E8A9E] tracking-[1.5px] uppercase mt-0.5">
            Учет без запары
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelMidasPlanetLogo;
