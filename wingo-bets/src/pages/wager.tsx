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
            Place bets, challenge friends, and earn more $WINGO
          </p>
        </div>

        {/* What is WINGO Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is $WINGO?</h2>
          <p className="text-gray-600 mb-4">
            $WINGO is the official token of the Wingate Track Club. It's earned by running laps at Wingate Track
            (320 meters per lap = 1 $WINGO) and can be used to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Place friendly wagers on track events and personal achievements</li>
            <li>Enter exclusive track events and competitions</li>
            <li>Vote on club decisions and event formats</li>
            <li>Track your progress and compete with friends</li>
          </ul>
        </div>

        {/* Disclaimer Section */}
        <div className="bg-yellow-50 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Important Notice</h2>
          <p className="text-yellow-700 mb-4">
            🎯 $WINGO is a fun, community token with no real-world monetary value. It cannot be bought, sold, or exchanged for real money.
          </p>
          <p className="text-yellow-700">
            🏃‍♂️ All wagers are friendly competitions between track club members. No real money is involved in any $WINGO transactions.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/create-bet" className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create a Bet</h3>
            <p className="text-gray-600 mb-4">
              Challenge your friends to beat your time, predict race outcomes, or create custom track challenges.
            </p>
            <div className="text-wingo-600 font-medium">Create Bet →</div>
          </Link>

          <Link to="/bet-board" className="bg-white rounded-xl shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">View Active Bets</h3>
            <p className="text-gray-600 mb-4">
              Browse and accept bets from other track club members. Find your next challenge!
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