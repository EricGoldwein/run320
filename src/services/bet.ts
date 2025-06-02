import { Bet } from '../types';

export const createBet = async (betData: Bet): Promise<void> => {
  const response = await fetch('/api/bets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(betData),
  });

  if (!response.ok) {
    throw new Error('Failed to create bet');
  }
}; 