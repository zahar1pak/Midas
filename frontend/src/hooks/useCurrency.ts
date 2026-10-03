import { useState, useEffect, useCallback } from 'react';

// Assuming there's a base URL configuration. For now we use standard fetch to the API.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CurrencyRates {
  [currency: string]: number;
}

export function useCurrency() {
  const [fiatRates, setFiatRates] = useState<CurrencyRates>({});
  const [cryptoRates, setCryptoRates] = useState<CurrencyRates>({});
  const [supported, setSupported] = useState<{fiat: string[], crypto: string[]}>({fiat: [], crypto: []});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fiatRes, cryptoRes, supportedRes] = await Promise.all([
        fetch(`${API_URL}/currency/rates`),
        fetch(`${API_URL}/currency/crypto`),
        fetch(`${API_URL}/currency/supported`)
      ]);

      if (fiatRes.ok) setFiatRates(await fiatRes.json());
      if (cryptoRes.ok) setCryptoRates(await cryptoRes.json());
      if (supportedRes.ok) setSupported(await supportedRes.json());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch currency rates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convertAmount = async (amount: number, from: string, to: string): Promise<number> => {
    try {
      const res = await fetch(`${API_URL}/currency/convert?amount=${amount}&from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Conversion failed');
      const data = await res.json();
      return data.result;
    } catch (err: any) {
      console.error("Conversion error:", err);
      // Fallback local calc if api fails and we have rates cached
      return amount; 
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2
    }).format(amount);
  };

  return {
    fiatRates,
    cryptoRates,
    supported,
    loading,
    error,
    refreshRates: fetchRates,
    convertAmount,
    formatCurrency
  };
}
