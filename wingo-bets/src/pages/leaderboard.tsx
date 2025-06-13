import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Link } from 'react-router-dom';

interface LeaderboardProps {
  user: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ user }) => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Wingate Invitational Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-wingo-600 mb-4">Old Balance Wingate Invitational</h2>
            <p className="text-gray-600 mb-4">
              Experience the flagship event of the 320 Track Club. Message Coach DAISY™ to register.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Maybe Later
              </button>
              <Link
                to="/wingate-invitational"
                className="px-4 py-2 bg-wingo-600 text-white rounded-md hover:bg-wingo-700"
                onClick={() => setShowModal(false)}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      )}

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