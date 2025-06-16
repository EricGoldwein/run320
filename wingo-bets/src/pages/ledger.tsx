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
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Mock data - replace with real data later
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=0&single=true&output=csv&t=${Date.now()}`, { cache: 'no-store' });
        const text = await res.text();
        const rows = text.trim().split('\n');
        const data = rows.slice(1); // skip header row
        
        const parsed = data
          .filter(row => row.trim() && row.split(',').length >= 5)
          .map((row) => {
            const columns = row.split(',');
            // Parse the values correctly
            const username = columns[0].trim();
            const balance = parseFloat(columns[1]) || 0;
            const mined = parseFloat(columns[2]) || 0;
            const distance = parseFloat(columns[3]) || 0;
            const lastMined = columns[4]?.trim() || '';
            const votingShare = parseFloat(columns[5]) || 0;
            const rank = parseInt(columns[6]) || 0;

            return {
              user: username,
              balance: balance,
              totalMined: mined,
              distance: distance,
              lastMined: lastMined,
              votingShare: votingShare,
              rank: rank
            };
          })
          .filter(entry => entry.user && entry.user !== ''); // Filter out empty entries
      
        setLeaderboardData(parsed);
        
        // Get the date from J5 and time from J6
        console.log('All rows:', rows);
        console.log('Row 4 (J5):', rows[4]);
        console.log('Row 5 (J6):', rows[5]);
        
        const dateStr = rows[4]?.split(',')[9]?.trim().replace(/^["']|["']$/g, '') || '';
        const timeStr = rows[5]?.split(',')[9]?.trim().replace(/^["']|["']$/g, '') || '';
        
        console.log('Date from J5:', dateStr);
        console.log('Time from J6:', timeStr);
        
        if (dateStr && timeStr) {
          setLastUpdated(`${dateStr} at ${timeStr}`);
        } else {
          console.log('Missing date or time:', { dateStr, timeStr });
        }
      } catch (error) {
        console.error('Failed to fetch or parse leaderboard:', error);
      }
    };
  
    // Initial fetch
    fetchData();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchData, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  

  // Calculate total WINGO first
  const totalWingo = leaderboardData.reduce((sum, entry) => sum + entry.balance, 0);

  // Sort by balance and update ranks
  const sortedLeaderboard = [...leaderboardData]
    .sort((a, b) => b.balance - a.balance);

  // Calculate total kilometers after distances are calculated
  const totalKilometers = Number((sortedLeaderboard.reduce((sum, entry) => sum + entry.distance, 0)).toFixed(1));

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
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> Ledger
          </h1>
          <a 
            href="/raq" 
            className="text-xs text-wingo-600 hover:text-wingo-500 italic sm:hidden -mt-1 mb-2 block"
          >
            WTF is WINGO?
          </a>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6 sm:max-w-[700px] max-w-[280px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
            <div className="flex items-center gap-1 sm:gap-2 sm:px-2 sm:py-2">
              <span className="text-gray-600 text-base sm:text-base">Total <span className="text-[#E6C200] font-bold">W</span> Mined:</span>
              <span className="font-bold text-base sm:text-base">{leaderboardData.reduce((sum, entry) => sum + entry.totalMined, 0)}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 sm:px-2 sm:py-2">
              <span className="text-gray-600 text-base sm:text-base">Total <span className="text-[#E6C200] font-bold">W</span> in Circulation:</span>
              <span className="font-bold text-base sm:text-base">{totalWingo.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 sm:px-2 sm:py-2">
              <span className="text-gray-600 text-base sm:text-base">Distance Covered:</span>
              <span className="font-bold text-base sm:text-base">{totalKilometers} km</span>
            </div>
          </div>
        </div>

        {/* Wingate Invitational Alert */}
        <a 
          href="/wingate-invitational" 
          className="block mb-6 sm:max-w-[700px] max-w-[280px] mx-auto transform hover:scale-[1.02] transition-all duration-200"
        >
          <div className="bg-gradient-to-br from-[#E6C200] via-[#FFD700] to-[#FFC107] px-5 sm:px-2 py-3 rounded-lg shadow-lg">
            <p className="text-xs sm:text-sm text-gray-900 text-center font-medium">
              Register for Old Balance Wingate Invitational (Sunday, Sept. 7<span className="hidden sm:inline">, 2025</span>)
            </p>
          </div>
        </a>

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
              <div className="flex-1 flex flex-col justify-center items-center min-w-0 pl-6 sm:pl-0">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900 text-center whitespace-nowrap">WINGO Leaderboard</h2>
                <a 
                  href="/raq" 
                  className="text-xs text-wingo-600 hover:text-wingo-500 italic mt-1 hidden sm:block"
                >
                  WTF is WINGO?
                </a>
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
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('votingShare')}
                    >
                      Voting Share
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalMined')}
                    >
                      Mined
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
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.votingShare.toFixed(1)}%</td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {entry.totalMined} <span className="text-xs text-gray-500 align-middle">({entry.distance.toFixed(1)}km)</span>
                        </td>
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
        {/* Text Coach DAISY™ Link */}
        <div className="mt-8 text-center">
          <p className="text-[13px] sm:text-lg text-gray-600">
            Text Coach DAISY™ at{' '}
            <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700 font-medium">
              929-WAK-GRIG
            </a>{' '}
            to start mining
          </p>
          {lastUpdated && (
            <p className="text-[10px] sm:text-xs text-gray-500 italic">
              Updated: {lastUpdated} 🐎🤖🪽8️⃣
            </p>
          )}
          <a href="/wingo-log" className="text-[10px] sm:text-xs text-wingo-600 hover:text-wingo-700">
            See WINGO log
          </a>
        </div>
      </div>
    </div>
  );
};

export default Ledger; 