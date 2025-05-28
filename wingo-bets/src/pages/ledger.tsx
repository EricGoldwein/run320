import React, { useState } from 'react';
import { User } from '../types';
import { Search, ArrowUpDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LedgerProps {
  user: User;
}

interface LeaderboardEntry {
  rank: number;
  user: string;
  balance: number;
  totalMined: number;
  distance: number;
  lastMined: string;
}

const Ledger: React.FC<LedgerProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof LeaderboardEntry>('balance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data - replace with real data later
  const leaderboardData: LeaderboardEntry[] = [
    { 
      rank: 1, 
      user: 'ERock', 
      balance: 15, 
      totalMined: 15, 
      distance: 4.8, 
      lastMined: '05-28-2024' 
    },
    { 
      rank: 2, 
      user: 'Will Mike Lowry', 
      balance: 15, 
      totalMined: 15, 
      distance: 4.8, 
      lastMined: '05-28-2024' 
    },
    { 
      rank: 3, 
      user: 'K-Money', 
      balance: 15, 
      totalMined: 15, 
      distance: 4.8, 
      lastMined: '05-28-2024' 
    }
  ];

  // Calculate totals from leaderboard data
  const totalWingo = leaderboardData.reduce((sum, entry) => sum + entry.balance, 0);
  const totalMined = leaderboardData.reduce((sum, entry) => sum + entry.totalMined, 0);
  const totalKilometers = leaderboardData.reduce((sum, entry) => sum + entry.distance, 0); // Will be 14.4 km (4.8 × 3)

  const handleSort = (field: keyof LeaderboardEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = leaderboardData
    .filter(entry => 
      entry.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return ((aValue as number) - (bValue as number)) * modifier;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> Ledger
          </h1>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Your Balance:</span>
              <span className="text-[#E6C200] font-bold">W</span>
              <span className="font-bold">{user.balance || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Total in Circulation:</span>
              <span className="text-[#E6C200] font-bold">W</span>
              <span className="font-bold">{totalWingo.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Distance Covered:</span>
              <span className="font-bold">{totalKilometers.toFixed(1)} km</span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">WINGO Leaderboard</h2>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C200] focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="pl-6 pr-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('rank')}
                    >
                      <div className="flex items-center gap-1">
                        Rank
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('user')}
                    >
                      <div className="flex items-center gap-1">
                        User
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('balance')}
                    >
                      <div className="flex items-center gap-1">
                        Balance
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalMined')}
                    >
                      <div className="flex items-center gap-1">
                        Mined
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('distance')}
                    >
                      <div className="flex items-center gap-1">
                        Distance
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('lastMined')}
                    >
                      <div className="flex items-center gap-1">
                        Last Mined
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedData.length > 0 ? (
                    filteredAndSortedData.map((entry) => (
                      <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                        <td className="pl-6 pr-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.rank}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.user}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.balance}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.totalMined}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.distance} km</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.lastMined}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                        {searchTerm ? 'No matching users found' : 'No Wingo activity yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger; 