import React from 'react';
import { User } from '../types';

interface LedgerProps {
  user: User;
}

const Ledger: React.FC<LedgerProps> = ({ user }) => {
  // Initial values - all set to 0
  const totalWingo = 0;
  const totalMined = 0;
  const totalKilometers = 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-wingo-600 to-wingo-400 leading-tight py-1">
            $WINGO Ecosystem
          </h1>
          <p className="text-xl text-gray-600">
            Track the global $WINGO economy
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Total $WINGO in Circulation</h3>
            <p className="mt-2 text-3xl font-bold text-wingo-600">{totalWingo.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">Includes all WINGO from mining, bets, prizes, and other activities</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Total $WINGO Mined</h3>
            <p className="mt-2 text-3xl font-bold text-wingo-600">{totalMined.toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">WINGO earned through mining activities only</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Total Distance</h3>
            <p className="mt-2 text-3xl font-bold text-wingo-600">{totalKilometers} km</p>
            <p className="mt-2 text-sm text-gray-500">Total distance covered by all miners</p>
          </div>
        </div>

        {/* User Balances Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">All User Balances</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Mined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Mined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No mining activity yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution Chart Placeholder */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">$WINGO Distribution</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Distribution chart coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger; 