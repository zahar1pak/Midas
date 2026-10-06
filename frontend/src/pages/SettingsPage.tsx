import React, { useState, useEffect } from 'react';
import { 
  KeyRound, Shield, Trash2, Send, Check, AlertTriangle, Lock, 
  Smartphone, RefreshCw, BarChart3, Users, CheckCircle2, MessageSquare, Reply
} from 'lucide-react';
import { useTransactionsStore } from '../store/useTransactionsStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SettingsPage: React.FC = () => {
  const { 
    clearAllTransactions, 
    telegramId, 
    setTelegramUserId, 
    syncWithBackend, 
    isSyncing, 
    lastSyncTime 
  } = useTransactionsStore();

  // Telegram Link & Sync
  const [tgIdInput, setTgIdInput] = useState(() => String(telegramId || ''));
  const [tgIdSaved, setTgIdSaved] = useState(false);

  // Privacy toggles
  const [showIncome, setShowIncome] = useState(() => localStorage.getItem('midas_privacy_show_income') !== 'false');
  const [showExpenses, setShowExpenses] = useState(() => localStorage.getItem('midas_privacy_show_expenses') !== 'false');

  // Change PIN states
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Clear data modal & PIN confirmation
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetPinInput, setResetPinInput] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Support message
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [supportLoading, setSupportLoading] = useState(false);
  const [lastTicketId, setLastTicketId] = useState<string | null>(null);

  // Admin Dashboard (Protected by PIN 8642)
  const [adminPinInput, setAdminPinInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replySuccessMap, setReplySuccessMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (telegramId) {
      setTgIdInput(String(telegramId));
    }
  }, [telegramId]);

  const handleSaveTgId = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(tgIdInput.trim(), 10);
    if (isNaN(parsed) || parsed <= 0) {
      return;
    }
    setTelegramUserId(parsed);
    setTgIdSaved(true);
    setTimeout(() => setTgIdSaved(false), 3000);
  };

  const handleToggleIncome = (val: boolean) => {
    setShowIncome(val);
    localStorage.setItem('midas_privacy_show_income', String(val));
  };

  const handleToggleExpenses = (val: boolean) => {
    setShowExpenses(val);
    localStorage.setItem('midas_privacy_show_expenses', String(val));
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('midas_pin_code') || '1234';
    if (currentPinInput !== storedPin) {
      setPinMessage({ text: 'Текущий PIN введен неверно!', type: 'error' });
      return;
    }
    if (!/^\d{4}$/.test(newPinInput)) {
      setPinMessage({ text: 'Новый PIN должен состоять ровно из 4 цифр!', type: 'error' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinMessage({ text: 'Новые PIN-коды не совпадают!', type: 'error' });
      return;
    }

    localStorage.setItem('midas_pin_code', newPinInput);
    setPinMessage({ text: 'PIN-код успешно изменен! 🔒', type: 'success' });
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => setPinMessage(null), 4000);
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('midas_pin_code') || '1234';
    if (resetPinInput !== storedPin) {
      setResetError('Неверный PIN-код!');
      return;
    }

    clearAllTransactions();
    setResetSuccess(true);
    setResetError('');
    setTimeout(() => {
      setResetSuccess(false);
      setIsResetModalOpen(false);
      setResetPinInput('');
    }, 1500);
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportLoading(true);

    try {
      const res = await fetch(`${API_URL}/admin/support/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({
          telegram_id: telegramId,
          username: 'webapp_user',
          text: supportMessage.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setLastTicketId(data.id || 'SUBMITTED');
        setSupportSent(true);
        setSupportMessage('');
        setTimeout(() => setSupportSent(false), 8000);
      }
    } catch (err) {
      console.error("Support send error:", err);
    } finally {
      setSupportLoading(false);
    }
  };

  const loadAdminData = async () => {
    setAdminLoading(true);
    try {
      const [statsRes, msgsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats?pin=8642`, { headers: { 'Bypass-Tunnel-Reminder': 'true', 'X-Admin-Pin': '8642' } }),
        fetch(`${API_URL}/admin/support/messages`, { headers: { 'Bypass-Tunnel-Reminder': 'true' } })
      ]);
      if (statsRes.ok) {
        const s = await statsRes.json();
        setAdminStats(s);
      }
      if (msgsRes.ok) {
        const m = await msgsRes.json();
        setSupportMessages(m);
      }
    } catch (e) {
      console.error("Admin load error:", e);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput.trim() === '8642') {
      setIsAdminUnlocked(true);
      setAdminPinError('');
      loadAdminData();
    } else {
      setAdminPinError('Неверный PIN-код администратора!');
    }
  };

  const handleSendAdminReply = async (messageId: string) => {
    const text = replyTextMap[messageId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch(`${API_URL}/admin/support/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Bypass-Tunnel-Reminder': 'true' },
        body: JSON.stringify({ message_id: messageId, reply_text: text })
      });
      if (res.ok) {
        setReplySuccessMap((prev) => ({ ...prev, [messageId]: true }));
        loadAdminData();
      }
    } catch (e) {
      console.error("Reply error:", e);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-5 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="fintech-card p-5 sm:p-6 bg-gradient-to-r from-[#13111C] via-[#1A162B] to-[#0D0B14] border-[#C6FF33]/25 shadow-xl">
        <h1 className="text-xl md:text-2xl font-black text-white m-0 flex items-center gap-2.5">
          <Shield size={24} className="text-[#C6FF33]" />
          <span>Синхронизация & Настройки</span>
        </h1>
        <p className="m-0 mt-1.5 text-xs md:text-sm text-[#8E8A9E] font-medium">
          Связка Телефона и ПК, безопасность, обратная связь и админ-панель
        </p>
      </div>

      {/* 1. Telegram Cross-Device Sync (Телефон <-> ПК) */}
      <div className="fintech-card p-4 sm:p-5 border-[#C6FF33]/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase text-white tracking-wider m-0 flex items-center gap-2">
            <Smartphone size={16} className="text-[#C6FF33]" />
            <span>Синхронизация: Телефон ➔ Компьютер</span>
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#32D74B] animate-pulse" />
            <span className="text-[11px] font-bold text-[#32D74B]">Онлайн-синхронизация</span>
          </div>
        </div>

        <p className="text-xs text-[#8E8A9E] leading-relaxed mb-4">
          Записывай голосовые траты в боте <strong className="text-white">@GoldMidaas_bot</strong> на телефоне — и они мгновенно появятся здесь на компьютере!
        </p>

        <form onSubmit={handleSaveTgId} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-end">
          <div className="flex-1">
            <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
              Твой цифровой Telegram ID:
            </label>
            <input
              type="text"
              value={tgIdInput}
              onChange={(e) => setTgIdInput(e.target.value)}
              placeholder="Например: 123456789"
              className="fintech-input text-sm font-mono font-bold"
              required
            />
          </div>

          <button
            type="submit"
            className="fintech-btn-neon py-2.5 px-4 text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Check size={14} /> Сохранить ID
          </button>

          <button
            type="button"
            onClick={() => syncWithBackend()}
            disabled={isSyncing}
            className="fintech-btn-secondary py-2.5 px-4 text-xs font-black flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin text-[#C6FF33]" : ""} />
            {isSyncing ? "Синхронизирую..." : "Синхронизировать"}
          </button>
        </form>

        {tgIdSaved && (
          <div className="mt-3 text-xs font-bold text-[#32D74B] bg-[#32D74B]/10 p-2.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={15} /> Telegram ID успешно привязан! База синхронизирована с телефоном.
          </div>
        )}

        <div className="mt-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs text-[#8E8A9E]">
          <div>
            💡 <strong className="text-white">Как узнать свой ID?</strong> В боте <strong className="text-[#C6FF33]">@GoldMidaas_bot</strong> отправь команду <code className="bg-black/50 px-1 py-0.5 rounded text-[#C6FF33]">/id</code> или нажми кнопку «🆔 Мой ID».
          </div>
          {lastSyncTime && (
            <div className="text-[10px] text-[#6E6A7E] ml-2 whitespace-nowrap">
              Обновлено: {new Date(lastSyncTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* 2. Privacy Settings (Видимость данных) */}
      <div className="fintech-card p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase text-white tracking-wider m-0 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-[#C6FF33]" />
          <span>Видимость для друзей и рейтинга</span>
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-sm font-extrabold text-white">Показывать доходы друзьям</div>
              <div className="text-xs text-[#8E8A9E]">Для участия в борьбе за титул Легенды</div>
            </div>
            <input
              type="checkbox"
              checked={showIncome}
              onChange={(e) => handleToggleIncome(e.target.checked)}
              className="w-5 h-5 accent-[#C6FF33] cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-sm font-extrabold text-white">Показывать расходы друзьям</div>
              <div className="text-xs text-[#8E8A9E]">Для участия в рейтинге расходов</div>
            </div>
            <input
              type="checkbox"
              checked={showExpenses}
              onChange={(e) => handleToggleExpenses(e.target.checked)}
              className="w-5 h-5 accent-[#C6FF33] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. Security & Change PIN */}
      <div className="fintech-card p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase text-white tracking-wider m-0 mb-4 flex items-center gap-2">
          <KeyRound size={16} className="text-[#C6FF33]" />
          <span>Безопасность: Смена PIN-кода приложения</span>
        </h2>

        <form onSubmit={handleChangePin} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
              Текущий PIN (по умолчанию 1234)
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value)}
              className="fintech-input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                Новый PIN (4 цифры)
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                className="fintech-input"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                Повтори новый PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                className="fintech-input"
                required
              />
            </div>
          </div>

          {pinMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold ${
                pinMessage.type === 'success'
                  ? 'bg-[#32D74B]/15 text-[#32D74B]'
                  : 'bg-[#FF453A]/15 text-[#FF453A]'
              }`}
            >
              {pinMessage.text}
            </div>
          )}

          <div className="flex gap-3 mt-1">
            <button type="submit" className="fintech-btn-neon py-2.5 px-4 text-xs font-extrabold">
              Сохранить новый PIN
            </button>
            <a
              href="/lock"
              className="fintech-btn-secondary py-2.5 px-4 text-xs font-extrabold flex items-center justify-center gap-1.5"
            >
              <Lock size={13} /> Тест экрана входа
            </a>
          </div>
        </form>
      </div>

      {/* 4. Support Bot & Feedback Section */}
      <div className="fintech-card p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase text-white tracking-wider m-0 mb-3 flex items-center gap-2">
          <Send size={16} className="text-[#C6FF33]" />
          <span>Поддержка & Обратная связь (@GoldMidaasHelp_bot)</span>
        </h2>
        <p className="text-xs text-[#8E8A9E] font-medium mb-3">
          Возникли вопросы или нашли баг? Напиши нам — обращение поступит напрямую в бот поддержки и администратору!
        </p>

        <form onSubmit={handleSendSupport} className="flex flex-col gap-2.5">
          <textarea
            rows={3}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Опиши свой вопрос, идею или предложение..."
            className="fintech-input resize-none py-2.5"
            required
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <button
              type="submit"
              disabled={supportLoading}
              className="fintech-btn-neon py-2.5 px-5 text-xs font-extrabold flex items-center gap-1.5"
            >
              <Send size={13} /> {supportLoading ? 'Отправка...' : 'Отправить обращение'}
            </button>

            <a
              href="https://t.me/GoldMidaasHelp_bot"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#C6FF33] hover:underline flex items-center gap-1"
            >
              <MessageSquare size={13} /> Открыть бота поддержки @GoldMidaasHelp_bot ↗
            </a>
          </div>

          {supportSent && (
            <div className="mt-2 text-xs font-extrabold text-[#32D74B] bg-[#32D74B]/10 p-2.5 rounded-xl flex items-center gap-2">
              <Check size={14} /> Обращение #{lastTicketId} принято! Команда Midas ответит вам в ближайшее время.
            </div>
          )}
        </form>
      </div>

      {/* 5. Admin Dashboard (Protected by PIN 8642) */}
      <div className="fintech-card p-4 sm:p-5 border-amber-500/30 bg-gradient-to-br from-[#13111C] via-[#1B1510] to-[#120D1A]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black uppercase text-amber-400 tracking-wider m-0 flex items-center gap-2">
            <BarChart3 size={16} />
            <span>Панель Администратора (Статистика & Здоровье)</span>
          </h2>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
            PIN: 8642
          </span>
        </div>

        {!isAdminUnlocked ? (
          <form onSubmit={handleUnlockAdmin} className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-end mt-2">
            <div className="flex-1">
              <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                Введи секретный PIN-код администратора (8642):
              </label>
              <input
                type="password"
                maxLength={4}
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                placeholder="••••"
                className="fintech-input text-center text-base tracking-widest font-black"
                required
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-amber-500 text-black font-black text-xs hover:bg-amber-400 transition-all shadow-[0_0_12px_rgba(245,158,11,0.3)]"
            >
              Войти в админку
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#32D74B] font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Доступ администратора авторизован
              </span>
              <button
                type="button"
                onClick={loadAdminData}
                disabled={adminLoading}
                className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={11} className={adminLoading ? "animate-spin" : ""} /> Обновить статистику
              </button>
            </div>

            {adminStats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-[10px] text-[#8E8A9E] uppercase font-bold flex items-center gap-1">
                    <Users size={12} /> Пользователи
                  </div>
                  <div className="text-lg font-black text-white mt-1">
                    {adminStats.total_users || 0}
                  </div>
                  <div className="text-[10px] text-[#32D74B]">+{adminStats.users_today || 0} за 24ч</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-[10px] text-[#8E8A9E] uppercase font-bold flex items-center gap-1">
                    <BarChart3 size={12} /> Транзакции
                  </div>
                  <div className="text-lg font-black text-white mt-1">
                    {adminStats.total_transactions || 0}
                  </div>
                  <div className="text-[10px] text-[#8E8A9E]">Голосовых: {adminStats.voice_transactions_count || 0} 🎙</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-[10px] text-[#8E8A9E] uppercase font-bold">Оборот (₽)</div>
                  <div className="text-lg font-black text-[#C6FF33] mt-1">
                    {Number(adminStats.total_volume || 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[10px] text-[#8E8A9E]">Сумма всех трат</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <div className="text-[10px] text-[#8E8A9E] uppercase font-bold">Статус систем</div>
                  <div className="text-xs font-black text-[#32D74B] mt-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#32D74B]" /> API & DB: OK
                  </div>
                  <div className="text-[10px] text-[#8E8A9E]">Whisper: {adminStats.health?.whisper || 'ready'}</div>
                </div>
              </div>
            )}

            {/* Support Tickets Review */}
            <div className="mt-2">
              <h3 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-amber-400" />
                <span>Обращения пользователей ({supportMessages.length})</span>
              </h3>

              {supportMessages.length === 0 ? (
                <div className="p-3 rounded-xl bg-white/[0.02] text-xs text-[#8E8A9E] text-center">
                  Пока нет новых обращений
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {supportMessages.map((msg) => (
                    <div key={msg.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs">
                      <div className="flex justify-between items-center text-[#8E8A9E] mb-1">
                        <span className="font-bold text-white">@{msg.username || 'user'} (ID: {msg.telegram_id || 'n/a'})</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${msg.status === 'replied' ? 'bg-[#32D74B]/20 text-[#32D74B]' : 'bg-amber-500/20 text-amber-300'}`}>
                          {msg.status === 'replied' ? 'Отвечено' : 'Новый'}
                        </span>
                      </div>
                      <p className="text-white my-1 font-medium italic">«{msg.text}»</p>
                      
                      {msg.admin_reply && (
                        <div className="mt-1.5 p-2 rounded-lg bg-black/40 border border-white/[0.05] text-[11px] text-[#32D74B]">
                          Ответ админа: {msg.admin_reply}
                        </div>
                      )}

                      {msg.status !== 'replied' && (
                        <div className="mt-2 flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Написать ответ пользователю..."
                            value={replyTextMap[msg.id] || ''}
                            onChange={(e) => setReplyTextMap({ ...replyTextMap, [msg.id]: e.target.value })}
                            className="fintech-input text-xs py-1 px-2.5 flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendAdminReply(msg.id)}
                            className="px-3 py-1 bg-[#C6FF33] text-black font-black text-xs rounded-xl hover:bg-[#b0f51b] transition-all flex items-center gap-1"
                          >
                            <Reply size={12} /> Ответить
                          </button>
                        </div>
                      )}
                      {replySuccessMap[msg.id] && (
                        <div className="text-[10px] text-[#32D74B] mt-1 font-bold">
                          Ответ успешно отправлен!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {adminPinError && (
          <div className="mt-2 text-xs font-bold text-[#FF453A] bg-[#FF453A]/15 p-2 rounded-lg">
            {adminPinError}
          </div>
        )}
      </div>

      {/* 6. Danger Zone: Reset All Data with Password Confirmation */}
      <div className="fintech-card p-4 sm:p-5 border-[#FF453A]/30 bg-gradient-to-b from-[#13111C] to-[#1C1115]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black uppercase text-[#FF453A] tracking-wider m-0 flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>Опасная зона</span>
            </h2>
            <p className="text-xs text-[#8E8A9E] font-medium mt-1">
              Полный сброс всех транзакций, балансов и истории операций (требуется PIN).
            </p>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30 hover:bg-[#FF453A]/25 transition-all text-xs font-extrabold flex items-center gap-1.5 flex-shrink-0"
          >
            <Trash2 size={14} /> Обнулить всё
          </button>
        </div>
      </div>

      {/* Confirmation Modal with PIN protection */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="fintech-card w-full max-w-sm p-6 bg-[#13111C] border-[#FF453A]/40 shadow-2xl">
            <div className="flex items-center gap-2.5 text-[#FF453A] mb-3">
              <AlertTriangle size={22} />
              <h3 className="text-base font-black text-white m-0">
                Подтверждение обнуления
              </h3>
            </div>
            
            <p className="text-xs text-[#8E8A9E] leading-relaxed mb-4">
              Это действие безвозвратно удалит все добавленные доходы и расходы. Для подтверждения введи текущий PIN-код:
            </p>

            <form onSubmit={handleConfirmReset} className="flex flex-col gap-3">
              <input
                type="password"
                maxLength={4}
                placeholder="Введи PIN ••••"
                value={resetPinInput}
                onChange={(e) => setResetPinInput(e.target.value)}
                className="fintech-input text-center text-lg font-black tracking-widest"
                autoFocus
                required
              />

              {resetError && (
                <div className="text-xs font-bold text-[#FF453A] bg-[#FF453A]/15 p-2 rounded-lg text-center">
                  {resetError}
                </div>
              )}

              {resetSuccess && (
                <div className="text-xs font-bold text-[#32D74B] bg-[#32D74B]/15 p-2 rounded-lg text-center">
                  Все данные успешно обнулены! ✨
                </div>
              )}

              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => { setIsResetModalOpen(false); setResetPinInput(''); setResetError(''); }}
                  className="fintech-btn-secondary flex-1 py-2.5 text-xs font-extrabold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={resetSuccess}
                  className="flex-1 py-2.5 text-xs font-extrabold rounded-xl bg-[#FF453A] text-white hover:bg-[#FF453A]/90 transition-colors shadow-[0_0_12px_rgba(255,69,58,0.4)]"
                >
                  Подтвердить сброс
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
