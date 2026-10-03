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
}

const STORAGE_KEY = 'midas_transactions_data';
const CATEGORIES_KEY = 'midas_custom_categories_data';

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
  // Clean fresh start: 0 initial transactions
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

  addTransaction: (txData) => {
    const newTx: TransactionItem = {
      ...txData,
      id: String(Date.now()),
      timestamp: txData.timestamp || Date.now()
    };
    const updated = [newTx, ...get().transactions];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ transactions: updated });
  },

  updateTransaction: (id, updatedFields) => {
    const updated = get().transactions.map((t) =>
      t.id === id ? { ...t, ...updatedFields } : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ transactions: updated });
  },

  deleteTransaction: (id) => {
    const updated = get().transactions.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ transactions: updated });
  },

  clearAllTransactions: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    set({ transactions: [] });
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
    // Чистый капитал = Доходы - Расходы (сбережения сохранены в копилке)
    return get().getTotalIncome() - get().getTotalExpense();
  }
}));
