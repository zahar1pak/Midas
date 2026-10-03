import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Trophy, ChevronRight, Edit3, X, Zap, Sparkles } from 'lucide-react';
import { PixelCrown } from '../components/ui/PixelIcons';
import { useTransactionsStore } from '../store/useTransactionsStore';

const PIXEL_AVATARS = [
  { id: 'av-1', label: 'Кибер Бро', emoji: '😎', color: '#C6FF33' },
  { id: 'av-2', label: 'Крипто Магнат', emoji: '🤑', color: '#7D39EB' },
  { id: 'av-3', label: 'Пиксельный Кот', emoji: '🐱', color: '#60A5FA' },
  { id: 'av-4', label: 'Ниндзя Степухи', emoji: '🥷', color: '#C6FF33' },
  { id: 'av-5', label: 'Неоновый Геймер', emoji: '👾', color: '#F472B6' },
  { id: 'av-6', label: 'Алмазные Руки', emoji: '💎', color: '#38BDF8' },
  { id: 'av-7', label: 'Шут Трат', emoji: '🃏', color: '#FF453A' },
  { id: 'av-8', label: 'Король Бабок', emoji: '👑', color: '#FBBF24' },
];

export const BANNER_STYLES = [
  {
    id: 'cyberpunk',
    name: 'Киберпанк Неон',
    tag: 'CYBER',
    icon: '⚡',
    gradient: 'from-[#0b1414] via-[#101c18] to-[#160d26]',
    border: 'border-[#C6FF33]/50',
    accent: '#C6FF33',
    glow: 'shadow-[0_0_35px_rgba(198,255,51,0.22)]',
    badgeClass: 'text-[#C6FF33] bg-[#C6FF33]/15 border-[#C6FF33]/35'
  },
  {
    id: 'gold_midas',
    name: 'Золотой Midas',
    tag: 'PRESTIGE',
    icon: '👑',
    gradient: 'from-[#1f1707] via-[#2d200a] to-[#171106]',
    border: 'border-[#FFA012]/60',
    accent: '#FFA012',
    glow: 'shadow-[0_0_35px_rgba(255,160,18,0.25)]',
    badgeClass: 'text-[#FFA012] bg-[#FFA012]/15 border-[#FFA012]/35'
  },
  {
    id: 'space_pixel',
    name: 'Пиксельный Космос',
    tag: 'COSMIC',
    icon: '🪐',
    gradient: 'from-[#0d0922] via-[#180d32] to-[#0a122e]',
    border: 'border-[#7D39EB]/60',
    accent: '#7D39EB',
    glow: 'shadow-[0_0_35px_rgba(125,57,235,0.28)]',
    badgeClass: 'text-[#A78BFA] bg-[#7D39EB]/20 border-[#7D39EB]/35'
  },
  {
    id: 'carbon_stealth',
    name: 'Dark Carbon',
    tag: 'STEALTH',
    icon: '🛡️',
    gradient: 'from-[#121214] via-[#1a1a20] to-[#0a0a0c]',
    border: 'border-white/30',
    accent: '#FFFFFF',
    glow: 'shadow-[0_0_30px_rgba(255,255,255,0.12)]',
    badgeClass: 'text-white bg-white/10 border-white/20'
  },
  {
    id: 'emerald_matrix',
    name: 'Изумрудная Матрица',
    tag: 'MATRIX',
    icon: '🟢',
    gradient: 'from-[#051813] via-[#08241b] to-[#03130d]',
    border: 'border-[#00F5A0]/50',
    accent: '#00F5A0',
    glow: 'shadow-[0_0_35px_rgba(0,245,160,0.22)]',
    badgeClass: 'text-[#00F5A0] bg-[#00F5A0]/15 border-[#00F5A0]/35'
  },
  {
    id: 'synthwave_sunset',
    name: 'Неоновый Закат',
    tag: 'SYNTHWAVE',
    icon: '🌆',
    gradient: 'from-[#230926] via-[#330f2c] to-[#140b2b]',
    border: 'border-[#FF2A85]/50',
    accent: '#FF2A85',
    glow: 'shadow-[0_0_35px_rgba(255,42,133,0.22)]',
    badgeClass: 'text-[#FF2A85] bg-[#FF2A85]/15 border-[#FF2A85]/35'
  }
];

