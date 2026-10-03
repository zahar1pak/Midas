import React from 'react';
import { PixelCrown, PixelJester } from '../ui/PixelIcons';

interface RankingCardProps {
  name: string;
  avatar?: string;
  income?: number;
  expenses?: number;
  rank: number;
  isKing: boolean;
  isJester: boolean;
  showIncome?: boolean;
  showExpenses?: boolean;
  onClick?: () => void;
}

const RankingCard: React.FC<RankingCardProps> = ({
  name,
  avatar,
  income,
  expenses,
  rank,
  isKing,
  isJester,
  showIncome = true,
  showExpenses = true,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="fintech-card p-3.5 sm:p-5 flex items-center justify-between hover:border-[#C6FF33]/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Rank Badge */}
        <div className={`text-base sm:text-lg font-black w-6 text-center ${
          rank === 1 ? 'text-[#C6FF33]' : 'text-[#8E8A9E]'
        }`}>
          #{rank}
        </div>

        {/* Avatar with Legend / Spender border */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0">
          <div className={`w-full h-full rounded-full p-[2px] flex items-center justify-center ${
            isKing
              ? 'bg-gradient-to-tr from-[#FFA012] to-[#FFD700] shadow-[0_0_14px_rgba(255,160,18,0.45)]'
              : isJester
              ? 'bg-gradient-to-tr from-[#FF453A] to-[#7D39EB] shadow-[0_0_14px_rgba(255,69,58,0.45)]'
              : 'bg-white/10'
          }`}>
            <div className="w-full h-full rounded-full bg-[#13111C] flex items-center justify-center text-lg font-black text-white overflow-hidden">
              {avatar && (avatar.startsWith('data:image') || avatar.startsWith('http')) ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                avatar || name.charAt(0)
              )}
            </div>
          </div>

          {/* Badges in upper right corner */}
          <div className="absolute -top-2 -right-2 flex gap-1">
            {isKing && (
              <div title="Легенда доходов" className="drop-shadow-md">
                <PixelCrown size={22} color="#FFA012" />
              </div>
            )}
            {isJester && !isKing && (
              <div title="Транжира расходов" className="drop-shadow-md">
                <PixelJester size={22} color="#FF453A" />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <span>{name}</span>
            {isKing && (
              <span className="text-[10px] font-black uppercase text-[#FFA012] bg-[#FFA012]/15 px-2 py-0.5 rounded-full border border-[#FFA012]/30">
                Легенда
              </span>
            )}
            {isJester && !isKing && (
              <span className="text-[10px] font-black uppercase text-[#FF453A] bg-[#FF453A]/15 px-2 py-0.5 rounded-full border border-[#FF453A]/30">
                Транжира
              </span>
            )}
          </div>
          
          {/* Income & Expenses with Privacy Masking */}
          <div className="flex gap-3 mt-1">
            <span className="text-xs font-bold text-[#32D74B]">
              {showIncome && income !== undefined ? `+${income.toLocaleString('ru-RU')} ₽` : '*** ₽'}
            </span>
            <span className="text-xs font-bold text-[#FF453A]">
              {showExpenses && expenses !== undefined ? `-${expenses.toLocaleString('ru-RU')} ₽` : '*** ₽'}
            </span>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex items-center">
        {isKing && (
          <span className="text-xs font-extrabold text-[#FFA012] bg-[#FFA012]/10 border border-[#FFA012]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <PixelCrown size={16} color="#FFA012" /> Топ доход
          </span>
        )}
        {!isKing && isJester && (
          <span className="text-xs font-extrabold text-[#FF453A] bg-[#FF453A]/10 border border-[#FF453A]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <PixelJester size={16} color="#FF453A" /> Топ траты
          </span>
        )}
      </div>
    </div>
  );
};

export default RankingCard;
