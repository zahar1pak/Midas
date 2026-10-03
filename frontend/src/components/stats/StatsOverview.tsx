import React, { useState } from 'react';
import RubberSegment from '../ui/RubberSegment';
import Counter from '../ui/Counter';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Calendar } from 'lucide-react';
import { PixelPiggyBank } from '../ui/PixelIcons';
import { useTransactionsStore } from '../../store/useTransactionsStore';

const StatsOverview: React.FC = () => {
  const [period, setPeriod] = useState('Месяц');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const transactions = useTransactionsStore((state) => state.transactions);

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Filter transactions according to selected period or custom dates
  const { currentIncome, currentExpense, currentSaving } = React.useMemo(() => {
    let relevant = transactions;

    if (isCustomMode && (customStart || customEnd)) {
      const startMs = customStart ? new Date(customStart).getTime() : 0;
      const endMs = customEnd ? new Date(customEnd).getTime() + dayMs : Infinity;
      relevant = transactions.filter((t) => {
        const time = t.timestamp || 0;
        return time >= startMs && time <= endMs;
      });
    } else {
      let cutoff = 0;
      if (period === 'День') cutoff = now - dayMs;
      else if (period === 'Неделя') cutoff = now - (7 * dayMs);
      else if (period === 'Месяц') cutoff = now - (30 * dayMs);
      else if (period === 'Год') cutoff = now - (365 * dayMs);

      relevant = transactions.filter((t) => {
        if (!t.timestamp) return true;
        return t.timestamp >= cutoff;
      });
    }

    const income = relevant
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = relevant
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const saving = relevant
      .filter((t) => t.type === 'saving')
      .reduce((sum, t) => sum + t.amount, 0);

    return { currentIncome: income, currentExpense: expense, currentSaving: saving };
  }, [transactions, period, isCustomMode, customStart, customEnd, now, dayMs]);

  const currentBalance = currentIncome - currentExpense;

  return (
    <div className="fintech-card p-4 sm:p-5 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-black uppercase text-white tracking-wider m-0">
            Финансовая сводка 📊
          </h2>
          <div className="text-xs text-[#8E8A9E] font-medium mt-0.5">
            Синхронизировано с историей транзакций
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isCustomMode && (
            <RubberSegment
              items={['День', 'Неделя', 'Месяц', 'Год']}
              value={period}
              onChange={(val) => setPeriod(val)}
              trackColor="#0A0910"
              thumbColor="#C6FF33"
              textColor="#8E8A9E"
              activeTextColor="#0A0910"
              size="sm"
              radius={9999}
              inset={2}
              stretch={45}
              squash={2}
              speed={0.85}
            />
          )}

          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
              isCustomMode
                ? 'bg-[#C6FF33] text-[#0A0910]'
                : 'bg-white/5 border border-white/10 text-[#8E8A9E] hover:text-white'
            }`}
            title="Выбрать свой промежуток времени"
          >
            <Calendar size={13} />
            <span>{isCustomMode ? 'Свой период ✓' : 'Свой период'}</span>
          </button>
        </div>
      </div>

      {/* Custom Date Pickers Drawer */}
      {isCustomMode && (
        <div className="mb-4 p-3 bg-white/[0.02] border border-white/10 rounded-xl flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8E8A9E]">От:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="fintech-input py-1 px-2.5 text-xs text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8E8A9E]">До:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="fintech-input py-1 px-2.5 text-xs text-white"
            />
          </div>
          {(customStart || customEnd) && (
            <button
              onClick={() => { setCustomStart(''); setCustomEnd(''); }}
              className="text-xs font-bold text-[#FF453A] hover:underline"
            >
              Сбросить даты
            </button>
          )}
        </div>
      )}
      
      {/* 3-column stats cards: Доходы, Расходы, Копилка */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#32D74B]/10 border border-[#32D74B]/20 rounded-2xl">
          <div className="text-[11px] font-extrabold text-[#32D74B] flex items-center gap-1 tracking-wider">
            <ArrowDownLeft size={14} /> ДОХОДЫ
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-base font-black text-[#32D74B] leading-none">+</span>
            <Counter
              key={`inc-${period}-${isCustomMode}-${currentIncome}`}
              value={currentIncome}
              fontSize={18}
              textColor="#FFFFFF"
              fontWeight={900}
            />
            <span className="text-xs font-bold text-gray-300 ml-0.5">₽</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#FF453A]/10 border border-[#FF453A]/20 rounded-2xl">
          <div className="text-[11px] font-extrabold text-[#FF453A] flex items-center gap-1 tracking-wider">
            <ArrowUpRight size={14} /> РАСХОДЫ
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-base font-black text-[#FF453A] leading-none">-</span>
            <Counter
              key={`exp-${period}-${isCustomMode}-${currentExpense}`}
              value={currentExpense}
              fontSize={18}
              textColor="#FFFFFF"
              fontWeight={900}
            />
            <span className="text-xs font-bold text-gray-300 ml-0.5">₽</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#7D39EB]/15 border border-[#7D39EB]/30 rounded-2xl">
          <div className="text-[11px] font-extrabold text-[#7D39EB] flex items-center gap-1.5 tracking-wider">
            <PixelPiggyBank size={14} color="#7D39EB" /> В КОПИЛКУ
          </div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-base font-black text-[#7D39EB] leading-none">+</span>
            <Counter
              key={`sav-${period}-${isCustomMode}-${currentSaving}`}
              value={currentSaving}
              fontSize={18}
              textColor="#FFFFFF"
              fontWeight={900}
            />
            <span className="text-xs font-bold text-gray-300 ml-0.5">₽</span>
          </div>
        </div>
      </div>
      
      {/* Total Balance Ribbon */}
      <div className="mt-3.5 p-3.5 sm:p-4 bg-[#181E11] border border-[#C6FF33]/25 rounded-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-[#C6FF33]" />
          <span className="text-xs sm:text-sm font-extrabold text-white">
            Чистый профит ({isCustomMode ? 'Выбранный период' : period})
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-base font-black leading-none ${currentBalance >= 0 ? 'text-[#C6FF33]' : 'text-[#FF453A]'}`}>
            {currentBalance >= 0 ? '+' : '-'}
          </span>
          <Counter
            key={`bal-${period}-${isCustomMode}-${currentBalance}`}
            value={Math.abs(currentBalance)}
            fontSize={19}
            textColor={currentBalance >= 0 ? '#C6FF33' : '#FF453A'}
            fontWeight={900}
          />
          <span className="text-sm font-black text-[#C6FF33] ml-0.5">₽</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