const BannerBackground: React.FC<{ styleId: string; accent: string }> = ({ styleId }) => {
  switch (styleId) {
    case 'cyberpunk':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#C6FF33]/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#7D39EB]/15 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cyber-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#C6FF33" strokeWidth="0.8" />
                <circle cx="24" cy="0" r="1.5" fill="#C6FF33" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cyber-grid)" />
          </svg>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C6FF33]/40" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C6FF33]/40" />
        </div>
      );
    case 'gold_midas':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-36 rounded-full bg-[#FFA012]/20 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gold-rays" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 0 30 L 30 0 M 0 0 L 30 30" fill="none" stroke="#FFA012" strokeWidth="0.6" strokeDasharray="2 4" />
                <circle cx="15" cy="15" r="1" fill="#FFE066" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gold-rays)" />
          </svg>
          <div className="absolute top-3 left-1/4 w-1.5 h-1.5 rounded-full bg-[#FFE066] animate-pulse shadow-[0_0_8px_#FFE066]" />
          <div className="absolute bottom-4 right-1/4 w-2 h-2 rounded-full bg-[#FFA012] animate-pulse shadow-[0_0_8px_#FFA012]" />
        </div>
      );
    case 'space_pixel':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-10 w-48 h-48 rounded-full bg-[#7D39EB]/25 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-44 h-44 rounded-full bg-[#9945FF]/20 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pixel-stars" width="28" height="28" patternUnits="userSpaceOnUse">
                <rect x="4" y="4" width="2" height="2" fill="#FFFFFF" fillOpacity="0.8" />
                <rect x="18" y="14" width="2" height="2" fill="#A78BFA" fillOpacity="0.7" />
                <rect x="10" y="22" width="1.5" height="1.5" fill="#C4B5FD" fillOpacity="0.6" />
                <rect x="24" y="6" width="1" height="1" fill="#FFFFFF" fillOpacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pixel-stars)" />
          </svg>
        </div>
      );
    case 'carbon_stealth':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)]" />
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="carbon-mesh" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="6" height="6" fill="#26262B" />
                <rect x="6" y="6" width="6" height="6" fill="#26262B" />
                <path d="M 0 6 L 6 0 M 6 12 L 12 6" stroke="#3A3A42" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#carbon-mesh)" />
          </svg>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      );
    case 'emerald_matrix':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 left-10 w-48 h-48 rounded-full bg-[#00F5A0]/20 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="matrix-rain" width="16" height="24" patternUnits="userSpaceOnUse">
                <line x1="8" y1="0" x2="8" y2="16" stroke="#00F5A0" strokeWidth="1.2" strokeDasharray="3 3" />
                <circle cx="8" cy="18" r="1.5" fill="#00F5A0" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#matrix-rain)" />
          </svg>
          <div className="absolute bottom-2 right-4 text-[9px] font-mono font-bold text-[#00F5A0]/50 tracking-widest">
            01001101
          </div>
        </div>
      );
    case 'synthwave_sunset':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 right-1/4 w-52 h-44 rounded-full bg-[#FF2A85]/25 blur-3xl" />
          <div className="absolute -bottom-8 left-1/4 w-48 h-36 rounded-full bg-[#7D39EB]/25 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="synth-grid" width="20" height="14" patternUnits="userSpaceOnUse">
                <line x1="0" y1="14" x2="20" y2="14" stroke="#FF2A85" strokeWidth="0.8" />
                <line x1="10" y1="0" x2="10" y2="14" stroke="#7D39EB" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#synth-grid)" />
          </svg>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF2A85]/60 to-transparent" />
        </div>
      );
    default:
      return null;
  }
};

const DEFAULT_TAGS = ['#инвестор', '#крипта', '#студент', '#кодер'];

