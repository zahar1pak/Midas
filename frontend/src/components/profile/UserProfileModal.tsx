import React from 'react';
import { X, Trophy, Shield, Calendar, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { PixelCrown, PixelJester } from '../ui/PixelIcons';

export interface UserProfileData {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  tags?: string[];
  rank?: number;
  isLegend?: boolean;
  isSpender?: boolean;
  income?: number;
  expenses?: number;
  joinedDate?: string;
  bio?: string;
  showIncome?: boolean;
  showExpenses?: boolean;
}

interface UserProfileModalProps {
  user: UserProfileData | null;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose }) => {
  if (!user) return null;

  const showInc = user.showIncome !== false;
  const showExp = user.showExpenses !== false;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="fintech-card w-full max-w-sm p-6 bg-[#13111C] border-[#C6FF33]/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8E8A9E] hover:text-white p-1 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Avatar & Title */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="relative w-20 h-20 mb-3">
            <div className={`w-full h-full rounded-full p-[3px] flex items-center justify-center ${
              user.isLegend
                ? 'bg-gradient-to-tr from-[#FFA012] to-[#FFD700] shadow-[0_0_20px_rgba(255,160,18,0.4)]'
                : user.isSpender
                ? 'bg-gradient-to-tr from-[#FF453A] to-[#7D39EB] shadow-[0_0_20px_rgba(255,69,58,0.4)]'
                : 'bg-white/10'
            }`}>
              <div className="w-full h-full rounded-full bg-[#0A0910] flex items-center justify-center text-3xl font-black text-white overflow-hidden">
                {user.avatar && (user.avatar.startsWith('data:image') || user.avatar.startsWith('http')) ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.avatar || user.name.charAt(0)}</span>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="absolute -top-2 -right-2">
              {user.isLegend && <PixelCrown size={26} color="#FFA012" />}
              {user.isSpender && !user.isLegend && <PixelJester size={26} color="#FF453A" />}
            </div>
          </div>

          <h3 className="text-xl font-black text-white m-0">
            {user.name}
          </h3>
          <div className="text-xs text-[#8E8A9E] font-semibold mt-0.5">
            @{user.username}
          </div>

          {/* Badges Pill */}
          <div className="flex items-center gap-2 mt-2">
            {user.isLegend && (
              <span className="text-[11px] font-black uppercase text-[#FFA012] bg-[#FFA012]/15 px-3 py-0.5 rounded-full border border-[#FFA012]/30 flex items-center gap-1">
                <PixelCrown size={12} color="#FFA012" /> Легенда
              </span>
            )}
            {user.isSpender && (
              <span className="text-[11px] font-black uppercase text-[#FF453A] bg-[#FF453A]/15 px-3 py-0.5 rounded-full border border-[#FF453A]/30 flex items-center gap-1">
                <PixelJester size={12} color="#FF453A" /> Транжира
              </span>
            )}
            {user.rank && (
              <span className="text-[11px] font-black text-[#C6FF33] bg-[#C6FF33]/10 px-2.5 py-0.5 rounded-full border border-[#C6FF33]/25 flex items-center gap-1">
                <Trophy size={11} /> #{user.rank} Место
              </span>
            )}
          </div>

          {/* User Tags */}
          {user.tags && user.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {user.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-bold text-[#C6FF33] bg-[#C6FF33]/10 border border-[#C6FF33]/20 px-2.5 py-0.5 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Financial Visibility Card */}
        <div className="mt-5 p-3.5 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#8E8A9E]">
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-[#C6FF33]" /> Статус приватности
            </span>
            <span className="text-white">Открытый профиль</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
              <div className="text-[10px] font-black text-[#32D74B] uppercase flex items-center gap-1">
                <ArrowDownLeft size={11} /> Доходы
              </div>
              <div className="text-sm font-black text-white mt-1">
                {showInc && user.income !== undefined ? `+${user.income.toLocaleString('ru-RU')} ₽` : '*** ₽ (скрыто)'}
              </div>
            </div>

            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
              <div className="text-[10px] font-black text-[#FF453A] uppercase flex items-center gap-1">
                <ArrowUpRight size={11} /> Расходы
              </div>
              <div className="text-sm font-black text-white mt-1">
                {showExp && user.expenses !== undefined ? `-${user.expenses.toLocaleString('ru-RU')} ₽` : '*** ₽ (скрыто)'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-[#8E8A9E] px-1 font-semibold">
          <span className="flex items-center gap-1">
            <Calendar size={12} /> В Midas с 2026 г.
          </span>
          <span className="text-[#C6FF33]">Активен сейчас</span>
        </div>
      </div>
    </div>
  );
};
