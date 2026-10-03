import React from 'react';

interface PixelIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const PixelCart: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="2" width="3" height="2" fill={color} />
    <rect x="3" y="4" width="2" height="6" fill={color} />
    <rect x="5" y="4" width="9" height="2" fill={color} />
    <rect x="5" y="8" width="8" height="2" fill={color} />
    <rect x="12" y="5" width="2" height="4" fill={color} />
    <rect x="5" y="10" width="7" height="2" fill={color} />
    <rect x="5" y="12" width="2" height="2" fill="#FFFFFF" />
    <rect x="10" y="12" width="2" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelBurger: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="8" height="2" fill={color} />
    <rect x="2" y="4" width="12" height="2" fill={color} />
    <rect x="5" y="3" width="1" height="1" fill="#FFFFFF" />
    <rect x="9" y="3" width="1" height="1" fill="#FFFFFF" />
    <rect x="1" y="7" width="14" height="2" fill="#32D74B" />
    <rect x="2" y="9" width="12" height="2" fill="#7D39EB" />
    <rect x="3" y="10" width="4" height="2" fill={color} />
    <rect x="2" y="12" width="12" height="2" fill={color} />
  </svg>
);

export const PixelCar: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="3" width="7" height="2" fill={color} />
    <rect x="2" y="5" width="11" height="2" fill={color} />
    <rect x="4" y="5" width="3" height="2" fill="#0A0910" />
    <rect x="8" y="5" width="3" height="2" fill="#0A0910" />
    <rect x="1" y="7" width="14" height="4" fill={color} />
    <rect x="3" y="11" width="3" height="3" fill="#FFFFFF" />
    <rect x="10" y="11" width="3" height="3" fill="#FFFFFF" />
  </svg>
);

