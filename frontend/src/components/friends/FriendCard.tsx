import React from 'react';
import { Check, X, UserCheck } from 'lucide-react';

interface FriendCardProps {
  id?: string;
  name: string;
  username?: string;
  avatar?: string;
  status: 'friend' | 'pending';
  onAccept?: () => void;
  onReject?: () => void;
  onRemove?: () => void;
  onClick?: () => void;
}

// Generate deterministic vibrant badge colors for avatars without photo
const AVATAR_GRADIENTS = [
  'from-[#FFA012] to-[#FFD700]',
  'from-[#7D39EB] to-[#9945FF]',
  'from-[#32D74B] to-[#C6FF33]',
  'from-[#00F0FF] to-[#60A5FA]',
  'from-[#FF453A] to-[#FF2D55]',
  'from-[#F472B6] to-[#EC4899]'
];

const getGradientForName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
};

const FriendCard: React.FC<FriendCardProps> = ({
  name,
  username,
  avatar,
  status,
  onAccept,
  onReject,
  onRemove,
  onClick
}) => {
  const isImageAvatar = avatar && (avatar.startsWith('data:image') || avatar.startsWith('http'));
  const gradient = getGradientForName(name);

  return (
    <div
      onClick={onClick}
      className="fintech-card flex items-center justify-between p-3.5 sm:p-4 mb-2.5 hover:border-[#C6FF33]/30 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3">
        {/* Avatar with Photo / Pixel Emoji / Styled Letter Badge */}
        <div className={`w-11 h-11 rounded-xl p-[2px] bg-gradient-to-tr ${gradient} flex-shrink-0 shadow-md`}>
          <div className="w-full h-full rounded-[10px] bg-[#13111C] flex items-center justify-center text-base font-black text-white overflow-hidden select-none">
            {isImageAvatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : avatar && avatar.length <= 4 ? (
              <span className="text-xl">{avatar}</span>
            ) : (
              <span className="text-sm font-black text-[#C6FF33] uppercase">
                {name ? name.substring(0, 2) : 'БР'}
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
            <span>{name}</span>
          </div>
          {username && (
            <div className="text-xs text-[#8E8A9E] font-semibold mt-0.5">
              @{username}
            </div>
          )}
        </div>
      </div>

      {status === 'pending' ? (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onAccept}
            title="Принять заявку"
            className="fintech-btn-neon px-3.5 py-1.5 text-xs flex items-center gap-1"
          >
            <Check size={14} strokeWidth={3} /> Принять
          </button>
          <button
            onClick={onReject}
            title="Отклонить"
            className="px-2.5 py-1.5 bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30 rounded-xl hover:bg-[#FF453A]/25 transition-colors"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <span className="text-[11px] font-black text-[#C6FF33] bg-[#C6FF33]/10 px-2.5 py-1 rounded-full border border-[#C6FF33]/20 flex items-center gap-1">
            <UserCheck size={12} /> БРО
          </span>
          {onRemove && (
            <button
              onClick={onRemove}
              title="Удалить из друзей"
              className="text-[#8E8A9E] hover:text-[#FF453A] p-1.5 transition-colors text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendCard;
