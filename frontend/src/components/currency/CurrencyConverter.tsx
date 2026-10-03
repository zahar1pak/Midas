import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';

export const CurrencyConverter: React.FC = () => {
  const { supported, convertAmount, loading } = useCurrency();
  const [amount, setAmount] = useState<string>('100');
  const [from, setFrom] = useState<string>('USD');
  const [to, setTo] = useState<string>('RUB');
  const [result, setResult] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const allCurrencies = [...(supported.fiat || []), ...(supported.crypto || [])];

  useEffect(() => {
    if (allCurrencies.length > 0 && (!allCurrencies.includes(from) || !allCurrencies.includes(to))) {
       if (supported.fiat?.includes('USD')) setFrom('USD');
       if (supported.fiat?.includes('RUB')) setTo('RUB');
    }
  }, [supported]);

  useEffect(() => {
    const handleConvert = async () => {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setResult(null);
        return;
      }
      setIsConverting(true);
      const res = await convertAmount(numAmount, from, to);
      setResult(res);
      setIsConverting(false);
    };

    const debounce = setTimeout(() => {
      handleConvert();
    }, 500);

    return () => clearTimeout(debounce);
  }, [amount, from, to]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  if (loading && allCurrencies.length === 0) {
    return <div className="p-4 bg-white border-2 border-black rounded-xl text-center">Загрузка валют... 💸</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-black mb-4 uppercase flex items-center gap-2">
        <span>🔄</span> Конвертер
      </h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-2/3 p-3 text-lg font-bold border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            placeholder="Сумма"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-1/3 p-3 font-bold uppercase border-2 border-black rounded-lg bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          >
            {allCurrencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <button 
            onClick={handleSwap}
            className="w-10 h-10 flex items-center justify-center bg-accent border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-110 active:scale-95 transition-transform"
          >
            ⇅
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2/3 p-3 text-lg font-bold border-2 border-black rounded-lg bg-gray-50 shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)] truncate">
            {isConverting ? '...' : result !== null ? result.toLocaleString('ru-RU', {maximumFractionDigits: 6}) : '0'}
          </div>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-1/3 p-3 font-bold uppercase border-2 border-black rounded-lg bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          >
            {allCurrencies.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
