import React, { useState } from 'react';
import { Bet, User } from '../types/bet';

interface BetBoardProps {
  bets: Bet[];
  user: User;
  onAcceptBet: (betId: string, amount: number) => void;
}

export default function BetBoard({ bets, user, onAcceptBet }: BetBoardProps) {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [error, setError] = useState('');

  const handleAcceptBet = (bet: Bet) => {
    setSelectedBet(bet);
    setBetAmount(0);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedBet) return;

    if (betAmount > user.wingoBalance) {
      setError(`You can't bet more than your current balance of ${user.wingoBalance} WINGO`);
      return;
    }

    onAcceptBet(selectedBet.id, betAmount);
    setSelectedBet(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Active Bets</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bets.map((bet) => (
          <div key={bet.id} className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{bet.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{bet.description}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Creator:</span>
                <span className="font-medium text-gray-900">{bet.creator.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount:</span>
                <span className="font-medium text-gray-900">{bet.amount} WINGO</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Odds:</span>
                <span className="font-medium text-gray-900">{bet.odds}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Event:</span>
                <span className="font-medium text-gray-900">{bet.event?.name || 'No event specified'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires:</span>
                <span className="font-medium text-gray-900">
                  {new Date(bet.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleAcceptBet(bet)}
              className="mt-4 w-full bg-wingo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              Accept Bet
            </button>
          </div>
        ))}
      </div>

      {selectedBet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Accept Bet</h3>
            <p className="text-sm text-gray-500 mb-4">
              How much WINGO would you like to bet on "{selectedBet.title}"?
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700">
                  Bet Amount (WINGO)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id="betAmount"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    min="0"
                    max={user.wingoBalance}
                    className="block w-full rounded-md border-gray-300 pr-12 focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">WINGO</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Available balance: {user.wingoBalance} WINGO
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedBet(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
                >
                  Place Bet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 