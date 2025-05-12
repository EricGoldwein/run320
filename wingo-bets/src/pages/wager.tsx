import React from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';

interface WagerProps {
  user: User;
}

export default function Wager({ user }: WagerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-wingo-600 to-wingo-400 leading-tight py-1">
            $WINGO Wager
          </h1>
          <p className="text-xl text-gray-600">
            $WINGO is the token of 320 TC. Make predictions, challenge friends, and earn more $WINGO.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/create-bet" className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create a Bet</h3>
            <p className="text-gray-600 mb-4">
              Start a challenge, call out a friend, or make a weird prediction. If you can run it, you can bet on it.
            </p>
            <div className="text-wingo-600 font-medium">Create Bet →</div>
          </Link>

          <Link to="/bet-board" className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">View Active Bets</h3>
            <p className="text-gray-600 mb-4">
              Browse open bets from other club members. Pick your side. Stake some $WINGO. Stir the pot.
            </p>
            <div className="text-wingo-600 font-medium">View Bets →</div>
          </Link>
        </div>

        {/* Current Balance */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900">Your Current Balance</h3>
          <p className="mt-2 text-3xl font-bold text-wingo-600">
            {user.wingo_balance.toLocaleString()} $WINGO
          </p>
        </div>
      </div>
    </div>
  );
} 