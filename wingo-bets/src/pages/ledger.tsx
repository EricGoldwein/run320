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
  votingShare: number;
}

const Ledger: React.FC<LedgerProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof LeaderboardEntry>('balance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Mock data - replace with real data later
  const leaderboardData: LeaderboardEntry[] = [
    { 
      user: 'ERock', 
      totalMined: 15, 
      balance: 15,
      distance: 0, // Will be calculated in sorting
      lastMined: '5-28-25',
      rank: 0, // Will be set by sorting
      votingShare: 0 // Will be calculated in sorting
    },
    { 
      user: 'Willy Wingo', 
      totalMined: 24, 
      balance: 24,
      distance: 0, // Will be calculated in sorting
      lastMined: '5-28-25',
      rank: 0, // Will be set by sorting
      votingShare: 0 // Will be calculated in sorting
    },
    { 
      user: 'KAT', 
      totalMined: 15, 
      balance: 15,
      distance: 0, // Will be calculated in sorting
      lastMined: '5-28-25',
      rank: 0, // Will be set by sorting
      votingShare: 0 // Will be calculated in sorting
    },
    { 
      user: 'MadMiner', 
      totalMined: 15, 
      balance: 15,
      distance: 0, // Will be calculated in sorting
      lastMined: '5-28-25',
      rank: 0, // Will be set by sorting
      votingShare: 0 // Will be calculated in sorting
    },
    { 
      user: 'Melathon', 
      totalMined: 15, 
      balance: 15,
      distance: 0, // Will be calculated in sorting
      lastMined: '5-28-25',
      rank: 0, // Will be set by sorting
      votingShare: 0 // Will be calculated in sorting
    },
    { 
      user: 'Job', 
      totalMined: 16, 
      balance: 16,
      distance: 0, // Will be calculated in sorting
      lastMined: '5-28-25',
      rank: 0, // Will be set by sorting
      votingShare: 0 // Will be calculated in sorting
    }
  ];

  // Calculate total WINGO first
  const totalWingo = leaderboardData.reduce((sum, entry) => sum + entry.balance, 0);

  // Sort by balance and update ranks
  const sortedLeaderboard = [...leaderboardData]
    .sort((a, b) => b.balance - a.balance)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      distance: Number((entry.totalMined * 0.32).toFixed(1)), // Calculate distance based on totalMined
      votingShare: Number(((entry.balance / totalWingo) * 100).toFixed(2)) // Calculate voting share as percentage
    }));

  // Calculate total kilometers after distances are calculated
  const totalKilometers = sortedLeaderboard.reduce((sum, entry) => sum + entry.distance, 0);

  const handleSort = (field: keyof LeaderboardEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort leaderboard data
  const filteredLeaderboard = sortedLeaderboard
    .filter(entry => entry.user.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let result = 0;
      if (sortField === 'rank') result = a.rank - b.rank;
      else if (sortField === 'user') result = a.user.localeCompare(b.user);
      else if (sortField === 'balance') result = b.balance - a.balance;
      else if (sortField === 'totalMined') result = b.totalMined - a.totalMined;
      else if (sortField === 'distance') result = b.distance - a.distance;
      else if (sortField === 'votingShare') result = b.votingShare - a.votingShare;
      else if (sortField === 'lastMined') result = new Date(b.lastMined).getTime() - new Date(a.lastMined).getTime();
      if (sortDirection === 'asc') result = -result;
      return result;
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
                    You're viewing as a guest. <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">Log in</a> or <a href="/register" className="font-medium underline text-yellow-700 hover:text-yellow-600">register</a> to track your WINGO balance.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Your <span className="text-[#E6C200] font-bold">W</span> Balance:</span>
              <span className="font-bold">{user.balance || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">Total <span className="text-[#E6C200] font-bold">W</span> in Circulation:</span>
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
            <div className="flex items-center justify-between gap-4">
              {/* Search left */}
              <div className="flex-1 min-w-0 hidden sm:block">
                <div className="relative w-full max-w-[120px]">
                  <input
                    type="text"
                    placeholder=""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C200] focus:border-transparent"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              {/* Title center */}
              <div className="flex-1 flex justify-center items-center min-w-0 pl-6 sm:pl-0">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900 text-center whitespace-nowrap">WINGO Leaderboard</h2>
              </div>
              {/* DAISY badge right */}
              <div className="flex-1 flex justify-end">
                <span className="inline-block px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
                  D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
                </span>
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
                      Rank
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('user')}
                    >
                      Runner
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('balance')}
                    >
                      WINGO
                    </th>
                    <th 
                      scope="col" 
                      className="px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalMined')}
                    >
                      Mined
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('votingShare')}
                    >
                      Voting Share
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('lastMined')}
                    >
                      Last Mined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaderboard.length > 0 ? (
                    filteredLeaderboard.map((entry) => (
                      <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                        <td className="pl-6 pr-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.rank}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.user}</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.balance}</td>
                        <td className="px-2 sm:px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.totalMined} <span className="text-xs text-gray-500 align-middle">({entry.distance}km)</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.votingShare}%</td>
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