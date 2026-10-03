import React, { useState, useRef } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  X,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Edit2,
  Mic,
  MicOff,
  PlusCircle,
  PiggyBank
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import RubberSegment from '../components/ui/RubberSegment';
import SwipeRow from '../components/ui/SwipeRow';
import Counter from '../components/ui/Counter';
import {
  PixelCart,
  PixelBurger,
  PixelCar,
  PixelGamepad,
  PixelMoney,
  PixelLaptop,
  PixelTshirt,
  PixelBell,
  PixelCoin,
  PixelCrown,
  PixelPiggyBank,
  getCategoryPixelIcon
} from '../components/ui/PixelIcons';
import { CryptoSection } from '../components/currency/CryptoSection';
import { useTransactionsStore, type TransactionItem } from '../store/useTransactionsStore';

// Separate categories for Expenses vs Income vs Savings
const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Супермаркеты', icon: <PixelCart size={18} color="#C6FF33" /> },
  { name: 'Еда и кафе', icon: <PixelBurger size={18} color="#C6FF33" /> },
  { name: 'Транспорт', icon: <PixelCar size={18} color="#7D39EB" /> },
  { name: 'Развлечения', icon: <PixelGamepad size={18} color="#7D39EB" /> },
  { name: 'Одежда', icon: <PixelTshirt size={18} color="#C6FF33" /> },
  { name: 'Подписки', icon: <PixelBell size={18} color="#7D39EB" /> },
  { name: 'Прочее', icon: <PixelCoin size={18} color="#C6FF33" /> }
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Зарплата', icon: <PixelMoney size={18} color="#32D74B" /> },
  { name: 'Фриланс', icon: <PixelLaptop size={18} color="#C6FF33" /> },
  { name: 'Подарки', icon: <PixelCoin size={18} color="#FFA012" /> },
  { name: 'Кэшбэк', icon: <PixelCoin size={18} color="#32D74B" /> },
  { name: 'Инвестиции', icon: <PixelMoney size={18} color="#7D39EB" /> },
  { name: 'Прочее', icon: <PixelCoin size={18} color="#C6FF33" /> }
];

const DEFAULT_SAVING_CATEGORIES = [
  { name: 'Копилка', icon: <PixelPiggyBank size={18} color="#7D39EB" /> },
  { name: 'На мечту', icon: <PixelCrown size={18} color="#FFA012" /> },
  { name: 'Резервный фонд', icon: <PixelMoney size={18} color="#C6FF33" /> },
  { name: 'Инвест-депозит', icon: <PixelLaptop size={18} color="#7D39EB" /> }
];

const PIXEL_AVATAR_CHOICES = [
  { key: 'cart', label: 'Корзина', icon: <PixelCart size={20} color="#C6FF33" /> },
  { key: 'burger', label: 'Еда', icon: <PixelBurger size={20} color="#C6FF33" /> },
  { key: 'car', label: 'Авто', icon: <PixelCar size={20} color="#7D39EB" /> },
  { key: 'game', label: 'Игры', icon: <PixelGamepad size={20} color="#7D39EB" /> },
  { key: 'money', label: 'Деньги', icon: <PixelMoney size={20} color="#32D74B" /> },
  { key: 'laptop', label: 'Работа', icon: <PixelLaptop size={20} color="#7D39EB" /> },
  { key: 'piggy', label: 'Копилка', icon: <PixelPiggyBank size={20} color="#7D39EB" /> },
  { key: 'coin', label: 'Монета', icon: <PixelCoin size={20} color="#FFA012" /> },
];

