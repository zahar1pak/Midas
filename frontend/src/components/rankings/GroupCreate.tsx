import React, { useState } from 'react';

const GroupCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [created, setCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreated(true);
    setTimeout(() => {
      setName('');
      setCreated(false);
    }, 2000);
  };

  return (
    <div className="fintech-card" style={{ padding: '18px 20px', marginTop: '14px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '12px' }}>
        Создать новую группу 👥
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название группы (например: Семья, Команда)..."
          className="fintech-input"
        />
        <button
          type="submit"
          className="fintech-btn-neon"
          style={{ width: '100%', padding: '12px', fontSize: '14px' }}
        >
          {created ? 'Группа создана! 🚀' : 'Создать группу ⚡'}
        </button>
      </form>
    </div>
  );
};

export default GroupCreate;
