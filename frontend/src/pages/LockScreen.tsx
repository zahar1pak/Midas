import React, { useState } from 'react';
import CodeSlots from '../components/ui/CodeSlots';
import PixelMidasLogo from '../components/ui/PixelMidasLogo';
import { ChevronRight, Delete } from 'lucide-react';

interface LockScreenProps {
  onUnlock?: () => void;
  correctPin?: string;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  onUnlock,
  correctPin
}) => {
  const activeCorrectPin = correctPin || localStorage.getItem('midas_pin_code') || '1234';
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [hint, setHint] = useState(`Введи 4-значный PIN (по умолчанию: ${activeCorrectPin === '1234' ? '1234' : '••••'})`);

  const handleComplete = async (code: string) => {
    if (code === activeCorrectPin) {
      setStatus('success');
      setHint('Код верный! Заходим... 🚀');
      setTimeout(() => {
        if (onUnlock) onUnlock();
      }, 700);
    } else {
      setStatus('error');
      setHint('Неверный PIN! Попробуй еще раз ❌');
      setTimeout(() => {
        setPin('');
        setStatus('idle');
      }, 900);
    }
  };

  const handleNumpad = (digit: string) => {
    if (pin.length < 4 && status !== 'success') {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        handleComplete(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && status !== 'success') {
      setPin(pin.slice(0, -1));
      setStatus('idle');
    }
  };

  return (
    <div style={{
      maxWidth: '440px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px 24px 30px 24px',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Header */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <PixelMidasLogo size="lg" color="#D8F834" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 6px 0' }}>
          Вход в приложение 🔒
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>
          {hint}
        </p>
      </div>

      {/* CodeSlots Component */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
        <CodeSlots
          length={4}
          value={pin}
          status={status}
          onChange={(val) => {
            setPin(val);
            if (status === 'error') setStatus('idle');
          }}
          onComplete={handleComplete}
          accentColor="#D8F834"
          inkColor="#D8F834"
          slotColor="#14170F"
          digitColor="#090B06"
          dangerColor="#FF453A"
          slotSize={52}
          gap={12}
          radius={16}
          mask
        />
      </div>

      {/* Touch Numpad */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '280px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
            <button
              key={n}
              onClick={() => handleNumpad(n)}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(198, 255, 51, 0.15)',
                color: '#FFFFFF',
                fontSize: '22px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {n}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumpad('0')}
            style={{
              aspectRatio: '1 / 1',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(198, 255, 51, 0.15)',
              color: '#FFFFFF',
              fontSize: '22px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            style={{
              aspectRatio: '1 / 1',
              borderRadius: '16px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Delete size={22} />
          </button>
        </div>

        {/* Swipe to unlock alternative */}
        <div style={{ marginTop: '14px' }}>
          <button
            onClick={() => { if (onUnlock) onUnlock(); }}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(216, 248, 52, 0.08)',
              border: '1px solid rgba(216, 248, 52, 0.2)',
              color: '#D8F834',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Войти без PIN (свайп) <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default LockScreen;
