import React, { useState } from 'react';
import { User } from '../types/bet';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dave',
    wingoBalance: 1000,
    correctPicks: 12,
    totalPicks: 20,
    unitsWon: 500,
    unitsLost: 200,
  },
  {
    id: '2',
    name: 'Jane',
    wingoBalance: 800,
    correctPicks: 10,
    totalPicks: 15,
    unitsWon: 400,
    unitsLost: 150,
  },
  {
    id: '3',
    name: 'Joan',
    wingoBalance: 1200,
    correctPicks: 15,
    totalPicks: 25,
    unitsWon: 600,
    unitsLost: 300,
  },
];

type SortField = 'wingoBalance' | 'correctPicks' | 'winPercentage' | 'unitsWon';

export default function Leaderboard() {
  const [users] = useState<User[]>(mockUsers);
  const [sortField, setSortField] = useState<SortField>('wingoBalance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'wingoBalance':
        comparison = a.wingoBalance - b.wingoBalance;
        break;
      case 'correctPicks':
        comparison = a.correctPicks - b.correctPicks;
        break;
      case 'winPercentage':
        comparison = (a.correctPicks / a.totalPicks) - (b.correctPicks / b.totalPicks);
        break;
      case 'unitsWon':
        comparison = a.unitsWon - b.unitsWon;
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
                onClick={() => handleSort('wingoBalance')}
              >
                WINGO Balance
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('correctPicks')}
              >
                Correct Picks
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('winPercentage')}
              >
                Win %
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('unitsWon')}
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
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(user.wingoBalance)} WINGO</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(user.correctPicks)}/{formatNumber(user.totalPicks)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {((user.correctPicks / user.totalPicks) * 100).toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatNumber(user.unitsWon)} WINGO</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 