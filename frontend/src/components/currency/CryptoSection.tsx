import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { getCryptoPixelLogo } from '../ui/PixelIcons';

export const CryptoSection: React.FC = () => {
  const { cryptoRates, loading } = useCurrency();

  const cryptoList = Object.entries(cryptoRates).map(([symbol, price]) => ({
    symbol,
    price,
    change: (Math.random() * 8 - 3).toFixed(2)
  }));

  if (loading && cryptoList.length === 0) {
    return (
      <div className="fintech-card p-4 animate-pulse">
        <h3 className="text-sm font-black mb-3 text-white uppercase">Крипто Котировки ⚡</h3>
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-white/[0.03] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fintech-card p-4 sm:p-5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="text-sm font-black uppercase text-white tracking-wider m-0 flex items-center gap-2">
          <span>Крипто Котировки</span>
        </h3>
        <span className="text-[11px] font-extrabold text-[#C6FF33] bg-[#C6FF33]/15 px-2.5 py-0.5 rounded-full border border-[#C6FF33]/30">
          USD
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {cryptoList.map((coin) => {
          const isUp = parseFloat(coin.change) >= 0;
          return (
            <div 
              key={coin.symbol} 
              className="flex justify-between items-center p-2.5 sm:p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:border-white/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {getCryptoPixelLogo(coin.symbol, 24)}
                </div>
                <div>
                  <div className="text-sm font-black text-white">
                    {coin.symbol}
                  </div>
                  <div className="text-[11px] text-[#8E8A9E] font-semibold">
                    {coin.symbol === 'BTC' ? 'Bitcoin' : coin.symbol === 'ETH' ? 'Ethereum' : coin.symbol === 'TON' ? 'Toncoin' : coin.symbol === 'SOL' ? 'Solana' : 'Tether'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm sm:text-base font-black text-white font-mono">
                  ${coin.price.toLocaleString('en-US', { maximumFractionDigits: coin.price > 1 ? 2 : 4 })}
                </div>
                <div className={`text-[11px] font-extrabold ${isUp ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
                  {isUp ? '↑ +' : '↓ '}{coin.change}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
