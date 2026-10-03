import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, className, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      {label && <label style={{ fontWeight: 'bold' }}>{label}</label>}
      <input
        style={{
          padding: '12px',
          border: 'var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          fontSize: '16px',
          outline: 'none',
          backgroundColor: 'var(--surface)',
          ...style
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--error)', fontSize: '14px', fontWeight: 'bold' }}>{error}</span>}
    </div>
  );
};
