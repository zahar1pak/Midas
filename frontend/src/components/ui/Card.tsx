import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: 'var(--border)',
        boxShadow: 'var(--shadow)',
        borderRadius: 'var(--radius)',
        padding: '16px',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
