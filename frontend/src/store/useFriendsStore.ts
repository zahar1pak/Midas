import { create } from 'zustand';

export interface FriendItem {
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

interface FriendsState {
  friends: FriendItem[];
  pending: FriendItem[];
  addFriend: (friend: Omit<FriendItem, 'friendship_id'>) => void;
  removeFriend: (friendshipId: string) => void;
  acceptFriend: (friendshipId: string) => void;
  rejectFriend: (friendshipId: string) => void;
  clearAllFriends: () => void;
}

const STORAGE_KEY = 'midas_friends_list';
const PENDING_STORAGE_KEY = 'midas_pending_friends_list';

const getInitialFriends = (): FriendItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load friends from localStorage", e);
  }
  // Clean fresh start: 0 friends initially (no fake demo friends)
  return [];
};

const getInitialPending = (): FriendItem[] => {
  try {
    const saved = localStorage.getItem(PENDING_STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load pending friends from localStorage", e);
  }
  return [];
};

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: getInitialFriends(),
  pending: getInitialPending(),

  addFriend: (friendData) => {
    const newFriend: FriendItem = {
      ...friendData,
      friendship_id: `f-${Date.now()}`
    };
    const updated = [newFriend, ...get().friends];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ friends: updated });
  },

  removeFriend: (friendshipId) => {
    const updated = get().friends.filter(f => f.friendship_id !== friendshipId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ friends: updated });
  },

  acceptFriend: (friendshipId) => {
    const item = get().pending.find(p => p.friendship_id === friendshipId);
    const updatedPending = get().pending.filter(p => p.friendship_id !== friendshipId);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updatedPending));

    if (item) {
      const accepted: FriendItem = { ...item, status: 'friend' };
      const updatedFriends = [accepted, ...get().friends];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFriends));
      set({ friends: updatedFriends, pending: updatedPending });
    } else {
      set({ pending: updatedPending });
    }
  },

  rejectFriend: (friendshipId) => {
    const updated = get().pending.filter(p => p.friendship_id !== friendshipId);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updated));
    set({ pending: updated });
  },

  clearAllFriends: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify([]));
    set({ friends: [], pending: [] });
  }
}));
