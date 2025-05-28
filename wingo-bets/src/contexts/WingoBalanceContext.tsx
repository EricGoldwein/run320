import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WingoBalanceContextType {
  wingoBalance: number;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const WingoBalanceContext = createContext<WingoBalanceContextType | undefined>(undefined);

export const WingoBalanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wingoBalance, setWingoBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/wingo/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch balance');
      }

      const data = await response.json();
      setWingoBalance(data.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      console.error('Error fetching WINGO balance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshBalance();
    } else {
      setWingoBalance(0);
    }
  }, [user]);

  return (
    <WingoBalanceContext.Provider value={{ wingoBalance, refreshBalance, isLoading, error }}>
      {children}
    </WingoBalanceContext.Provider>
  );
};

export const useWingoBalance = () => {
  const context = useContext(WingoBalanceContext);
  if (context === undefined) {
    throw new Error('useWingoBalance must be used within a WingoBalanceProvider');
  }
  return context;
}; 