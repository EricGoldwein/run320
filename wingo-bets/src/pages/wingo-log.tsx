import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

interface LogEntry {
  id: number;
  username: string;
  date: string;
  wingoMined: number;
  kmLogged: number;
  initiation: boolean;
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
        const res = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=0&single=true&output=csv&t=${Date.now()}`, { cache: 'no-store' });
        const text = await res.text();
        const rows = text.trim().split('\n');
        
        // Get the date from J5 and time from J6
        const dateStr = rows[4]?.split(',')[9]?.trim().replace(/^["']|["']$/g, '') || '';
        const timeStr = rows[5]?.split(',')[9]?.trim().replace(/^["']|["']$/g, '') || '';
        
        if (dateStr && timeStr) {
          setLastUpdated(`${dateStr} at ${timeStr}`);
        }

        // Now fetch the WINGO log data
        const logRes = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=270601813&single=true&output=csv&t=${Date.now()}`, { cache: 'no-store' });
        const logText = await logRes.text();
        const logRows = logText.trim().split('\n');
        const data = logRows.slice(1); // skip header row
        
        const parsed = data
          .filter(row => row.trim() && row.split(',').length >= 8)
          .map((row) => {
            const columns = row.split(',');
            return {
              id: parseInt(columns[0]) || 0,
              username: columns[1]?.trim() || '',
              date: columns[2]?.trim() || '',
              wingoMined: parseInt(columns[3]) || 0,
              kmLogged: parseFloat(columns[4]) || 0,
              initiation: columns[7]?.trim() === 'Yes'
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
          <h1 className="text-4xl font-bold text-gray-900 mb-0.5">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> Log
          </h1>
          <p className="text-[10px] sm:text-xs text-gray-500 italic sm:mt-1">
            Updated: {lastUpdated} 🐎🤖🪽8️⃣
          </p>
          
          <div className="absolute -top-4 sm:-top-6 right-0 sm:right-24 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex flex-col text-[8px] sm:text-[10px]">
              <span className="text-gray-600 mb-0.5 font-medium border-b border-gray-100 pb-0.5">Top Mining Sessions</span>
              {getTopRecords().slice(0, 3).map((record, index) => (
                <span key={index} className="text-gray-600">
                  {record.rank}. {record.username}: {record.wingoMined} W ({format(new Date(record.date), 'M-d-yy')})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 font-mono">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortField === 'date' && sortDirection && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WINGO ID
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runner
                  </th>
                  <th 
                    className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('wingoMined')}
                  >
                    <span className="hidden sm:inline">WINGO Δ</span>
                    <span className="sm:hidden">WINGO</span>
                    {sortField === 'wingoMined' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                      {format(new Date(entry.date), 'M-dd-yy')}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                      {getPrefixForId(entry.id)}{entry.id.toString().padStart(1, '0')}
                      {entry.initiation && (
                        <span className="ml-1 text-[#E6C200]">🚀</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                      {entry.username}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                      +{entry.wingoMined}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                      {entry.kmLogged.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingoLog; 