export const ProfilePage: React.FC = () => {
  const getTotalIncome = useTransactionsStore((state) => state.getTotalIncome);
  const totalIncome = getTotalIncome();

  // Telegram WebApp initial values fallback
  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;

  const [displayName, setDisplayName] = useState(() => {
    return localStorage.getItem('midas_user_name') || tgUser?.first_name || 'Бро Мастер';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('midas_user_handle') || tgUser?.username || 'midas_bro';
  });
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem('midas_user_avatar') || tgUser?.photo_url || '😎';
  });
  const [bannerStyleId, setBannerStyleId] = useState(() => {
    return localStorage.getItem('midas_user_banner') || 'cyberpunk';
  });
  const [tags, setTags] = useState<string[]>(() => {
    const saved = localStorage.getItem('midas_user_tags');
    return saved ? JSON.parse(saved) : DEFAULT_TAGS;
  });

  // Level Progression: 1 Level per 5,000 ₽ income
  const currentLevelInfo = React.useMemo(() => {
    const step = 5000;
    const currentLevel = Math.max(1, Math.floor(totalIncome / step) + 1);
    const currentLevelIncome = (currentLevel - 1) * step;
    const nextLevelIncome = currentLevel * step;
    const incomeInThisLevel = totalIncome - currentLevelIncome;
    const progress = Math.min(100, Math.max(0, (incomeInThisLevel / step) * 100));
    const needed = Math.max(0, nextLevelIncome - totalIncome);

    return {
      level: currentLevel,
      progress: Math.round(progress),
      needed: needed,
      nextLevel: currentLevel + 1
    };
  }, [totalIncome]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState(displayName);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempAvatar, setTempAvatar] = useState(selectedAvatar);
  const [tempBannerId, setTempBannerId] = useState(bannerStyleId);
  const [newTagInput, setNewTagInput] = useState('');
  const [tempTags, setTempTags] = useState<string[]>(tags);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Level Up Banner notification
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false);

  useEffect(() => {
    localStorage.setItem('midas_user_name', displayName);
    localStorage.setItem('midas_user_handle', username);
    localStorage.setItem('midas_user_avatar', selectedAvatar);
    localStorage.setItem('midas_user_banner', bannerStyleId);
    localStorage.setItem('midas_user_tags', JSON.stringify(tags));
  }, [displayName, username, selectedAvatar, bannerStyleId, tags]);

  const activeBanner = BANNER_STYLES.find(b => b.id === bannerStyleId) || BANNER_STYLES[0];

  const handleOpenEdit = () => {
    setTempName(displayName);
    setTempUsername(username);
    setTempAvatar(selectedAvatar);
    setTempBannerId(bannerStyleId);
    setTempTags([...tags]);
    setIsEditModalOpen(true);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newTagInput.trim();
    if (!clean) return;
    const formatted = clean.startsWith('#') ? clean : `#${clean}`;
    if (!tempTags.includes(formatted)) {
      setTempTags([...tempTags, formatted]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTempTags(tempTags.filter(t => t !== tagToRemove));
  };

  const handleSaveProfile = () => {
    setDisplayName(tempName || 'Бро');
    setUsername(tempUsername || 'bro');
    setSelectedAvatar(tempAvatar);
    setBannerStyleId(tempBannerId);
    setTags(tempTags);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditModalOpen(false);
    }, 600);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-5 max-w-3xl mx-auto">
      
      {/* 1. Profile Header Card with selectable Banner Style */}
      <div
        className={`fintech-card p-6 bg-gradient-to-r ${activeBanner.gradient} ${activeBanner.border} ${activeBanner.glow} text-center relative overflow-hidden transition-all duration-300`}
      >
        <BannerBackground styleId={activeBanner.id} accent={activeBanner.accent} />

        {/* Season 1 Badge in Top Left */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${activeBanner.badgeClass}`}>
            Сезон 1 • {activeBanner.tag}
          </span>
        </div>

        {/* Edit Button in Top Right */}
        <button
          onClick={handleOpenEdit}
          className="fintech-btn-secondary absolute top-4 right-4 z-10 py-1.5 px-3 text-xs gap-1.5"
        >
          <Edit3 size={13} color={activeBanner.accent} /> Редактировать
        </button>

        {/* Avatar with Halo & Crown */}
        <div className="inline-block relative z-10 mb-3 mt-6">
          <div
            className="w-22 h-22 rounded-full p-[3px] bg-gradient-to-tr from-[#FFA012] via-[#C6FF33] to-[#7D39EB] flex items-center justify-center transition-transform hover:scale-105"
            style={{ boxShadow: `0 0 28px ${activeBanner.accent}66` }}
          >
            <div className="w-full h-full rounded-full bg-[#0A0910] flex items-center justify-center text-4xl overflow-hidden">
              {selectedAvatar.startsWith('data:image') || selectedAvatar.startsWith('http') ? (
                <img src={selectedAvatar} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                selectedAvatar
              )}
            </div>
          </div>
          {/* Crown badge */}
          <div className="absolute -top-2 -right-2">
            <PixelCrown size={28} color="#FFA012" />
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white m-0 mb-1 relative z-10">
          {displayName}
        </h2>
        <div className="text-xs text-[#8E8A9E] font-semibold relative z-10">
          @{username} • ID: {tgUser?.id || '8726-556-932'}
        </div>

        {/* User Tags */}
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 relative z-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeBanner.badgeClass}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Gamification: Level, Experience Bar & Level Up Banner */}
      <div className="fintech-card p-5 bg-[#13111C] border-[#7D39EB]/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C6FF33]/15 border border-[#C6FF33]/40 flex items-center justify-center font-black text-[#C6FF33] text-sm">
              {currentLevelInfo.level}
            </div>
            <div>
              <span className="text-xs font-black uppercase text-[#C6FF33] tracking-wider block">
                Уровень {currentLevelInfo.level}
              </span>
              <span className="text-[11px] text-[#8E8A9E] font-semibold">
                Всего дохода: {totalIncome.toLocaleString('ru-RU')} ₽ (1 LVL = 5 000 ₽)
              </span>
            </div>
          </div>

          <button
            onClick={() => { setShowLevelUpAlert(true); setTimeout(() => setShowLevelUpAlert(false), 3000); }}
            className="text-[11px] font-extrabold text-[#7D39EB] hover:text-[#C6FF33] transition-colors"
          >
            ⚡ Анимация LVL UP
          </button>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full h-3.5 bg-black/60 rounded-full p-0.5 border border-white/10 mt-3 relative overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7D39EB] via-[#9945FF] to-[#C6FF33] transition-all duration-700 shadow-[0_0_12px_rgba(198,255,51,0.5)]"
            style={{ width: `${currentLevelInfo.progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[11px] font-bold text-[#8E8A9E]">
          <span>{currentLevelInfo.progress}% до следующего уровня</span>
          <span>Еще +{currentLevelInfo.needed.toLocaleString('ru-RU')} ₽ до LVL {currentLevelInfo.nextLevel}</span>
        </div>

        {/* Level Up Pop Alert */}
        {showLevelUpAlert && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#C6FF33] to-[#7D39EB] text-[#0A0910] font-black text-center text-xs animate-bounce shadow-xl flex items-center justify-center gap-2">
            <Zap size={16} /> ⚡ LEVEL UP! Поздравляем, твой уровень повысился! 🚀
          </div>
        )}
      </div>

      {/* 3. Quick Links (Combined into Конфиденциальность) */}
      <div className="fintech-card p-2">
        <Link
          to="/friends"
          className="flex items-center justify-between p-3.5 border-b border-white/5 hover:bg-white/[0.02] rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C6FF33]/10 flex items-center justify-center">
              <Users size={16} className="text-[#C6FF33]" />
            </div>
            <span className="text-sm font-extrabold text-white">Друзья</span>
          </div>
          <ChevronRight size={16} className="text-[#8E8A9E]" />
        </Link>

        <Link
          to="/rankings"
          className="flex items-center justify-between p-3.5 border-b border-white/5 hover:bg-white/[0.02] rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFA012]/15 flex items-center justify-center">
              <Trophy size={16} className="text-[#FFA012]" />
            </div>
            <span className="text-sm font-extrabold text-white">Друзья (Рейтинг)</span>
          </div>
          <ChevronRight size={16} className="text-[#8E8A9E]" />
        </Link>

        <Link
          to="/settings"
          className="flex items-center justify-between p-3.5 hover:bg-white/[0.02] rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#7D39EB]/15 flex items-center justify-center">
              <Shield size={16} className="text-[#7D39EB]" />
            </div>
            <span className="text-sm font-extrabold text-white">Конфиденциальность & Настройки</span>
          </div>
          <ChevronRight size={16} className="text-[#8E8A9E]" />
        </Link>
      </div>

      {/* 4. Profile Edit Modal - WITH FIXED SCROLL & STICKY FOOTER */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="fintech-card w-full max-w-md bg-[#13111C] border-[#C6FF33]/35 max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-white/10 flex-shrink-0">
              <h3 className="m-0 text-base font-black text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#C6FF33]" /> Редактирование профиля
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#8E8A9E] hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4">
              {/* Live Banner Preview in Modal */}
              <div className="bg-[#0A0910] p-3 rounded-2xl border border-white/10">
                <div className="text-[11px] font-extrabold uppercase text-[#8E8A9E] mb-2 flex items-center justify-between">
                  <span>Предпросмотр баннера</span>
                  <span className="font-bold text-[11px]" style={{ color: (BANNER_STYLES.find(b => b.id === tempBannerId) || BANNER_STYLES[0]).accent }}>
                    {(BANNER_STYLES.find(b => b.id === tempBannerId) || BANNER_STYLES[0]).name}
                  </span>
                </div>
                {(() => {
                  const previewBanner = BANNER_STYLES.find(b => b.id === tempBannerId) || BANNER_STYLES[0];
                  return (
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${previewBanner.gradient} ${previewBanner.border} ${previewBanner.glow} relative overflow-hidden flex items-center gap-3.5 transition-all duration-300 border`}>
                      <BannerBackground styleId={previewBanner.id} accent={previewBanner.accent} />
                      <div className="relative z-10 w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#FFA012] via-[#C6FF33] to-[#7D39EB] flex-shrink-0 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-[#0A0910] flex items-center justify-center text-2xl overflow-hidden">
                          {tempAvatar.startsWith('data:image') || tempAvatar.startsWith('http') ? (
                            <img src={tempAvatar} alt={tempName} className="w-full h-full object-cover" />
                          ) : (
                            tempAvatar
                          )}
                        </div>
                      </div>
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white truncate">{tempName || 'Бро Мастер'}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${previewBanner.badgeClass}`}>
                            {previewBanner.tag}
                          </span>
                        </div>
                        <div className="text-xs text-[#8E8A9E] truncate">@{tempUsername || 'midas_bro'}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Banner Theme Picker Grid */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-2">
                  Стиль баннера профиля (6 тем)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BANNER_STYLES.map((b) => {
                    const isSelected = tempBannerId === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setTempBannerId(b.id)}
                        className={`p-2.5 rounded-xl text-left border relative overflow-hidden transition-all flex flex-col gap-1.5 ${
                          isSelected
                            ? `${b.border} bg-white/[0.08]`
                            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                        }`}
                        style={isSelected ? { borderColor: b.accent, boxShadow: `0 0 14px ${b.accent}33` } : {}}
                      >
                        <div className={`h-6 w-full rounded-lg bg-gradient-to-r ${b.gradient} border ${b.border} flex items-center justify-between px-2 relative overflow-hidden`}>
                          <span className="text-xs">{b.icon}</span>
                          {isSelected && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-black/70 text-white border border-white/20">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-black text-white truncate">{b.name}</div>
                          <span className="text-[9px] font-black uppercase" style={{ color: b.accent }}>
                            {b.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo Upload & Character Picker */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-2">
                  Аватарка: Фотография или пиксель-арт
                </label>
                
                <div className="mb-3">
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#C6FF33]/40 bg-white/[0.03] hover:bg-[#C6FF33]/10 cursor-pointer transition-all">
                    <span className="text-xs font-bold text-[#C6FF33]">📷 Загрузить фотографию</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setTempAvatar(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {tempAvatar.startsWith('data:image') && (
                    <div className="mt-2 flex items-center justify-between p-2 bg-[#0A0910] rounded-lg border border-[#C6FF33]/30">
                      <div className="flex items-center gap-2">
                        <img src={tempAvatar} alt="preview" className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-xs text-white font-bold">Фото загружено</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTempAvatar('😎')}
                        className="text-xs text-[#FF453A] font-bold"
                      >
                        Сбросить
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PIXEL_AVATARS.map((av) => {
                    const isSelected = tempAvatar === av.emoji;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setTempAvatar(av.emoji)}
                        className={`h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                          isSelected
                            ? 'bg-[#C6FF33]/20 border-2 border-[#C6FF33]'
                            : 'bg-white/[0.04] border border-white/10 hover:border-white/20'
                        }`}
                      >
                        {av.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                  Отображаемое имя
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="fintech-input"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                  Никнейм (@handle)
                </label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="fintech-input"
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                  Теги профиля
                </label>
                <form onSubmit={handleAddTag} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Например: #крипта"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="fintech-input flex-1"
                  />
                  <button type="submit" className="fintech-btn-secondary px-3 text-xs font-bold">
                    +
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5">
                  {tempTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-bold text-[#C6FF33] bg-[#C6FF33]/15 border border-[#C6FF33]/30 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#FF453A] font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer (Never overflows screen) */}
            <div className="p-4 border-t border-white/10 bg-[#0A0910] flex-shrink-0">
              <button
                type="button"
                onClick={handleSaveProfile}
                className="fintech-btn-neon w-full py-3.5 text-sm font-extrabold"
              >
                {savedSuccess ? 'Сохранено! ✓' : 'Сохранить изменения ⚡'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