export const HomePage: React.FC = () => {
  const transactions = useTransactionsStore((state) => state.transactions);
  const customCategories = useTransactionsStore((state) => state.customCategories);
  const addTransaction = useTransactionsStore((state) => state.addTransaction);
  const updateTransaction = useTransactionsStore((state) => state.updateTransaction);
  const deleteTransaction = useTransactionsStore((state) => state.deleteTransaction);
  const addCustomCategory = useTransactionsStore((state) => state.addCustomCategory);
  const getTotalIncome = useTransactionsStore((state) => state.getTotalIncome);
  const getTotalExpense = useTransactionsStore((state) => state.getTotalExpense);
  const getTotalSavings = useTransactionsStore((state) => state.getTotalSavings);
  const getBalance = useTransactionsStore((state) => state.getBalance);

  const [filter, setFilter] = useState<string>('Все');
  
  // 3 Smart Sort Toggles with 2 modes each:
  const [activeSortType, setActiveSortType] = useState<'date' | 'amount' | 'name'>('date');
  const [dateOrder, setDateOrder] = useState<'desc' | 'asc'>('desc'); // desc = Сначала новые
  const [amountOrder, setAmountOrder] = useState<'desc' | 'asc'>('desc'); // desc = Крупные ⬇
  const [nameOrder, setNameOrder] = useState<'asc' | 'desc'>('asc'); // asc = А-Я ⬇

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionItem | null>(null);

  // Form State
  const [newType, setNewType] = useState<'expense' | 'income' | 'saving'>('expense');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Супермаркеты');
  const [newDescription, setNewDescription] = useState('');
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Custom Category Creator Modal
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [customCatName, setCustomCatName] = useState('');
  const [customCatIcon, setCustomCatIcon] = useState('coin');

  // Web Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const totalSavings = getTotalSavings();
  const balance = getBalance();

  // Smart AI Analysis based on actual data & classic financial wisdom
  const aiAnalysis = React.useMemo(() => {
    if (transactions.length === 0) {
      return "«Часть всего, что ты зарабатываешь, принадлежит тебе по праву». Начни с записи первых доходов и откладывай минимум 10% в копилку капиталиста.";
    }
    if (totalExpense > totalIncome && totalIncome > 0) {
      return `Внимание: твои расходы превышают доходы на ${(totalExpense - totalIncome).toLocaleString('ru-RU')} ₽! По закону Вавилона контролируй каждую монету и урежь импульсивные траты.`;
    }
    // Find biggest spending category
    const expByCategory: Record<string, number> = {};
    transactions.filter((t) => t.type === 'expense').forEach((t) => {
      expByCategory[t.category] = (expByCategory[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(expByCategory).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0) {
      const [topCat, topVal] = sortedCats[0];
      const percent = totalExpense > 0 ? Math.round((topVal / totalExpense) * 100) : 0;
      return `Анализ трат: категория «${topCat}» съедает ${percent}% твоих расходов (${topVal.toLocaleString('ru-RU')} ₽). Как учит Роберт Кийосаки: богатые приобретают активы, а бедные — пассивы и расходы.`;
    }
    return "«Золото льется рекой к тому, кто умеет беречь десятую часть своего дохода». Сохраняй темп, баланс положительный!";
  }, [transactions, totalIncome, totalExpense]);

  // Voice recording handlers in Web
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendVoiceToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Не удалось получить доступ к микрофону. Проверь разрешения в браузере!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const sendVoiceToBackend = async (blob: Blob) => {
    setIsProcessingVoice(true);
    try {
      const formData = new FormData();
      formData.append('file', blob, 'voice_recording.webm');
      const res = await fetch('http://localhost:8000/transactions/voice', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.transaction) {
          const tx = data.transaction;
          addTransaction({
            type: tx.type || 'expense',
            amount: tx.amount || 0,
            currency: tx.currency || 'RUB',
            category: tx.category || 'Прочее',
            description: tx.description || data.transcription || 'Голосовая запись',
            date: 'Сегодня, ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            timestamp: Date.now()
          });
        }
      }
    } catch (e) {
      console.warn("Backend voice processing fallback:", e);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Filter & 3-Button Dual-Mode Sorting
  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'Расходы') return t.type === 'expense';
    if (filter === 'Доходы') return t.type === 'income';
    if (filter === 'Копилка') return t.type === 'saving';
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (activeSortType === 'date') {
      const timeA = a.timestamp || Number(a.id) || 0;
      const timeB = b.timestamp || Number(b.id) || 0;
      return dateOrder === 'desc' ? timeB - timeA : timeA - timeB;
    }
    if (activeSortType === 'amount') {
      return amountOrder === 'desc'
        ? b.amount - a.amount
        : a.amount - b.amount;
    }
    if (activeSortType === 'name') {
      return nameOrder === 'asc'
        ? a.description.localeCompare(b.description, 'ru')
        : b.description.localeCompare(a.description, 'ru');
    }
    return 0;
  });

  const handleOpenEdit = (tx: TransactionItem) => {
    setEditingTransaction(tx);
    setNewType(tx.type);
    setNewAmount(String(tx.amount));
    setNewCategory(tx.category);
    setNewDescription(tx.description);
    if (tx.timestamp) {
      setCustomDate(new Date(tx.timestamp).toISOString().split('T')[0]);
    } else {
      setCustomDate(new Date().toISOString().split('T')[0]);
    }
    setIsModalOpen(true);
  };

  const handleOpenCreate = (type: 'expense' | 'income' | 'saving') => {
    setEditingTransaction(null);
    setNewType(type);
    setNewAmount('');
    if (type === 'income') setNewCategory('Зарплата');
    else if (type === 'saving') setNewCategory('Копилка');
    else setNewCategory('Супермаркеты');
    setNewDescription('');
    setCustomDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(Number(newAmount))) return;

    const parsedAmount = Math.abs(Number(newAmount));
    const fallbackDesc = newType === 'income' ? 'Доход' : newType === 'saving' ? 'Отложено в копилку' : 'Расход';
    const desc = newDescription.trim() || fallbackDesc;

    const selectedDateTime = customDate ? new Date(customDate).getTime() : Date.now();
    const formattedDate = customDate
      ? new Date(customDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) + ', ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      : 'Сегодня, ' + new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        type: newType,
        amount: parsedAmount,
        category: newCategory,
        description: desc,
        date: formattedDate,
        timestamp: selectedDateTime
      });
    } else {
      addTransaction({
        type: newType,
        amount: parsedAmount,
        currency: 'RUB',
        category: newCategory,
        description: desc,
        date: formattedDate,
        timestamp: selectedDateTime
      });
    }

    setNewAmount('');
    setNewDescription('');
    setEditingTransaction(null);
    setIsModalOpen(false);
  };

  // Combine standard and custom categories for the currently active type
  const availableCategories = React.useMemo(() => {
    let base = DEFAULT_EXPENSE_CATEGORIES;
    if (newType === 'income') base = DEFAULT_INCOME_CATEGORIES;
    if (newType === 'saving') base = DEFAULT_SAVING_CATEGORIES;

    const userAdded = customCategories.filter(c => c.type === newType).map(c => ({
      name: c.name,
      icon: getCategoryPixelIcon(c.name, 18)
    }));

    return [...base, ...userAdded];
  }, [newType, customCategories]);

  const handleCreateCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = customCatName.trim();
    if (!cleanName) return;

    addCustomCategory({
      name: cleanName,
      type: newType,
      iconKey: customCatIcon,
      color: newType === 'income' ? '#32D74B' : newType === 'saving' ? '#7D39EB' : '#C6FF33'
    });

    setNewCategory(cleanName);
    setCustomCatName('');
    setIsAddCatModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-full">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Portfolio Card, Quick Actions, Stats & Midas AI */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* 1. Portfolio Snapshot Header */}
          <div className="fintech-card p-6 text-center bg-gradient-to-b from-[#13111C] to-[#0D0B14] border-[#C6FF33]/20 shadow-xl">
            <div className="text-xs font-bold text-[#8E8A9E] uppercase tracking-wider mb-1">
              Portfolio Snapshot
            </div>

            {/* Counter Animated Digits for Balance */}
            <div className="flex items-center justify-center gap-1.5 my-2">
              <span className={`text-3xl font-black ${balance >= 0 ? 'text-[#C6FF33]' : 'text-[#FF453A]'}`}>
                {balance >= 0 ? '' : '-'}
              </span>
              <Counter
                key={`home-bal-${balance}`}
                value={Math.abs(balance)}
                fontSize={40}
                textColor="#FFFFFF"
                fontWeight={900}
                gap={2}
              />
              <span className="text-2xl font-black text-[#C6FF33]">₽</span>
            </div>

            {/* Growth badge pill */}
            <div className="inline-flex items-center gap-1.5 mt-1">
              <span className="text-xs font-extrabold text-[#C6FF33] bg-[#C6FF33]/10 px-3 py-1 rounded-full border border-[#C6FF33]/25">
                +{((totalIncome > 0 ? (balance / totalIncome) * 100 : 0)).toFixed(1)}% за всё время
              </span>
            </div>

            {/* Action Buttons: Logical Arrows and 3rd Saving Action */}
            <div className="grid grid-cols-3 gap-2 mt-5">
              {/* + Доход: Зеленый с входящей стрелкой */}
              <button
                onClick={() => handleOpenCreate('income')}
                className="fintech-btn-secondary py-3 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-bold"
              >
                <ArrowDownLeft size={16} className="text-[#32D74B]" /> + Доход
              </button>

              {/* - Расход: Неоновый с исходящей стрелкой */}
              <button
                onClick={() => handleOpenCreate('expense')}
                className="fintech-btn-neon py-3 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-bold"
              >
                <ArrowUpRight size={16} className="text-[#0A0910]" /> - Расход
              </button>

              {/* 🏦 Копилка: Отложить сбережения */}
              <button
                onClick={() => handleOpenCreate('saving')}
                className="bg-[#7D39EB]/20 border border-[#7D39EB]/50 hover:bg-[#7D39EB]/30 text-white rounded-2xl py-3 text-xs sm:text-sm flex items-center justify-center gap-1.5 font-bold transition-all shadow-[0_0_12px_rgba(125,57,235,0.25)]"
              >
                <PiggyBank size={16} className="text-[#C6FF33]" /> Копилка
              </button>
            </div>

            {/* In-app Voice Recording Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-[#FF453A] animate-ping' : 'bg-[#C6FF33]'}`} />
                <span className="text-xs font-bold text-[#8E8A9E]">
                  {isRecording ? `Запись: ${recordingSeconds} сек...` : isProcessingVoice ? 'Распознавание речи... ⏳' : 'Голосовой ввод в вебе'}
                </span>
              </div>

              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={isProcessingVoice}
                  className="px-3 py-1.5 bg-[#C6FF33]/15 border border-[#C6FF33]/30 hover:bg-[#C6FF33]/25 text-[#C6FF33] rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all"
                >
                  <Mic size={14} /> Записать ГС
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-3 py-1.5 bg-[#FF453A] text-white rounded-full text-xs font-black flex items-center gap-1.5 animate-pulse"
                >
                  <MicOff size={14} /> Стоп & Сохранить
                </button>
              )}
            </div>
          </div>

          {/* 2. Income, Expenses & Savings Mini Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="fintech-card p-3 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-extrabold text-[#32D74B] flex items-center gap-1 tracking-wider">
                <ArrowDownLeft size={13} /> ДОХОДЫ
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                <span className="text-sm sm:text-base font-black text-[#32D74B] leading-none">+</span>
                <Counter key={`home-inc-${totalIncome}`} value={totalIncome} fontSize={16} textColor="#FFFFFF" fontWeight={900} />
                <span className="text-[11px] font-bold text-gray-400">₽</span>
              </div>
            </div>

            <div className="fintech-card p-3 sm:p-4">
              <div className="text-[10px] sm:text-[11px] font-extrabold text-[#FF453A] flex items-center gap-1 tracking-wider">
                <ArrowUpRight size={13} /> РАСХОДЫ
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                <span className="text-sm sm:text-base font-black text-[#FF453A] leading-none">-</span>
                <Counter key={`home-exp-${totalExpense}`} value={totalExpense} fontSize={16} textColor="#FFFFFF" fontWeight={900} />
                <span className="text-[11px] font-bold text-gray-400">₽</span>
              </div>
            </div>

            <div className="fintech-card p-3 sm:p-4 bg-[#7D39EB]/10 border-[#7D39EB]/25">
              <div className="text-[10px] sm:text-[11px] font-extrabold text-[#7D39EB] flex items-center gap-1.5 tracking-wider">
                <PixelPiggyBank size={14} color="#7D39EB" /> КОПИЛКА
              </div>
              <div className="mt-2 flex items-center gap-0.5">
                <span className="text-sm sm:text-base font-black text-[#7D39EB] leading-none">+</span>
                <Counter key={`home-sav-${totalSavings}`} value={totalSavings} fontSize={16} textColor="#FFFFFF" fontWeight={900} />
                <span className="text-[11px] font-bold text-gray-400">₽</span>
              </div>
            </div>
          </div>

          {/* 3. Midas AI Financial Intelligence Card */}
          <div className="fintech-card p-5 bg-gradient-to-br from-[#1A162B] via-[#13111C] to-[#0A0910] border-[#7D39EB]/35 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#7D39EB]/25 flex items-center justify-center">
                  <Sparkles size={16} className="text-[#C6FF33]" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase text-[#C6FF33] tracking-wider block">
                    Midas AI
                  </span>
                  <span className="text-[10px] text-[#8E8A9E] font-bold">Финансовая мудрость</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed m-0">
              {aiAnalysis}
            </p>
          </div>
        </div>

        {/* Right Column: Transactions History, Filter, Smart Dual Sorting */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Header & Filter Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-extrabold m-0 text-white flex items-center gap-2">
              <span>История операций</span>
              <span className="text-xs font-bold text-[#8E8A9E] px-2 py-0.5 rounded-full bg-white/5">
                {sortedTransactions.length}
              </span>
            </h2>

            {/* RubberSegment Filter with 4 tabs: Все, Расходы, Доходы, Копилка */}
            <RubberSegment
              items={['Все', 'Расходы', 'Доходы', 'Копилка']}
              value={filter}
              onChange={(val) => setFilter(val)}
              trackColor="#151320"
              thumbColor="#C6FF33"
              textColor="#8E8A9E"
              activeTextColor="#0A0910"
              size="sm"
              radius={9999}
              inset={2}
              stretch={45}
              squash={2}
              speed={0.85}
            />
          </div>

          {/* 3-Button Dual-Mode Sort Hub */}
          <div className="flex items-center gap-2 bg-[#13111C] p-2 rounded-2xl border border-white/5 overflow-x-auto">
            <span className="text-xs font-bold text-[#8E8A9E] whitespace-nowrap pl-1 mr-1">
              Сортировка:
            </span>

            {/* 1. Date Button */}
            <button
              onClick={() => {
                if (activeSortType === 'date') setDateOrder(dateOrder === 'desc' ? 'asc' : 'desc');
                else setActiveSortType('date');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeSortType === 'date'
                  ? 'bg-[#C6FF33] text-[#0A0910] shadow-[0_0_12px_rgba(198,255,51,0.3)]'
                  : 'bg-white/[0.04] text-[#8E8A9E] hover:text-white'
              }`}
            >
              <Calendar size={13} />
              <span>{dateOrder === 'desc' ? 'Сначала новые ⬇' : 'Сначала старые ⬆'}</span>
            </button>

            {/* 2. Amount Button */}
            <button
              onClick={() => {
                if (activeSortType === 'amount') setAmountOrder(amountOrder === 'desc' ? 'asc' : 'desc');
                else setActiveSortType('amount');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeSortType === 'amount'
                  ? 'bg-[#7D39EB] text-white shadow-[0_0_12px_rgba(125,57,235,0.4)]'
                  : 'bg-white/[0.04] text-[#8E8A9E] hover:text-white'
              }`}
            >
              <DollarSign size={13} />
              <span>{amountOrder === 'desc' ? 'Крупные ⬇' : 'Мелкие ⬆'}</span>
            </button>

            {/* 3. Name Button */}
            <button
              onClick={() => {
                if (activeSortType === 'name') setNameOrder(nameOrder === 'asc' ? 'desc' : 'asc');
                else setActiveSortType('name');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeSortType === 'name'
                  ? 'bg-white text-[#0A0910] shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.04] text-[#8E8A9E] hover:text-white'
              }`}
            >
              <ArrowUpDown size={13} />
              <span>{nameOrder === 'asc' ? 'А-Я ⬇' : 'Я-А ⬆'}</span>
            </button>
          </div>

          {/* Transactions List with Edit & Swipe-to-delete */}
          <div className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {sortedTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <SwipeRow
                    height={66}
                    radius={16}
                    actionWidth={75}
                    actionColor="#FF453A"
                    drawerColor="#1E192D"
                    rowColor="#13111C"
                    onCommit={(a) => {
                      if (a.id === 'delete') {
                        handleDeleteTransaction(tx.id);
                      }
                    }}
                    actions={[
                      {
                        id: 'delete',
                        label: 'Удалить',
                        color: '#FF453A',
                        dismiss: true,
                        onSelect: () => handleDeleteTransaction(tx.id)
                      },
                      {
                        id: 'edit',
                        label: 'Изменить',
                        icon: <Edit2 size={16} />,
                        color: '#7D39EB',
                        dismiss: false,
                        onSelect: () => handleOpenEdit(tx)
                      }
                    ]}
                  >
                    <div
                      onClick={() => handleOpenEdit(tx)}
                      className="w-full flex items-center justify-between cursor-pointer group"
                      title="Нажми для редактирования или свайпни влево"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:border-[#C6FF33]/40 transition-colors">
                          {getCategoryPixelIcon(tx.category, 22)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white group-hover:text-[#C6FF33] transition-colors truncate flex items-center gap-1.5">
                            <span>{tx.description}</span>
                            <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-[#8E8A9E] transition-opacity" />
                          </div>
                          <div className="text-xs text-[#8E8A9E] font-medium mt-1">
                            {tx.category} • {tx.date}
                          </div>
                        </div>
                      </div>

                      {/* Vertically centered sign with Counter */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.type === 'income' ? 'bg-[#32D74B]' : tx.type === 'saving' ? 'bg-[#7D39EB]' : 'bg-[#FF453A]'
                          }`}
                        />
                        <div
                          className={`text-sm sm:text-base font-black flex items-center gap-1 ${
                            tx.type === 'income' ? 'text-[#32D74B]' : tx.type === 'saving' ? 'text-[#C6FF33]' : 'text-white'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <span className="text-base font-black leading-none">+</span>
                          ) : tx.type === 'saving' ? (
                            <PixelPiggyBank size={14} color="#C6FF33" />
                          ) : (
                            <span className="text-base font-black leading-none">-</span>
                          )}
                          <Counter
                            key={`tx-${tx.id}-${tx.amount}`}
                            value={tx.amount}
                            fontSize={15}
                            textColor={tx.type === 'income' ? '#32D74B' : tx.type === 'saving' ? '#C6FF33' : '#FFFFFF'}
                            fontWeight={900}
                          />
                          <span className="text-xs ml-0.5">₽</span>
                        </div>
                      </div>
                    </div>
                  </SwipeRow>
                </motion.div>
              ))}
            </AnimatePresence>

            {sortedTransactions.length === 0 && (
              <div className="fintech-card p-10 text-center text-[#8E8A9E]">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-sm font-bold text-white">Пока нет записей о доходах и расходах</div>
                <div className="text-xs mt-1">Нажми «+ Доход», «- Расход» или «Копилка», чтобы начать вести капитал!</div>
              </div>
            )}
          </div>

          {/* Crypto Section */}
          <div className="mt-2">
            <CryptoSection />
          </div>
        </div>

      </div>

      {/* Modal for Adding or Editing Transaction with Compact Scrollable Body & Sticky Footer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="fintech-card w-full max-w-sm bg-[#13111C] border-[#C6FF33]/30 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
              <h3 className="text-base font-black text-white m-0 flex items-center gap-2">
                {editingTransaction ? (
                  <>
                    <Edit2 size={16} className="text-[#C6FF33]" /> Редактировать запись
                  </>
                ) : newType === 'expense' ? (
                  <>
                    <PixelCoin size={18} color="#FF453A" /> Записать расход
                  </>
                ) : newType === 'saving' ? (
                  <>
                    <PixelPiggyBank size={18} color="#7D39EB" /> Отложить в копилку
                  </>
                ) : (
                  <>
                    <PixelMoney size={18} color="#32D74B" /> Записать доход
                  </>
                )}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8E8A9E] hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveTransaction} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3.5">
                
                {/* Type Switcher with RubberSegment (3 types: Расход, Доход, Копилка) */}
                <div className="flex justify-center flex-shrink-0">
                  <RubberSegment
                    items={[
                      { value: 'expense', label: 'Расход' },
                      { value: 'income', label: 'Доход' },
                      { value: 'saving', label: 'Копилка' }
                    ]}
                    value={newType}
                    onChange={(val) => {
                      const t = val as 'expense' | 'income' | 'saving';
                      setNewType(t);
                      if (t === 'income') setNewCategory('Зарплата');
                      else if (t === 'saving') setNewCategory('Копилка');
                      else setNewCategory('Супермаркеты');
                    }}
                    trackColor="#0A0910"
                    thumbColor={newType === 'income' ? '#32D74B' : newType === 'saving' ? '#7D39EB' : '#FF453A'}
                    textColor="#8E8A9E"
                    activeTextColor={newType === 'saving' ? '#FFFFFF' : '#0A0910'}
                    size="sm"
                    radius={9999}
                    inset={2}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                    Сумма (₽)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="fintech-input py-2 text-sm"
                    required
                    autoFocus
                  />
                </div>

                {/* Date Input for Past/Backdated Transactions */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1 flex items-center justify-between">
                    <span>Дата операции</span>
                    <span className="text-[10px] text-[#C6FF33] font-bold">Выбор прошедшей</span>
                  </label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="fintech-input py-2 text-xs"
                    required
                  />
                </div>

                {/* Category (Compact Grid with Pill Buttons) */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E]">
                      Категория: <span className="text-white font-bold">{newCategory}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddCatModalOpen(true)}
                      className="text-[11px] font-bold text-[#C6FF33] hover:underline flex items-center gap-1"
                    >
                      <PlusCircle size={12} /> + Своя
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {availableCategories.map((c) => {
                      const isSelected = newCategory === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setNewCategory(c.name)}
                          className={`flex items-center gap-2 p-1.5 px-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#C6FF33]/15 border-[#C6FF33] text-white shadow-[0_0_10px_rgba(198,255,51,0.2)]'
                              : 'bg-white/[0.03] border-white/[0.08] text-[#8E8A9E] hover:border-white/20'
                          }`}
                        >
                          <div className="flex-shrink-0">{c.icon}</div>
                          <span className="text-xs font-bold truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                    Описание / Заметка
                  </label>
                  <input
                    type="text"
                    placeholder="Например: покупка продуктов"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="fintech-input py-2 text-xs"
                  />
                </div>

              </div>

              {/* Sticky Modal Footer (Never overflows screen) */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0A0910] flex-shrink-0">
                <button
                  type="submit"
                  className="fintech-btn-neon w-full py-3 text-sm font-black"
                >
                  {editingTransaction ? 'Сохранить изменения ✓' : 'Сохранить операцию 🚀'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal for Creating Custom Category */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="fintech-card w-full max-w-sm p-6 bg-[#13111C] border-[#C6FF33]/30 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-white m-0">
                Новая категория ({newType === 'income' ? 'Доход' : newType === 'saving' ? 'Копилка' : 'Расход'})
              </h3>
              <button onClick={() => setIsAddCatModalOpen(false)} className="text-[#8E8A9E] hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomCategory} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-1">
                  Название категории
                </label>
                <input
                  type="text"
                  placeholder="Например: Кофейни или Хобби"
                  value={customCatName}
                  onChange={(e) => setCustomCatName(e.target.value)}
                  className="fintech-input"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase text-[#8E8A9E] block mb-2">
                  Выбери пиксельную иконку
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PIXEL_AVATAR_CHOICES.map((choice) => (
                    <button
                      key={choice.key}
                      type="button"
                      onClick={() => setCustomCatIcon(choice.key)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        customCatIcon === choice.key
                          ? 'bg-[#C6FF33]/15 border-[#C6FF33] shadow-[0_0_12px_rgba(198,255,51,0.25)]'
                          : 'bg-white/[0.03] border-white/10'
                      }`}
                    >
                      <div className="mb-1">{choice.icon}</div>
                      <span className="text-[10px] text-gray-300 font-bold">{choice.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="fintech-btn-neon w-full py-3 text-sm mt-2">
                Создать категорию ⚡
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
