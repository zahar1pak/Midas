import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', style, ...props }) => {
  const getVariantStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '12px 24px',
      borderRadius: 'var(--radius)',
      border: 'var(--border)',
      boxShadow: 'var(--shadow)',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.1s ease, box-shadow 0.1s ease',
      fontSize: '16px',
    };

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: 'var(--primary)', color: 'white' };
      case 'accent':
        return { ...base, backgroundColor: 'var(--accent)', color: 'black' };
      case 'outline':
        return { ...base, backgroundColor: 'transparent', color: 'var(--text)' };
      case 'ghost':
        return { ...base, border: 'none', boxShadow: 'none', backgroundColor: 'transparent' };
      default:
        return base;
    }
  };

  return (
    <button
      style={{ ...getVariantStyles(), ...style }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translate(2px, 2px)';
        e.currentTarget.style.boxShadow = '2px 2px 0px #000';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
      {...props}
    />
  );
};
