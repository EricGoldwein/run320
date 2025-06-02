import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
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
        <p className="text-sm text-gray-600">Total balance</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Stats</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Total WINGOs completed: {user.total_wingos}</li>
          <li>• Each WINGO = 1 <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span></li>
          <li>• Member since: {new Date(user.created_at).toLocaleDateString()}</li>
          <li>• Last activity: {new Date(user.last_activity).toLocaleDateString()}</li>
        </ul>
      </div>
    </div>
  );
};

export default Profile; 