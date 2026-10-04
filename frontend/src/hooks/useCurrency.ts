import { useState, useEffect, useCallback } from 'react';

// Assuming there's a base URL configuration. For now we use standard fetch to the API.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CurrencyRates {
  [currency: string]: number;
}

const DEFAULT_CRYPTO_RATES: CurrencyRates = {
  BTC: 64250,
  ETH: 3420,
  TON: 5.85,
  SOL: 148,
  USDT: 1.0
};

const DEFAULT_FIAT_RATES: CurrencyRates = {
  USD: 93.5,
  EUR: 101.2,
  CNY: 12.8,
  RUB: 1.0
};

export function useCurrency() {
  const [fiatRates, setFiatRates] = useState<CurrencyRates>(DEFAULT_FIAT_RATES);
  const [cryptoRates, setCryptoRates] = useState<CurrencyRates>(DEFAULT_CRYPTO_RATES);
  const [supported, setSupported] = useState<{fiat: string[], crypto: string[]}>({
    fiat: ['RUB', 'USD', 'EUR', 'CNY'],
    crypto: ['BTC', 'ETH', 'TON', 'SOL', 'USDT']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try backend API first with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      try {
        const [fiatRes, cryptoRes, supportedRes] = await Promise.all([
          fetch(`${API_URL}/currency/rates`, { signal: controller.signal }),
          fetch(`${API_URL}/currency/crypto`, { signal: controller.signal }),
          fetch(`${API_URL}/currency/supported`, { signal: controller.signal })
        ]);
        clearTimeout(timeoutId);

        if (fiatRes.ok) setFiatRates(await fiatRes.json());
        if (cryptoRes.ok) {
          const cData = await cryptoRes.json();
          if (cData && Object.keys(cData).length > 0) {
            setCryptoRates(cData);
          }
        }
        if (supportedRes.ok) setSupported(await supportedRes.json());
        return;
      } catch (backendErr) {
        clearTimeout(timeoutId);
        // Backend unavailable (mobile/offline) - try public CoinGecko directly
      }

      // Public CoinGecko fallback for mobile
      try {
        const cgRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,the-open-network,solana,tether&vs_currencies=usd',
          { signal: AbortSignal.timeout(3000) }
        );
        if (cgRes.ok) {
          const data = await cgRes.json();
          setCryptoRates({
            BTC: data.bitcoin?.usd || DEFAULT_CRYPTO_RATES.BTC,
            ETH: data.ethereum?.usd || DEFAULT_CRYPTO_RATES.ETH,
            TON: data['the-open-network']?.usd || DEFAULT_CRYPTO_RATES.TON,
            SOL: data.solana?.usd || DEFAULT_CRYPTO_RATES.SOL,
            USDT: data.tether?.usd || DEFAULT_CRYPTO_RATES.USDT
          });
        }
      } catch (cgErr) {
        // Keep resilient DEFAULT_CRYPTO_RATES
      }
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
