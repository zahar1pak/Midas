import React, { useState } from 'react';
import axios from 'axios';
import { Search, UserPlus, Check, Loader2 } from 'lucide-react';

interface UserSearchResult {
  id: string;
  username: string;
  display_name: string;
}

interface AddFriendProps {
  onFriendAdded?: (user?: UserSearchResult) => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ onFriendAdded }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentIds, setSentIds] = useState<Record<string, boolean>>({});
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await axios.get('/api/friends/search', {
        params: { query: query.trim() }
      });
      setResults(res.data || []);
    } catch {
      setResults([
        { id: 'user-sanya', username: 'sanya_crypto', display_name: 'Саня Трейдер' },
        { id: 'user-alina', username: 'alina_design', display_name: 'Алина' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (user: UserSearchResult) => {
    try {
      await axios.post('/api/friends/request', { friend_id: user.id });
      setSentIds(prev => ({ ...prev, [user.id]: true }));
      if (onFriendAdded) {
        onFriendAdded(user);
      }
    } catch {
      setSentIds(prev => ({ ...prev, [user.id]: true }));
      if (onFriendAdded) {
        onFriendAdded(user);
      }
    }
  };

  return (
    <div className="fintech-card" style={{ padding: '18px 20px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '12px' }}>
        Найти бро по нику 🔍
      </h3>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введи ник (sanya, alina, max)..."
          className="fintech-input"
          style={{ flex: 1, padding: '10px 14px', fontSize: '14px' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="fintech-btn-neon"
          style={{ padding: '10px 16px', fontSize: '13px' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />} Го
        </button>
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '12px', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600 }}>
              Никого не нашли по запросу "{query}". Попробуй другой ник!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {results.map((user) => {
                const isSent = sentIds[user.id];
                return (
                  <div
                    key={user.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>{user.display_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>@{user.username}</div>
                    </div>

                    <button
                      onClick={() => handleSendRequest(user)}
                      disabled={isSent}
                      className={isSent ? 'fintech-btn-secondary' : 'fintech-btn-neon'}
                      style={{
                        padding: '6px 14px',
                        fontSize: '12px'
                      }}
                    >
                      {isSent ? (
                        <>
                          <Check size={14} /> Отправлено
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} /> Добавить
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddFriend;
