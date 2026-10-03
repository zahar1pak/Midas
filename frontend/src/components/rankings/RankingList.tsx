import React from 'react';
import RankingCard from './RankingCard';
import { type UserProfileData } from '../profile/UserProfileModal';
import { useTransactionsStore } from '../../store/useTransactionsStore';
import { useFriendsStore, type FriendItem } from '../../store/useFriendsStore';

interface RankingListProps {
  onSelectUser?: (user: UserProfileData) => void;
  myShowIncome?: boolean;
  myShowExpenses?: boolean;
}

const RankingList: React.FC<RankingListProps> = ({ onSelectUser, myShowIncome = true, myShowExpenses = true }) => {
  const totalIncome = useTransactionsStore((state) => state.getTotalIncome());
  const totalExpense = useTransactionsStore((state) => state.getTotalExpense());
  const friends = useFriendsStore((state) => state.friends);

  const myName = localStorage.getItem('midas_user_name') || 'Бро Мастер';
  const myHandle = localStorage.getItem('midas_user_handle') || 'midas_bro';
  const myAvatar = localStorage.getItem('midas_user_avatar') || '😎';
  const myTags = JSON.parse(localStorage.getItem('midas_user_tags') || '["#инвестор", "#кодер"]');

  // Build ranking items: Current user + Real added friends (0 initially!)
  const allParticipants = React.useMemo(() => {
    const list = [
      {
        id: 'u-self',
        name: `${myName} (Ты)`,
        username: myHandle,
        avatar: myAvatar,
        income: totalIncome,
        expenses: totalExpense,
        tags: myTags,
        isSelf: true
      },
      ...friends.map((f: FriendItem) => ({
        id: f.user_id,
        name: f.display_name,
        username: f.username,
        avatar: f.avatar || '👾',
        income: f.income || 0,
        expenses: f.expenses || 0,
        tags: f.tags || ['#друг'],
        isSelf: false
      }))
    ];

    // Sort by income descending
    const sorted = [...list].sort((a, b) => b.income - a.income);

    // Identify King (Legend = highest income) and Jester (Spender = highest expenses)
    let maxInc = -1;
    let maxExp = -1;
    let kingId = '';
    let jesterId = '';

    sorted.forEach((u) => {
      if (u.income > maxInc && u.income > 0) {
        maxInc = u.income;
        kingId = u.id;
      }
      if (u.expenses > maxExp && u.expenses > 0) {
        maxExp = u.expenses;
        jesterId = u.id;
      }
    });

    return sorted.map((u, index) => ({
      ...u,
      rank: index + 1,
      isKing: u.id === kingId,
      isJester: u.id === jesterId
    }));
  }, [totalIncome, totalExpense, friends, myName, myHandle, myAvatar, myTags]);

  return (
    <div className="flex flex-col gap-3">
      {/* If user has 0 friends added yet, show friendly tip */}
      {friends.length === 0 && (
        <div className="p-3 bg-[#13111C] border border-white/5 rounded-2xl flex items-center justify-between text-xs text-[#8E8A9E]">
          <span>👥 В твоем рейтинге пока только ты. Добавь друзей во вкладке «Мои друзья», чтобы соревноваться за звание Легенды и Транжиры!</span>
        </div>
      )}

      {allParticipants.map((user) => {
        const isSelf = user.isSelf;
        const showInc = isSelf ? myShowIncome : true;
        const showExp = isSelf ? myShowExpenses : true;

        return (
          <RankingCard 
            key={user.id} 
            name={user.name} 
            avatar={user.avatar}
            income={user.income} 
            expenses={user.expenses} 
            rank={user.rank} 
            isKing={user.isKing} 
            isJester={user.isJester} 
            showIncome={showInc}
            showExpenses={showExp}
            onClick={() => onSelectUser?.({
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
              income: user.income,
              expenses: user.expenses,
              rank: user.rank,
              isLegend: user.isKing,
              isSpender: user.isJester,
              tags: user.tags,
              showIncome: showInc,
              showExpenses: showExp
            })}
          />
        );
      })}
    </div>
  );
};

export default RankingList;
