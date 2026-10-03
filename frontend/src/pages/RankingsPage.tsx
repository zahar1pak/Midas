import React, { useState } from 'react';
import RankingList from '../components/rankings/RankingList';
import FriendsList from '../components/friends/FriendsList';
import AddFriend from '../components/friends/AddFriend';
import RubberSegment from '../components/ui/RubberSegment';
import { PixelCrown, PixelJester } from '../components/ui/PixelIcons';
import { UserProfileModal, type UserProfileData } from '../components/profile/UserProfileModal';
import { useFriendsStore, type FriendItem } from '../store/useFriendsStore';

const RankingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Рейтинг');
  const [selectedUser, setSelectedUser] = useState<UserProfileData | null>(null);

  const friends = useFriendsStore((state) => state.friends);
  const pending = useFriendsStore((state) => state.pending);
  const addFriend = useFriendsStore((state) => state.addFriend);
  const removeFriend = useFriendsStore((state) => state.removeFriend);
  const acceptFriend = useFriendsStore((state) => state.acceptFriend);
  const rejectFriend = useFriendsStore((state) => state.rejectFriend);

  // Privacy preferences from localStorage
  const myShowIncome = localStorage.getItem('midas_privacy_show_income') !== 'false';
  const myShowExpenses = localStorage.getItem('midas_privacy_show_expenses') !== 'false';

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-5 max-w-4xl mx-auto">
      
      {/* Header banner: renamed to "Друзья" */}
      <div
        className="fintech-card p-5 sm:p-6 bg-gradient-to-r from-[#13111C] via-[#1A162B] to-[#0D0B14] border-[#C6FF33]/25 shadow-xl relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black text-[#C6FF33] bg-[#C6FF33]/15 border border-[#C6FF33]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Сезон 1
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white m-0">
              Друзья
            </h1>
            <p className="m-0 mt-1.5 text-xs md:text-sm text-[#8E8A9E] font-medium">
              Соревнуйся с друзьями: <span className="text-[#FFA012] font-bold">Легенда</span> зарабатывает больше всех, а <span className="text-[#FF453A] font-bold">Транжира</span> бьет рекорды по тратам!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-3">
            <div className="flex items-center gap-1.5">
              <PixelCrown size={24} color="#FFA012" />
              <span className="text-xs font-extrabold text-[#FFA012]">Легенда</span>
            </div>
            <span className="text-gray-500">•</span>
            <div className="flex items-center gap-1.5">
              <PixelJester size={24} color="#FF453A" />
              <span className="text-xs font-extrabold text-[#FF453A]">Транжира</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Switcher: Рейтинг vs Мои друзья with RubberSegment */}
      <div className="flex justify-center">
        <RubberSegment
          items={['Рейтинг', `Мои друзья (${friends.length})`]}
          value={activeTab.startsWith('Мои друзья') ? `Мои друзья (${friends.length})` : activeTab}
          onChange={(val) => setActiveTab(val.startsWith('Мои друзья') ? 'Мои друзья' : 'Рейтинг')}
          trackColor="#151322"
          thumbColor="#C6FF33"
          textColor="#8E8A9E"
          activeTextColor="#0A0910"
          size="md"
          radius={9999}
          inset={3}
          stretch={50}
          squash={2}
          speed={0.85}
        />
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'Рейтинг' && (
        <div className="flex flex-col gap-4">
          <RankingList
            myShowIncome={myShowIncome}
            myShowExpenses={myShowExpenses}
            onSelectUser={(u) => setSelectedUser(u)}
          />
        </div>
      )}

      {activeTab.startsWith('Мои друзья') && (
        <div className="flex flex-col gap-4">
          <AddFriend onFriendAdded={(user) => {
            if (user) {
              addFriend({
                user_id: user.id,
                username: user.username,
                display_name: user.display_name,
                avatar: '👾',
                status: 'friend',
                income: 0,
                expenses: 0
              });
            }
          }} />
          <FriendsList
            friends={friends}
            pending={pending}
            onAccept={(id) => acceptFriend(id)}
            onReject={(id) => rejectFriend(id)}
            onRemove={(id) => removeFriend(id)}
            onSelectFriend={(f: FriendItem) => setSelectedUser({
              id: f.user_id,
              name: f.display_name,
              username: f.username,
              avatar: f.avatar,
              tags: f.tags,
              income: f.income,
              expenses: f.expenses
            })}
          />
        </div>
      )}

      {/* Modal for viewing any user / friend profile */}
      <UserProfileModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

    </div>
  );
};

export default RankingsPage;
