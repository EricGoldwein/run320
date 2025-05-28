import React from 'react';
import { User } from '../types';

interface LeaderboardProps {
  user: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-gray-900 font-medium">{user.wingo_balance}</span>
          <span className="text-gray-900 font-bold inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>
        </div>
        <p className="text-sm text-gray-600">Your current balance</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Leaderboard Rules</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Each WINGO = 1 <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span></li>
          <li>• Rankings are updated in real-time</li>
          <li>• Only verified WINGOs count towards your balance</li>
          <li>• WINGOs can be earned by completing 320m segments at Wingate Track</li>
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard; 