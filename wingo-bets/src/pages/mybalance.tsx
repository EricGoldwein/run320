import React from 'react';
import { Link } from 'react-router-dom';

interface Activity {
  id: string;
  date: string;
  type: 'mine' | 'bet' | 'spend' | 'win';
  description: string;
  wingoAmount: number;
  wingosMined?: number;
}

// Mock data - this will be replaced with real user data
const mockActivities: Activity[] = [
  {
    id: '1',
    date: '2025-05-08',
    type: 'mine',
    description: 'Morning WINGO session',
    wingoAmount: 32,
    wingosMined: 32
  },
  {
    id: '2',
    date: '2025-05-07',
    type: 'spend',
    description: 'Wingate Invitational Registration',
    wingoAmount: -32
  },
  {
    id: '3',
    date: '2025-05-06',
    type: 'bet',
    description: 'Marathon Time Bet',
    wingoAmount: -50
  },
  {
    id: '4',
    date: '2025-05-05',
    type: 'win',
    description: 'Won Marathon Bet',
    wingoAmount: 75
  },
  {
    id: '5',
    date: '2025-05-04',
    type: 'mine',
    description: 'Evening WINGO session',
    wingoAmount: 32,
    wingosMined: 32
  }
];

const Wallet: React.FC = () => {
  const totalWingo = mockActivities.reduce((sum, activity) => sum + activity.wingoAmount, 0);
  const totalWingosMined = mockActivities
    .filter(activity => activity.type === 'mine')
    .reduce((sum, activity) => sum + (activity.wingosMined || 0), 0);
  const totalWagers = mockActivities
    .filter(activity => activity.type === 'bet' || activity.type === 'win')
    .reduce((sum, activity) => sum + activity.wingoAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-wingo-600 to-wingo-400">
            My Wallet
          </h1>
          <p className="text-xl text-gray-600">
            Track your <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span> balance and activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Balance</h3>
            <p className="mt-2 text-3xl font-bold text-wingo-600">{totalWingo} <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span></p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900"><span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span>s Mined</h3>
            <p className="mt-2 text-3xl font-bold text-wingo-600">{totalWingosMined}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Wagers</h3>
            <p className={`mt-2 text-3xl font-bold ${totalWagers >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalWagers >= 0 ? '+' : ''}{totalWagers} <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span>
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Mining Sessions</h3>
            <p className="mt-2 text-3xl font-bold text-wingo-600">
              {mockActivities.filter(activity => activity.type === 'mine').length}
            </p>
          </div>
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900">Activity History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WINGOs Mined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockActivities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.type === 'mine' ? 'bg-green-100 text-green-800' :
                        activity.type === 'bet' ? 'bg-blue-100 text-blue-800' :
                        activity.type === 'win' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{activity.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        activity.wingoAmount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.wingoAmount >= 0 ? '+' : ''}{activity.wingoAmount} <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {activity.wingosMined ? `${activity.wingosMined}` : '-'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/mine" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-wingo-500 transition-colors text-left">
            <h3 className="text-lg font-medium text-gray-900">Mine <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span></h3>
            <p className="mt-2 text-sm text-gray-600">Run at Wingate Track to earn <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span></p>
          </Link>
          <Link to="/bets" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-wingo-500 transition-colors text-left">
            <h3 className="text-lg font-medium text-gray-900">Wager</h3>
            <p className="mt-2 text-sm text-gray-600">Use your <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span> to place bets</p>
          </Link>
          <Link to="/events" className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-wingo-500 transition-colors text-left">
            <h3 className="text-lg font-medium text-gray-900">Race</h3>
            <p className="mt-2 text-sm text-gray-600">Use your <span className="inline-flex items-baseline"><span className="text-[#E6C200] font-bold">W</span><span>INGO</span></span> to enter events</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wallet; 