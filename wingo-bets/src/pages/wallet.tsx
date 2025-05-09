import React from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';

interface WalletProps {
  user: User;
}

export default function Wallet({ user }: WalletProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          {user.username}'s WINGO Wallet
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Current Balance: {user.wingo_balance.toLocaleString()} $WINGO
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Mine WINGO Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Mine $WINGO
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Run laps at Wingate to earn $WINGO tokens.</p>
            </div>
            <div className="mt-5">
              <Link
                to="/mine"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
              >
                Start Mining
              </Link>
            </div>
          </div>
        </div>

        {/* View Ledger Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Transaction History
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>View your complete transaction history.</p>
            </div>
            <div className="mt-5">
              <Link
                to="/ledger"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
              >
                View Ledger
              </Link>
            </div>
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Events
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Participate in events and earn more $WINGO.</p>
            </div>
            <div className="mt-5">
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-12">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Transactions
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Your recent transactions will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 