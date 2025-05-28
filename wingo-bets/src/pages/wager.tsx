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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> Wager
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> is the token of 320 TC. Make predictions, challenge friends, and earn more{' '}
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.
          </p>
        </div>

        {/* Current Balance */}
        <div className="mb-12 bg-white rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Current Balance</h3>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">{user.wingo_balance}</span>
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">Available for wagering</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/create-bet" className="group bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-wingo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Bet</h2>
            <p className="text-gray-600 mb-6">
              Create your own bet for others to join. Set the stakes, define the rules, and let the games begin.
            </p>
            <div className="text-wingo-600 group-hover:text-wingo-700 font-medium flex items-center">
              Create Bet
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link to="/bet-board" className="group bg-white rounded-xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-wingo-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">View Bets</h2>
            <p className="text-gray-600 mb-6">
              Browse open bets from other club members. Pick your side. Stake some{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>. Stir the pot.
            </p>
            <div className="text-wingo-600 group-hover:text-wingo-700 font-medium flex items-center">
              View Bets
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Wager Rules</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Each WINGO = 1{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>
            </li>
            <li>• Minimum wager: 1{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>
            </li>
            <li>• Maximum wager: Your entire balance</li>
            <li>• Wagers are locked once placed</li>
            <li>• Winnings are paid out immediately after race completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 