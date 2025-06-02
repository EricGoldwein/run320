import React, { useState } from 'react';
import { User } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    email: 'dave@example.com',
    username: 'dave',
    created_at: '2024-01-01',
    wingo_balance: 1000,
    name: 'Dave',
    correct_picks: 12,
    total_picks: 20,
    units_won: 500,
    units_lost: 200,
    balance: 1000,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    total_wingos: 1000,
    last_activity: '2024-01-01'
  },
  {
    id: "2",
    email: 'jane@example.com',
    username: 'jane',
    created_at: '2024-01-01',
    wingo_balance: 800,
    name: 'Jane',
    correct_picks: 10,
    total_picks: 15,
    units_won: 400,
    units_lost: 150,
    balance: 800,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    total_wingos: 800,
    last_activity: '2024-01-01'
  },
  {
    id: "3",
    email: 'joan@example.com',
    username: 'joan',
    created_at: '2024-01-01',
    wingo_balance: 1200,
    name: 'Joan',
    correct_picks: 15,
    total_picks: 25,
    units_won: 600,
    units_lost: 300,
    balance: 1200,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    total_wingos: 1200,
    last_activity: '2024-01-01'
  },
];

type SortField = 'wingo_balance' | 'correct_picks' | 'win_percentage' | 'units_won';

interface LeaderboardEntry {
  rank: number;
  user: string;
  balance: number;
  totalMined: number;
  distance: number;
  lastMined: string;
}

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

export default function Leaderboard() {
  const [users] = useState<User[]>(mockUsers);
  const [sortField, setSortField] = useState<SortField>('wingo_balance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'wingo_balance':
        comparison = a.wingo_balance - b.wingo_balance;
        break;
      case 'correct_picks':
        comparison = (a.correct_picks || 0) - (b.correct_picks || 0);
        break;
      case 'win_percentage':
        const aWinRate = a.correct_picks && a.total_picks ? a.correct_picks / a.total_picks : 0;
        const bWinRate = b.correct_picks && b.total_picks ? b.correct_picks / b.total_picks : 0;
        comparison = aWinRate - bWinRate;
        break;
      case 'units_won':
        comparison = (a.units_won || 0) - (b.units_won || 0);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Leaderboard</h1>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('wingo_balance')}
              >
                WINGO Balance
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('correct_picks')}
              >
                Correct Picks
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('win_percentage')}
              >
                Win %
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('units_won')}
              >
                Wingos Won
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user, index) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(user.wingo_balance)} WINGO</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatNumber(user.correct_picks || 0)}/{formatNumber(user.total_picks || 0)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.correct_picks && user.total_picks 
                      ? ((user.correct_picks / user.total_picks) * 100).toFixed(1)
                      : '0.0'}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(user.units_won || 0)} WINGO</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 