import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FriendsList from '../components/friends/FriendsList';
import AddFriend from '../components/friends/AddFriend';
import RubberSegment from '../components/ui/RubberSegment';
import { UserProfileModal, type UserProfileData } from '../components/profile/UserProfileModal';
import { useFriendsStore, type FriendItem } from '../store/useFriendsStore';

const FriendsPage: React.FC = () => {
  const friends = useFriendsStore((state) => state.friends);
  const pending = useFriendsStore((state) => state.pending);
  const removeFriend = useFriendsStore((state) => state.removeFriend);
  const acceptFriend = useFriendsStore((state) => state.acceptFriend);
  const rejectFriend = useFriendsStore((state) => state.rejectFriend);
  const addFriend = useFriendsStore((state) => state.addFriend);

  const [tab, setTab] = useState('Друзья');
  const [selectedFriend, setSelectedFriend] = useState<UserProfileData | null>(null);

  const fetchFriends = async () => {
    try {
      const res = await axios.get('/api/friends/');
      if (res.data) {
        if (Array.isArray(res.data.friends) && res.data.friends.length > 0) {
          // If server has real friends, sync them
        }
      }
    } catch {
      // offline or backend not available, store handles state
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="fintech-card p-5 sm:p-6 bg-gradient-to-r from-[#13111C] via-[#1A162B] to-[#0D0B14] border-[#C6FF33]/25 shadow-xl">
        <h1 className="text-xl md:text-2xl font-black text-white m-0">
          Друзья
        </h1>
        <p className="m-0 mt-1.5 text-xs md:text-sm text-[#8E8A9E] font-medium">
          Добавляй друзей по никнейму, следи за их прогрессом и соревнуйтесь в рейтинге!
        </p>
      </div>

      {/* Switcher */}
      <div className="flex justify-center">
        <RubberSegment
          items={['Друзья', 'Найти']}
          value={tab}
          onChange={(val) => setTab(val)}
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

      {/* Content */}
      {tab === 'Друзья' && (
        <FriendsList
          friends={friends}
          pending={pending}
          onAccept={(id) => acceptFriend(id)}
          onReject={(id) => rejectFriend(id)}
          onRemove={(id) => removeFriend(id)}
          onSelectFriend={(f: FriendItem) => setSelectedFriend({
            id: f.user_id,
            name: f.display_name,
            username: f.username,
            avatar: f.avatar,
            tags: f.tags,
            income: f.income,
            expenses: f.expenses
          })}
        />
      )}

      {tab === 'Найти' && (
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
          setTab('Друзья');
        }} />
      )}

      <UserProfileModal
        user={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
    </div>
  );
};

export default FriendsPage;
