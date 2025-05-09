import React, { useState } from 'react';
import { User } from '../types';

interface MineWingoProps {
  user: User;
}

export default function MineWingo({ user }: MineWingoProps) {
  const [isMining, setIsMining] = useState(false);
  const [error, setError] = useState('');

  const handleMine = async () => {
    setIsMining(true);
    setError('');

    try {
      // Simulate mining process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real implementation, this would call an API endpoint
      // to update the user's WINGO balance
    } catch (err: any) {
      setError(err.message || 'Failed to mine WINGO');
    } finally {
      setIsMining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          {user.username}'s $WINGO Mining
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Current Balance: {user.wingo_balance.toLocaleString()} $WINGO
        </p>
      </div>

      <div className="mt-12 max-w-lg mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Mine $WINGO
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Click the button below to mine $WINGO tokens. Each mining session will reward you with a random amount of $WINGO.
              </p>
            </div>
            <div className="mt-5">
              <button
                type="button"
                onClick={handleMine}
                disabled={isMining}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500 disabled:opacity-50"
              >
                {isMining ? 'Mining...' : 'Start Mining'}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
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
          </div>
        </div>
      </div>
    </div>
  );
} 