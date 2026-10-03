import React from 'react';

export const FloatingBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    >
      {/* Radial Atmospheric Neon Glows (Violet #7D39EB and Lime #C6FF33) */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '650px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(125, 57, 235, 0.22) 0%, rgba(198, 255, 51, 0.08) 50%, transparent 75%)',
        filter: 'blur(60px)',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '500px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(125, 57, 235, 0.15) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }} />

      {/* Floating Pixel Coin 1: Gold / Lime Dollar Coin (Top Left) */}
      <div className="floating-coin-1" style={{ position: 'absolute', top: '12%', left: '8%', opacity: 0.75 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 14px rgba(198, 255, 51, 0.4))' }}>
          <rect x="6" y="2" width="12" height="3" fill="#C6FF33" />
          <rect x="3" y="5" width="18" height="3" fill="#C6FF33" />
          <rect x="2" y="8" width="20" height="8" fill="#C6FF33" />
          <rect x="3" y="16" width="18" height="3" fill="#C6FF33" />
          <rect x="6" y="19" width="12" height="3" fill="#C6FF33" />
          {/* Inner Coin Rim */}
          <rect x="5" y="5" width="14" height="14" fill="#0A0910" />
          {/* Dollar Sign */}
          <rect x="11" y="6" width="2" height="12" fill="#C6FF33" />
          <rect x="9" y="8" width="6" height="2" fill="#C6FF33" />
          <rect x="8" y="9" width="2" height="2" fill="#C6FF33" />
          <rect x="9" y="11" width="6" height="2" fill="#C6FF33" />
          <rect x="14" y="13" width="2" height="2" fill="#C6FF33" />
          <rect x="9" y="14" width="6" height="2" fill="#C6FF33" />
        </svg>
      </div>

      {/* Floating Pixel Coin 2: TON Blue / Violet Diamond Coin (Top Right) */}
      <div className="floating-coin-2" style={{ position: 'absolute', top: '22%', right: '10%', opacity: 0.7 }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 16px rgba(125, 57, 235, 0.5))' }}>
          <rect x="6" y="2" width="12" height="20" fill="#7D39EB" />
          <rect x="3" y="5" width="18" height="14" fill="#7D39EB" />
          <rect x="4" y="6" width="16" height="12" fill="#0A0910" />
          {/* Diamond Glyph */}
          <rect x="10" y="8" width="4" height="2" fill="#60A5FA" />
          <rect x="8" y="10" width="8" height="2" fill="#60A5FA" />
          <rect x="10" y="12" width="4" height="4" fill="#60A5FA" />
        </svg>
      </div>

      {/* Floating Pixel Coin 3: Bitcoin Violet Coin (Bottom Left) */}
      <div className="floating-coin-3" style={{ position: 'absolute', bottom: '25%', left: '6%', opacity: 0.65 }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 14px rgba(198, 255, 51, 0.35))' }}>
          <rect x="6" y="2" width="12" height="20" fill="#C6FF33" />
          <rect x="3" y="5" width="18" height="14" fill="#C6FF33" />
          <rect x="4" y="6" width="16" height="12" fill="#0A0910" />
          {/* B Symbol */}
          <rect x="9" y="8" width="2" height="8" fill="#C6FF33" />
          <rect x="11" y="8" width="3" height="2" fill="#C6FF33" />
          <rect x="11" y="11" width="3" height="2" fill="#C6FF33" />
          <rect x="11" y="14" width="3" height="2" fill="#C6FF33" />
          <rect x="13" y="9" width="2" height="2" fill="#C6FF33" />
          <rect x="13" y="12" width="2" height="2" fill="#C6FF33" />
        </svg>
      </div>

      {/* Scattered Pixel Cubes (Matching Reference 3 & 4) */}
      <div className="pixel-cube-1" style={{ position: 'absolute', top: '35%', left: '16%', width: '10px', height: '10px', backgroundColor: '#C6FF33', opacity: 0.6, boxShadow: '0 0 8px #C6FF33' }} />
      <div className="pixel-cube-2" style={{ position: 'absolute', top: '18%', left: '42%', width: '8px', height: '8px', backgroundColor: '#7D39EB', opacity: 0.7, boxShadow: '0 0 10px #7D39EB' }} />
      <div className="pixel-cube-3" style={{ position: 'absolute', top: '48%', right: '14%', width: '12px', height: '12px', backgroundColor: '#C6FF33', opacity: 0.5, boxShadow: '0 0 8px #C6FF33' }} />
      <div className="pixel-cube-4" style={{ position: 'absolute', bottom: '38%', right: '22%', width: '9px', height: '9px', backgroundColor: '#7D39EB', opacity: 0.6, boxShadow: '0 0 8px #7D39EB' }} />
      <div className="pixel-cube-5" style={{ position: 'absolute', bottom: '15%', left: '30%', width: '7px', height: '7px', backgroundColor: '#FFFFFF', opacity: 0.4 }} />
      <div className="pixel-cube-6" style={{ position: 'absolute', top: '70%', left: '85%', width: '10px', height: '10px', backgroundColor: '#C6FF33', opacity: 0.55, boxShadow: '0 0 8px #C6FF33' }} />
    </div>
  );
};

export default FloatingBackground;
