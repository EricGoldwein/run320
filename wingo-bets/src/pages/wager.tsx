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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The <span className="font-bold">D</span><span className="text-[#00CED1]">AI</span><span className="font-bold">SY</span><span className="text-xl align-top ml-1">™</span> Degenerate Dashboard
          </h1>
          {user.id === 'guest' && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 max-w-2xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You're viewing as a guest. <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">Log in</a> or <a href="/register" className="font-medium underline text-yellow-700 hover:text-yellow-600">register</a> to place bets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Balance */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm mx-auto border border-gray-100">
          <h3 className="text-2xl font-medium text-gray-900 mb-4">
            <span className="text-[#E6C200] font-bold">W</span>INGO Balance
          </h3>
          <div className="flex items-center justify-center">
            <span className="text-6xl font-bold text-gray-900">{user.wingo_balance}</span>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Link to={user.id === 'guest' ? '/login' : '/create-bet'} className="group bg-white rounded-xl shadow-md p-8 border-2 border-gray-200 hover:shadow-lg hover:border-wingo-500 transition-all duration-200 text-center cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-wingo-600">Create Bet</h2>
          </Link>

          <Link to={user.id === 'guest' ? '/login' : '/bet-board'} className="group bg-white rounded-xl shadow-md p-8 border-2 border-gray-200 hover:shadow-lg hover:border-wingo-500 transition-all duration-200 text-center cursor-pointer">
            <h2 className="text-2xl font-bold text-gray-900 group-hover:text-wingo-600">View Bets</h2>
          </Link>
        </div>
      </div>
    </div>
  );
} 