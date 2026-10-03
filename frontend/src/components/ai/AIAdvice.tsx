import React, { useState, useEffect } from 'react';
import { AdviceCard } from './AdviceCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AIAdvice: React.FC = () => {
  const [advices, setAdvices] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ai/advice`);
      if (res.ok) {
        const data = await res.json();
        setAdvices(data.tips || []);
      }
    } catch (err) {
      console.error("Failed to fetch advice", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold uppercase border-b-4 border-black pb-1">AI Советы 🧠</h2>
        <button 
          onClick={fetchAdvice}
          disabled={loading}
          className="px-4 py-2 bg-accent font-bold border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none hover:bg-lime-400 transition-all disabled:opacity-50"
        >
          {loading ? 'Секунду...' : 'Обновить'}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-24 bg-gray-300 border-2 border-black rounded-xl w-full"></div>
          <div className="h-24 bg-gray-300 border-2 border-black rounded-xl w-full"></div>
        </div>
      ) : advices.length > 0 ? (
        advices.map((advice, idx) => (
          <AdviceCard key={idx} advice={advice} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-4">
          <div className="text-6xl">🐱</div>
          <p className="font-bold text-lg">
            Тут пока пусто, как карманы после пятницы
          </p>
          <p className="text-sm text-gray-600">
            Добавь пару транзакций, чтобы я мог дать тебе советы.
          </p>
        </div>
      )}
    </div>
  );
};
