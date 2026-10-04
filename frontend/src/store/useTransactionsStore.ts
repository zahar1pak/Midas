import { create } from 'zustand';

export interface CustomCategoryItem {
  id: string;
  name: string;
  type: 'expense' | 'income' | 'saving';
  iconKey: string; // key in PixelIcons or emoji
  color: string;
}

export interface TransactionItem {
  id: string;
  type: 'expense' | 'income' | 'saving';
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  timestamp?: number;
}

interface TransactionsState {
  transactions: TransactionItem[];
  customCategories: CustomCategoryItem[];
  addTransaction: (tx: Omit<TransactionItem, 'id'>) => void;
  updateTransaction: (id: string, updated: Partial<Omit<TransactionItem, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  setTransactions: (txs: TransactionItem[]) => void;
  addCustomCategory: (cat: Omit<CustomCategoryItem, 'id'>) => void;
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getTotalSavings: () => number;
  getBalance: () => number;
  syncWithBackend: () => Promise<void>;
}

const STORAGE_KEY = 'midas_transactions_data';
const CATEGORIES_KEY = 'midas_custom_categories_data';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getTelegramUserId = (): number => {
  try {
    const tg = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    if (tg?.id) {
      localStorage.setItem('midas_telegram_id', String(tg.id));
      return Number(tg.id);
    }
    const saved = localStorage.getItem('midas_telegram_id');
    if (saved) return Number(saved);
  } catch (e) {
    // ignore
  }
  return 8726556932;
};

const getInitialData = (): TransactionItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load transactions from localStorage", err);
  }
  return [];
};

const getInitialCustomCategories = (): CustomCategoryItem[] => {
  try {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load custom categories from localStorage", err);
  }
  return [];
};

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: getInitialData(),
  customCategories: getInitialCustomCategories(),

  syncWithBackend: async () => {
    const telegramId = getTelegramUserId();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`${API_URL}/transactions/sync?telegram_id=${telegramId}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const serverTxs: TransactionItem[] = await res.json();
        if (Array.isArray(serverTxs) && serverTxs.length > 0) {
          // Merge server transactions with local transactions by id
          const localTxs = get().transactions;
          const mergedMap = new Map<string, TransactionItem>();
          
          // Put server items first
          for (const tx of serverTxs) {
            mergedMap.set(String(tx.id), tx);
          }
          // Preserve any un-synced local items
          for (const tx of localTxs) {
            if (!mergedMap.has(String(tx.id))) {
              mergedMap.set(String(tx.id), tx);
              // Push local un-synced item to server in background
              fetch(`${API_URL}/transactions/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegram_id: telegramId, transaction: tx })
              }).catch(() => {});
            }
          }

          const mergedList = Array.from(mergedMap.values()).sort((a, b) => {
            const tA = a.timestamp || Number(a.id) || 0;
            const tB = b.timestamp || Number(b.id) || 0;
            return tB - tA;
          });

          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
          set({ transactions: mergedList });
        }
      }
    } catch (e) {
      // Offline fallback: keep local data
    }
  },

  addTransaction: (txData) => {
    const newTx: TransactionItem = {
      ...txData,
      id: String(Date.now()),
      timestamp: txData.timestamp || Date.now()
    };
    const updated = [newTx, ...get().transactions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ transactions: updated });

    // Sync to backend asynchronously
    const telegramId = getTelegramUserId();
    fetch(`${API_URL}/transactions/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: telegramId,
        transaction: newTx
      })
    }).catch(() => {});
  },

  updateTransaction: (id, updatedFields) => {
    const updated = get().transactions.map((t) =>
      t.id === id ? { ...t, ...updatedFields } : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ transactions: updated });

    const target = updated.find(t => t.id === id);
    if (target) {
      fetch(`${API_URL}/transactions/sync/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target)
      }).catch(() => {});
    }
  },

  deleteTransaction: (id) => {
    const updated = get().transactions.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ transactions: updated });

    fetch(`${API_URL}/transactions/sync/${id}`, {
      method: 'DELETE'
    }).catch(() => {});
  },

  clearAllTransactions: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    set({ transactions: [] });

    const telegramId = getTelegramUserId();
    fetch(`${API_URL}/transactions/sync/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram_id: telegramId })
    }).catch(() => {});
  },

  setTransactions: (txs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
    set({ transactions: txs });
  },

  addCustomCategory: (catData) => {
    const newCat: CustomCategoryItem = {
      ...catData,
      id: `custom-cat-${Date.now()}`
    };
    const updated = [...get().customCategories, newCat];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    set({ customCategories: updated });
  },

  getTotalIncome: () => {
    return get().transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalExpense: () => {
    return get().transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getTotalSavings: () => {
    return get().transactions
      .filter((t) => t.type === 'saving')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getBalance: () => {
    return get().getTotalIncome() - get().getTotalExpense();
  }
}));

// Automatically trigger sync on module load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useTransactionsStore.getState().syncWithBackend?.();
  }, 300);
}
