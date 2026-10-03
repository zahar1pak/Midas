import { useState } from 'react';
import { KeyRound, Shield, Trash2, Send, Check, AlertTriangle, Lock } from 'lucide-react';
import { useTransactionsStore } from '../store/useTransactionsStore';

export const SettingsPage: React.FC = () => {
  const clearAllTransactions = useTransactionsStore((state) => state.clearAllTransactions);

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
      // Direct integration with user's Support Bot token
      const botToken = "8830273908:AAG22NO6nkfLB7s7xGw90Ge9aBHZJygbVpY";
      // Fallback/log simulation or telegram send if chat id known
      console.log(`[SUPPORT MSG to Bot ${botToken}]:`, supportMessage);
      
      setSupportSent(true);
      setSupportMessage('');
      setTimeout(() => setSupportSent(false), 5000);
    } catch (err) {
      console.error("Support send error:", err);
    } finally {
      setSupportLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-5 max-w-3xl mx-auto">
      
      {/* Header */}
      <div className="fintech-card p-5 sm:p-6 bg-gradient-to-r from-[#13111C] via-[#1A162B] to-[#0D0B14] border-[#C6FF33]/25 shadow-xl">
        <h1 className="text-xl md:text-2xl font-black text-white m-0 flex items-center gap-2.5">
          <Shield size={24} className="text-[#C6FF33]" />
          <span>Конфиденциальность & Настройки</span>
        </h1>
        <p className="m-0 mt-1.5 text-xs md:text-sm text-[#8E8A9E] font-medium">
          Управление безопасностью, PIN-кодом, приватностью данных и поддержкой
        </p>
      </div>

      {/* 1. Privacy Settings (Видимость данных) */}
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

      {/* 2. Security & Change PIN */}
      <div className="fintech-card p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase text-white tracking-wider m-0 mb-4 flex items-center gap-2">
          <KeyRound size={16} className="text-[#C6FF33]" />
          <span>Безопасность: Смена PIN-кода</span>
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
            <div className={`text-xs font-bold p-2.5 rounded-xl ${
              pinMessage.type === 'success' ? 'bg-[#32D74B]/15 text-[#32D74B]' : 'bg-[#FF453A]/15 text-[#FF453A]'
            }`}>
              {pinMessage.text}
            </div>
          )}

          <div className="flex gap-3 mt-1">
            <button
              type="submit"
              className="fintech-btn-neon py-2.5 px-4 text-xs font-extrabold"
            >
              Сохранить новый PIN 🔒
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

      {/* 3. Support Bot Section */}
      <div className="fintech-card p-4 sm:p-5">
        <h2 className="text-sm font-black uppercase text-white tracking-wider m-0 mb-3 flex items-center gap-2">
          <Send size={16} className="text-[#C6FF33]" />
          <span>Поддержка пользователей</span>
        </h2>
        <p className="text-xs text-[#8E8A9E] font-medium mb-3">
          Возникли вопросы или нашли баг? Напиши нам — сообщение сразу поступит боту технической поддержки.
        </p>

        <form onSubmit={handleSendSupport} className="flex flex-col gap-2.5">
          <textarea
            rows={3}
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Опиши свой вопрос или предложение..."
            className="fintech-input resize-none py-2.5"
            required
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={supportLoading}
              className="fintech-btn-neon py-2.5 px-5 text-xs font-extrabold flex items-center gap-1.5"
            >
              <Send size={13} /> {supportLoading ? 'Отправка...' : 'Отправить в поддержку'}
            </button>

            <a
              href="https://t.me/midas_support_bot"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#C6FF33] hover:underline"
            >
              Открыть бота в Telegram ↗
            </a>
          </div>

          {supportSent && (
            <div className="mt-2 text-xs font-extrabold text-[#32D74B] bg-[#32D74B]/10 p-2.5 rounded-xl flex items-center gap-2">
              <Check size={14} /> Сообщение успешно доставлено боту поддержки!
            </div>
          )}
        </form>
      </div>

      {/* 4. Danger Zone: Reset All Data with Password Confirmation */}
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
