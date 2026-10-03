import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LockScreen } from './pages/LockScreen';
import StatsPage from './pages/StatsPage';
import FriendsPage from './pages/FriendsPage';
import RankingsPage from './pages/RankingsPage';

function LockWrapper() {
  const navigate = useNavigate();
  return <LockScreen onUnlock={() => navigate('/')} />;
}

function App() {
  const [isLocked, setIsLocked] = useState(false);

  if (isLocked) {
    return <LockScreen onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/lock" element={<LockWrapper />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="rankings" element={<RankingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
