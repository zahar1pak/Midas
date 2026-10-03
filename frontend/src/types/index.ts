export interface User {
  id: string;
  telegram_id: number;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  base_currency: string;
  pin_hash?: string;
  privacy_show_income: boolean;
  privacy_show_expenses: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id?: string;
  name: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  is_system: boolean;
  color: string;
}

export interface Tag {
  id: string;
  user_id?: string;
  name: string;
  is_system: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  amount_base: number;
  exchange_rate: number;
  category_id: string;
  description?: string;
  source: 'voice' | 'manual' | 'bot';
  raw_text?: string;
  transaction_date: string;
  created_at: string;
  category?: Category;
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  friend_details?: User;
}

export interface Group {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface RankingEntry {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  total_expenses: number;
  total_income: number;
  is_king: boolean;
  is_jester: boolean;
}
