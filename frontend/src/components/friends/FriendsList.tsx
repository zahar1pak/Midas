import React from 'react';
import FriendCard from './FriendCard';

export interface FriendData {
  friendship_id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar?: string;
  tags?: string[];
  income?: number;
  expenses?: number;
  status: 'friend' | 'pending';
}

interface FriendsListProps {
  friends: FriendData[];
  pending: FriendData[];
  onAccept: (friendshipId: string) => void;
  onReject: (friendshipId: string) => void;
  onRemove: (friendshipId: string) => void;
  onSelectFriend?: (friend: FriendData) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  pending,
  onAccept,
  onReject,
  onRemove,
  onSelectFriend
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* 1. Pending incoming requests */}
      {pending.length > 0 && (
        <div className="fintech-card p-4 border-[#C6FF33]/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase text-[#C6FF33] tracking-wider m-0">
              Заявки в друзья ({pending.length})
            </h3>
          </div>
          <div>
            {pending.map((p) => (
              <FriendCard
                key={p.friendship_id}
                id={p.friendship_id}
                name={p.display_name}
                username={p.username}
                avatar={p.avatar}
                status="pending"
                onAccept={() => onAccept(p.friendship_id)}
                onReject={() => onReject(p.friendship_id)}
                onClick={() => onSelectFriend?.(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. Accepted friends */}
      <div className="fintech-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-black uppercase text-white tracking-wider m-0">
            Твои друзья ({friends.length})
          </h3>
        </div>

        {friends.length === 0 ? (
          <div className="text-center py-8 text-[#8E8A9E]">
            <div className="text-3xl mb-2">✨</div>
            <div className="text-sm font-extrabold text-white">Пока список пуст</div>
            <div className="text-xs mt-1">Найди друзей через поиск выше и добавь их в свой круг!</div>
          </div>
        ) : (
          <div>
            {friends.map((f) => (
              <FriendCard
                key={f.friendship_id}
                id={f.friendship_id}
                name={f.display_name}
                username={f.username}
                avatar={f.avatar}
                status="friend"
                onRemove={() => onRemove(f.friendship_id)}
                onClick={() => onSelectFriend?.(f)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