export const PixelGamepad: React.FC<PixelIconProps> = ({ size = 20, color = '#7D39EB' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="12" height="6" fill={color} />
    <rect x="1" y="7" width="3" height="6" fill={color} />
    <rect x="12" y="7" width="3" height="6" fill={color} />
    <rect x="4" y="6" width="3" height="1" fill="#FFFFFF" />
    <rect x="5" y="5" width="1" height="3" fill="#FFFFFF" />
    <rect x="10" y="5" width="2" height="2" fill="#C6FF33" />
    <rect x="12" y="7" width="2" height="2" fill="#C6FF33" />
  </svg>
);

export const PixelMoney: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="4" width="14" height="8" fill={color} />
    <rect x="2" y="5" width="12" height="6" fill="#0A0910" />
    <rect x="6" y="6" width="4" height="4" fill={color} />
    <rect x="7" y="7" width="2" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelLaptop: React.FC<PixelIconProps> = ({ size = 20, color = '#7D39EB' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="10" height="7" fill={color} />
    <rect x="4" y="4" width="8" height="5" fill="#0A0910" />
    <rect x="7" y="6" width="2" height="1" fill="#C6FF33" />
    <rect x="1" y="11" width="14" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelTshirt: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="8" height="2" fill={color} />
    <rect x="1" y="4" width="14" height="4" fill={color} />
    <rect x="3" y="8" width="10" height="6" fill={color} />
    <rect x="6" y="2" width="4" height="2" fill="#0A0910" />
  </svg>
);

export const PixelBell: React.FC<PixelIconProps> = ({ size = 20, color = '#7D39EB' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="2" width="2" height="2" fill={color} />
    <rect x="5" y="4" width="6" height="5" fill={color} />
    <rect x="3" y="9" width="10" height="3" fill={color} />
    <rect x="2" y="12" width="12" height="2" fill={color} />
    <rect x="7" y="14" width="2" height="2" fill="#C6FF33" />
  </svg>
);

export const PixelCrown: React.FC<PixelIconProps> = ({ size = 20, color = '#FFA012' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="19" width="18" height="3" rx="1.5" fill={color} />
    <path d="M4 17L2 7L7.5 11.5L12 3.5L16.5 11.5L22 7L20 17H4Z" fill={color} />
    <circle cx="2" cy="7" r="2.2" fill={color} />
    <circle cx="12" cy="3.5" r="2.4" fill={color} />
    <circle cx="22" cy="7" r="2.2" fill={color} />
  </svg>
);

// Exact 3-horned Jester Cap from user reference (media_1791025510148.jpg)
export const PixelJester: React.FC<PixelIconProps> = ({ size = 26, color = '#E61E38' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Curved base band */}
    <path
      d="M32 64C42 71 58 71 68 64C65 72 55 77 35 71C33 70 32 67 32 64Z"
      fill={color}
    />
    
    {/* Main Cap & Organic Flowing Horns */}
    <path
      d="M34 62C33 52 24 38 18 48C16 52 19 45 22 36C28 27 41 29 44 42C48 24 54 18 70 27C80 33 77 45 69 49C74 44 83 48 82 60C81 68 73 70 65 62C58 64 42 64 34 62Z"
      fill={color}
    />
    
    {/* Left Drooping Horn Tip - 5-point star */}
    <polygon
      points="17,47 18.5,50 22,50.5 19.5,53 20,56.5 17,55 14,56.5 14.5,53 12,50.5 15.5,50"
      fill={color}
    />

    {/* Center High Horn Tip - 5-point star */}
    <polygon
      points="70,30 71.5,33 75,33.5 72.5,36 73,39.5 70,38 67,39.5 67.5,36 65,33.5 68.5,33"
      fill={color}
    />

    {/* Right Lower Horn Tip - 5-point star */}
    <polygon
      points="78,65 79.5,68 83,68.5 80.5,71 81,74.5 78,73 75,74.5 75.5,71 73,68.5 76.5,68"
      fill={color}
    />
  </svg>
);

export const PixelLevelUp: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <div className={`inline-flex items-center select-none ${className}`}>
    <div style={{
      fontFamily: "'Space Grotesk', monospace",
      fontWeight: 900,
      fontSize: `${size * 0.45}px`,
      letterSpacing: '1px',
      color: '#FFFFFF',
      textShadow: '2px 0px 0px #00F0FF, -2px 0px 0px #FF007A',
      background: '#0A0910',
      border: '2px solid #C6FF33',
      padding: '2px 8px',
      borderRadius: '6px',
      boxShadow: '0 0 12px rgba(198, 255, 51, 0.4)'
    }}>
      LEVEL UP ⚡
    </div>
  </div>
);

export const PixelCoin: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="1" width="8" height="2" fill={color} />
    <rect x="2" y="3" width="12" height="2" fill={color} />
    <rect x="1" y="5" width="14" height="6" fill={color} />
    <rect x="2" y="11" width="12" height="2" fill={color} />
    <rect x="4" y="13" width="8" height="2" fill={color} />
    <rect x="7" y="4" width="2" height="8" fill="#0A0910" />
    <rect x="5" y="6" width="6" height="2" fill="#0A0910" />
    <rect x="5" y="9" width="6" height="2" fill="#0A0910" />
  </svg>
);

export const PixelDiamond: React.FC<PixelIconProps> = ({ size = 20, color = '#60A5FA' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="6" height="2" fill={color} />
    <rect x="3" y="4" width="10" height="2" fill={color} />
    <rect x="1" y="6" width="14" height="2" fill={color} />
    <rect x="3" y="8" width="10" height="2" fill={color} />
    <rect x="5" y="10" width="6" height="2" fill={color} />
    <rect x="7" y="12" width="2" height="2" fill={color} />
    <rect x="6" y="5" width="4" height="2" fill="#FFFFFF" />
  </svg>
);

// Quick Access Navigation Icons
export const PixelStatsIcon: React.FC<PixelIconProps> = ({ size = 20, color = '#C6FF33' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="3" height="5" fill={color} />
    <rect x="6" y="6" width="3" height="9" fill={color} />
    <rect x="10" y="2" width="3" height="13" fill={color} />
    <rect x="1" y="14" width="14" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelFriendsIcon: React.FC<PixelIconProps> = ({ size = 20, color = '#7D39EB' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="4" height="4" fill={color} />
    <rect x="2" y="7" width="6" height="6" fill={color} />
    <rect x="9" y="3" width="4" height="4" fill="#C6FF33" />
    <rect x="8" y="8" width="6" height="5" fill="#C6FF33" />
  </svg>
);

// Pixel Crypto Logos
export const PixelBtcLogo: React.FC<PixelIconProps> = ({ size = 22, color = '#F7931A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill={color} />
    {/* Pixelized B */}
    <rect x="8" y="5" width="2" height="14" fill="#FFFFFF" />
    <rect x="10" y="6" width="5" height="2" fill="#FFFFFF" />
    <rect x="14" y="8" width="2" height="2" fill="#FFFFFF" />
    <rect x="10" y="10" width="4" height="2" fill="#FFFFFF" />
    <rect x="15" y="12" width="2" height="3" fill="#FFFFFF" />
    <rect x="10" y="15" width="5" height="2" fill="#FFFFFF" />
    <rect x="10" y="4" width="1" height="2" fill="#FFFFFF" />
    <rect x="13" y="4" width="1" height="2" fill="#FFFFFF" />
    <rect x="10" y="17" width="1" height="2" fill="#FFFFFF" />
    <rect x="13" y="17" width="1" height="2" fill="#FFFFFF" />
  </svg>
);

export const PixelEthLogo: React.FC<PixelIconProps> = ({ size = 22, color = '#627EEA' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#1B1C28" stroke={color} strokeWidth="1.5" />
    <path d="M12 4L6 12L12 15L18 12L12 4Z" fill={color} />
    <path d="M12 16L6 13L12 20L18 13L12 16Z" fill="#889DF7" />
  </svg>
);

export const PixelTonLogo: React.FC<PixelIconProps> = ({ size = 22, color = '#0098EA' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M12 5L5 10L12 19L19 10L12 5Z" fill="#FFFFFF" />
    <path d="M12 8L8 11L12 17L16 11L12 8Z" fill={color} />
  </svg>
);

export const PixelUsdtLogo: React.FC<PixelIconProps> = ({ size = 22, color = '#26A17B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill={color} />
    <rect x="6" y="8" width="12" height="2.5" fill="#FFFFFF" />
    <rect x="11" y="8" width="2" height="9" fill="#FFFFFF" />
    <path d="M7 12C7 14 9.2 15 12 15C14.8 15 17 14 17 12" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

export const PixelSolLogo: React.FC<PixelIconProps> = ({ size = 22, color = '#14F195' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="11" fill="#0A0910" stroke="#9945FF" strokeWidth="1.5" />
    <rect x="6" y="6" width="12" height="2" rx="1" fill={color} />
    <rect x="6" y="11" width="12" height="2" rx="1" fill="#9945FF" />
    <rect x="6" y="16" width="12" height="2" rx="1" fill={color} />
  </svg>
);

export const getCryptoPixelLogo = (symbol: string, size = 24) => {
  const s = symbol.toUpperCase();
  if (s.includes('BTC')) return <PixelBtcLogo size={size} />;
  if (s.includes('ETH')) return <PixelEthLogo size={size} />;
  if (s.includes('TON')) return <PixelTonLogo size={size} />;
  if (s.includes('USDT')) return <PixelUsdtLogo size={size} />;
  if (s.includes('SOL')) return <PixelSolLogo size={size} />;
  return <PixelDiamond size={size} color="#C6FF33" />;
};

export const PixelPiggyBank: React.FC<PixelIconProps> = ({ size = 20, color = '#7D39EB' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="2" width="7" height="2" fill={color} />
    <rect x="2" y="4" width="11" height="7" fill={color} />
    <rect x="1" y="6" width="2" height="3" fill={color} />
    <rect x="13" y="6" width="2" height="3" fill={color} />
    <rect x="6" y="3" width="3" height="1" fill="#FFFFFF" />
    <rect x="4" y="5" width="2" height="2" fill="#0A0910" />
    <rect x="3" y="11" width="3" height="3" fill="#FFFFFF" />
    <rect x="10" y="11" width="3" height="3" fill="#FFFFFF" />
  </svg>
);

export const getCategoryPixelIcon = (catName: string, size = 20) => {
  const c = catName.toLowerCase();
  if (c.includes('копилк') || c.includes('накоплен') || c.includes('отложил') || c.includes('заначк')) return <PixelPiggyBank size={size} color="#7D39EB" />;
  if (c.includes('супермаркет') || c.includes('продукт')) return <PixelCart size={size} color="#C6FF33" />;
  if (c.includes('еда') || c.includes('кафе') || c.includes('бургер') || c.includes('ресторан')) return <PixelBurger size={size} color="#C6FF33" />;
  if (c.includes('транспорт') || c.includes('такси')) return <PixelCar size={size} color="#7D39EB" />;
  if (c.includes('развлечен') || c.includes('игр') || c.includes('steam')) return <PixelGamepad size={size} color="#7D39EB" />;
  if (c.includes('одежд') || c.includes('шмот')) return <PixelTshirt size={size} color="#C6FF33" />;
  if (c.includes('подписк') || c.includes('музык')) return <PixelBell size={size} color="#7D39EB" />;
  if (c.includes('зарплат') || c.includes('зп') || c.includes('степух')) return <PixelMoney size={size} color="#C6FF33" />;
  if (c.includes('фриланс') || c.includes('шабашк')) return <PixelLaptop size={size} color="#7D39EB" />;
  return <PixelCoin size={size} color="#C6FF33" />;
};
