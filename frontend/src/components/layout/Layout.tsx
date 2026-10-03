import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Trophy, User, Settings, Search, Eye, EyeOff } from 'lucide-react';
import PixelMidasPlanetLogo from '../ui/PixelMidasPlanetLogo';
import FloatingBackground from '../ui/FloatingBackground';
import RubberSegment from '../ui/RubberSegment';

const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { value: '/', label: 'Обзор', icon: <Home size={15} /> },
    { value: '/stats', label: 'Статы', icon: <BarChart3 size={15} /> },
    { value: '/rankings', label: 'Друзья', icon: <Trophy size={15} /> },
    { value: '/profile', label: 'Профиль', icon: <User size={15} /> },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4 pointer-events-none md:hidden">
      <div className="pointer-events-auto shadow-2xl rounded-full">
        <RubberSegment
          items={navItems}
          value={location.pathname === '/friends' ? '/rankings' : location.pathname}
          onChange={(val) => navigate(val)}
          trackColor="rgba(19, 17, 28, 0.95)"
          thumbColor="#C6FF33"
          textColor="#8E8A9E"
          activeTextColor="#0A0910"
          size="md"
          radius={9999}
          inset={3}
          stretch={60}
          squash={2}
          speed={0.8}
        />
      </div>
    </div>
  );
};

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isBlurred, setIsBlurred] = useState(() => localStorage.getItem('midas_privacy_blur') === 'true');

  const toggleBlur = () => {
    const next = !isBlurred;
    setIsBlurred(next);
    localStorage.setItem('midas_privacy_blur', String(next));
  };

  const navItems = [
    { value: '/', label: 'Обзор', icon: <Home size={14} /> },
    { value: '/stats', label: 'Статистика', icon: <BarChart3 size={14} /> },
    { value: '/rankings', label: 'Друзья', icon: <Trophy size={14} /> },
    { value: '/profile', label: 'Профиль', icon: <User size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0910] text-white relative selection:bg-[#C6FF33] selection:text-[#0A0910]">
      {/* Dynamic Background with Neon Glow and Floating Coins */}
      <FloatingBackground />

      <div className="relative z-10 max-w-md md:max-w-4xl lg:max-w-6xl mx-auto min-h-screen flex flex-col">
        {/* Header (Adaptive: Mobile Compact & Desktop Full Navbar) */}
        <header className="sticky top-0 z-40 bg-[#0A0910]/80 backdrop-blur-xl border-b border-[#C6FF33]/15 px-4 md:px-8 py-3.5 flex items-center justify-between">
          {/* Left: Pixel Planet Brand Logo with 8-bit MIDAS Wordmark from Reference */}
          <Link to="/" className="flex items-center group">
            <PixelMidasPlanetLogo size={38} showText={true} />
          </Link>

          {/* Center (Desktop only): Navigation Links with RubberSegment */}
          <nav className="hidden md:flex items-center">
            <RubberSegment
              items={navItems}
              value={location.pathname === '/friends' ? '/rankings' : location.pathname}
              onChange={(val) => navigate(val)}
              trackColor="rgba(19, 17, 28, 0.85)"
              thumbColor="#C6FF33"
              textColor="#8E8A9E"
              activeTextColor="#0A0910"
              size="sm"
              radius={9999}
              inset={2}
              stretch={50}
              squash={2}
              speed={0.8}
            />
          </nav>

          {/* Right: Anti-peep Blur Toggle, Search, Bell & Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Instant Anti-Peep Shield Button */}
            <button
              onClick={toggleBlur}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isBlurred
                  ? 'bg-[#FF453A] text-white shadow-[0_0_14px_rgba(255,69,58,0.5)]'
                  : 'bg-white/5 border border-[#C6FF33]/20 text-[#C6FF33] hover:bg-[#C6FF33]/15'
              }`}
              title={isBlurred ? 'Снять защиту (разблюрить экран)' : 'Шторка от подглядываний (заблюрить экран)'}
            >
              {isBlurred ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            <Link
              to="/stats"
              className="w-9 h-9 rounded-full bg-white/5 border border-[#C6FF33]/20 flex items-center justify-center text-[#C6FF33] hover:bg-[#C6FF33]/15 transition-colors"
              title="Поиск и статистика"
            >
              <Search size={16} />
            </Link>
            <Link
              to="/settings"
              className="w-9 h-9 rounded-full bg-white/5 border border-[#C6FF33]/20 flex items-center justify-center text-[#C6FF33] hover:bg-[#C6FF33]/15 transition-colors"
              title="Конфиденциальность & Настройки"
            >
              <Settings size={16} />
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-1 group"
            >
              <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#FFA012] to-[#7D39EB] group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-[#13111C] flex items-center justify-center text-sm">
                  ⚡
                </div>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content Area (With instant anti-peeping privacy blur if active) */}
        <main className={`flex-1 pb-24 md:pb-12 transition-all duration-300 ${
          isBlurred ? 'filter blur-md select-none pointer-events-none opacity-40' : ''
        }`}>
          <Outlet />
        </main>
      </div>

      {/* Floating Bottom Navigation on Mobile Viewport */}
      <TabBar />

      {/* Anti-Peep Floating Unblur Overlay when screen is shielded */}
      {isBlurred && (
        <div
          onClick={toggleBlur}
          className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center cursor-pointer p-4 text-center"
        >
          <div className="fintech-card p-4 sm:p-5 bg-[#13111C]/90 border-[#C6FF33] shadow-2xl flex items-center gap-3">
            <EyeOff size={22} className="text-[#FF453A]" />
            <div className="text-left">
              <div className="text-sm font-black text-white">Экран защищен от подглядываний 🔒</div>
              <div className="text-xs text-[#8E8A9E]">Нажми в любое место или на глазок, чтобы разблюрить</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


