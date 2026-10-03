import React, { useState } from 'react';

interface AdviceCardProps {
  advice: string;
  onDismiss?: () => void;
}

export const AdviceCard: React.FC<AdviceCardProps> = ({ advice, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="relative p-4 mb-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center font-bold bg-gray-200 border-2 border-black rounded-full hover:bg-red-400 active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        aria-label="Dismiss"
      >
        ✕
      </button>
      <div className="pr-8 text-black font-medium leading-relaxed">
        {advice}
      </div>
    </div>
  );
};
