import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogEntry {
  id: number;
  fullId: string;
  username: string;
  date: string;
  wingoMined: number;
  kmLogged: number;
  initiation: boolean;
  category: string;
  activityLink: string;
}

const WingoLog = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'date' | 'wingoMined' | 'km' | 'initiation' | 'username' | 'rank' | 'distance'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Generate a random 6-digit number
  const generateRandomPrefix = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // Create a map to store consistent random prefixes for each ID
  const [idPrefixes] = useState(() => {
    const prefixes = new Map<number, number>();
    return prefixes;
  });

  // Get or create a random prefix for an ID
  const getPrefixForId = (id: number) => {
    if (!idPrefixes.has(id)) {
      idPrefixes.set(id, generateRandomPrefix());
    }
    return idPrefixes.get(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the Summary sheet for last updated time
        const summaryResponse = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=482134402&single=true&output=csv`, { cache: 'no-store' });
        const summaryText = await summaryResponse.text();
        const summaryRows = summaryText.trim().split('\n');
        
        // Get the last updated time from F2 (row 1, column 5)
        const lastUpdatedCell = summaryRows[1]?.split(',')[5]?.trim().replace(/^["']|["']$/g, '') || '';
        
        if (lastUpdatedCell) {
          // Just use the raw value from F2 - it's already formatted by the App Script
          setLastUpdated(lastUpdatedCell);
        }

        // Now fetch the WINGO log data
        const logRes = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=270601813&single=true&output=csv&t=${Date.now()}`, { cache: 'no-store' });
        const logText = await logRes.text();
        const logRows = logText.trim().split('\n');
        const data = logRows.slice(1); // skip header row
        
        const parsed = data
          .filter(row => row.trim() && row.split(',').length >= 13)
          .map((row) => {
            const columns = row.split(',');
            return {
              id: parseInt(columns[0]) || 0,
              fullId: columns[12]?.trim() || '',
              username: columns[1]?.trim() || '',
              date: columns[2]?.trim() || '',
              wingoMined: parseInt(columns[3]) || 0,
              kmLogged: parseFloat(columns[4]) || 0,
              initiation: columns[7]?.trim() === 'Yes',
              category: columns[10]?.trim() || '',
              activityLink: columns[5]?.trim() || '' // Column F (index 5) - Activity Link
            };
          })
          .filter(entry => entry.username && entry.username !== '');
      
        setEntries(parsed);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch or parse log:', err);
        setError('Failed to load log entries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    // Initial fetch
    fetchData();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchData, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleSort = (field: 'date' | 'wingoMined' | 'km' | 'initiation' | 'username' | 'rank' | 'distance') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedEntries = entries
    .sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const dateComparison = sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
        
        // If dates are equal, use ID as tiebreaker
        if (dateComparison === 0) {
          return sortDirection === 'asc'
            ? a.id - b.id
            : b.id - a.id;
        }
        return dateComparison;
      } else if (sortField === 'wingoMined') {
        return sortDirection === 'asc'
          ? a.wingoMined - b.wingoMined
          : b.wingoMined - a.wingoMined;
      } else if (sortField === 'km') {
        return sortDirection === 'asc'
          ? a.kmLogged - b.kmLogged
          : b.kmLogged - a.kmLogged;
      } else {
        // initiation
        return sortDirection === 'asc'
          ? (a.initiation === b.initiation ? 0 : a.initiation ? 1 : -1)
          : (a.initiation === b.initiation ? 0 : a.initiation ? -1 : 1);
      }
    });

  // Add this function to get top 3 records
  const getTopRecords = () => {
    // Sort by WINGO mined (desc), then by date (asc), then by ID (asc)
    const sortedByWingo = [...entries].sort((a, b) => {
      // First sort by WINGO mined (descending)
      if (b.wingoMined !== a.wingoMined) {
        return b.wingoMined - a.wingoMined;
      }
      
      // If WINGO mined is equal, sort by date (ascending - older dates first)
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // If dates are equal, sort by ID (ascending - older IDs first)
      return a.id - b.id;
    });

    // Take top 3 and format them
    return sortedByWingo.slice(0, 3).map((entry, index) => ({
      rank: (index + 1).toString(),
      username: entry.username,
      date: entry.date,
      wingoMined: entry.wingoMined
    }));
  };

  // Get top 3 mining session IDs for medal emojis
  const getTopMiningSessionIds = () => {
    const sortedByWingo = [...entries].sort((a, b) => {
      if (b.wingoMined !== a.wingoMined) {
        return b.wingoMined - a.wingoMined;
      }
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.id - b.id;
    });
    
    return sortedByWingo.slice(0, 3).map(entry => entry.id);
  };

  // Get lowest mining session ID for poop emoji
  const getLowestMiningSessionId = () => {
    const miningEntries = entries.filter(entry => entry.wingoMined > 0);
    if (miningEntries.length === 0) return null;
    
    const sortedByWingo = [...miningEntries].sort((a, b) => {
      if (a.wingoMined !== b.wingoMined) {
        return a.wingoMined - b.wingoMined;
      }
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime(); // Newer dates first for ties
      }
      return b.id - a.id; // Newer IDs first for ties
    });
    
    return sortedByWingo[0].id;
  };

  // Get medal emoji for rank
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading WINGO Log...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <div className="text-left sm:text-center mb-4 sm:mb-6 relative">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-0.5">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> Log
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500 italic sm:mt-1">
            {lastUpdated && (
              <>Updated: {lastUpdated} 🐎🤖🪽8️⃣</>
            )}
          </p>
          
          <div className="absolute -top-12 sm:-top-6 right-0 sm:right-24 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex flex-col text-[8px] sm:text-[10px] sm:text-left">
              <span className="text-gray-600 mb-0.5 font-medium border-b border-gray-100 pb-0.5">Top Mining Sessions</span>
              {getTopRecords().slice(0, 3).map((record, index) => (
                <span key={index} className="text-gray-600">
                  {record.rank}. {record.username}: {record.wingoMined} W ({format(new Date(record.date), 'M.d.yy')})
                </span>
              ))}
            </div>
          </div>

          {/* Wingo Leaderboard Button - Desktop Only */}
          <div className="hidden sm:block absolute -top-2 sm:top-6 left-4">
            <Link 
              to="/ledger" 
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Wingo Leaderboard
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 font-mono">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortField === 'date' && sortDirection && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runner
                  </th>
                  <th 
                    className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('wingoMined')}
                  >
                    <span className="hidden sm:inline">Δ WINGO</span>
                    <span className="sm:hidden">Δ W</span>
                    {sortField === 'wingoMined' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('km')}
                  >
                    <span className="hidden sm:inline">KM Logged</span>
                    <span className="sm:hidden">KM</span>
                    {sortField === 'km' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    W-ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedEntries.map((entry) => {
                  const topMiningSessionIds = getTopMiningSessionIds();
                  const lowestMiningSessionId = getLowestMiningSessionId();
                  const isTopMiningSession = topMiningSessionIds.includes(entry.id);
                  const isLowestMiningSession = entry.id === lowestMiningSessionId;
                  const topRank = isTopMiningSession ? topMiningSessionIds.indexOf(entry.id) + 1 : 0;
                  
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[9px] sm:text-sm text-gray-500">
                        {format(new Date(entry.date), 'M-dd-yy')}
                      </td>
                      <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-900">
                        {entry.username}
                      </td>
                      <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-900">
                        {entry.wingoMined > 0 ? '+' : ''}{entry.wingoMined}
                        {isTopMiningSession && (
                          <span className="ml-1">{getMedalEmoji(topRank)}</span>
                        )}
                        {isLowestMiningSession && (
                          <span className="ml-1">💩</span>
                        )}
                      </td>
                      <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-500">
                        {entry.category === 'Mining' ? entry.kmLogged.toFixed(2) : '--'}
                      </td>
                      <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-500">
                        {entry.category}
                      </td>
                                              <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-500">
                          {entry.category === 'Gate Unlock' ? (
                            <a 
                              href={entry.activityLink || "https://docs.google.com/spreadsheets/d/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/edit#gid=270601813"} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-wingo-600 hover:text-wingo-700 hover:underline cursor-pointer"
                            >
                              {entry.fullId}
                            </a>
                          ) : (
                            entry.fullId
                          )}
                          {entry.initiation && (
                            <span className="ml-1 text-[#E6C200]">🚀</span>
                          )}
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingoLog; 