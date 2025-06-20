import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

interface LogEntry {
  id: number;
  fullId: string;
  username: string;
  date: string;
  wingoMined: number;
  kmLogged: number;
  initiation: boolean;
  category: string;
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
        
        console.log('Raw last updated cell value:', lastUpdatedCell);
        
        if (lastUpdatedCell) {
          // Try to parse the date string - it might be in a specific format
          let date;
          
          // First try parsing as is
          date = new Date(lastUpdatedCell);
          
          // If that doesn't work, try different formats
          if (isNaN(date.getTime())) {
            // Try parsing as MM/DD/YYYY HH:MM format
            const parts = lastUpdatedCell.split(' ');
            if (parts.length >= 2) {
              const datePart = parts[0];
              const timePart = parts[1];
              const dateParts = datePart.split('/');
              if (dateParts.length === 3) {
                const month = parseInt(dateParts[0]) - 1; // JS months are 0-indexed
                const day = parseInt(dateParts[1]);
                const year = parseInt(dateParts[2]);
                const timeParts = timePart.split(':');
                if (timeParts.length === 2) {
                  const hours = parseInt(timeParts[0]);
                  const minutes = parseInt(timeParts[1]);
                  date = new Date(year, month, day, hours, minutes);
                }
              }
            }
          }
          
          console.log('Final parsed date:', date);
          
          if (!isNaN(date.getTime())) {
            const formattedDate = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear().toString().slice(-2)}`;
            const formattedTime = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            console.log('Formatted result:', `${formattedDate}, ${formattedTime} ET`);
            setLastUpdated(`${formattedDate}, ${formattedTime} ET`);
          } else {
            // If we can't parse it, just show the raw value
            console.log('Could not parse date, showing raw value');
            setLastUpdated(`Updated: ${lastUpdatedCell}`);
          }
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
              category: columns[10]?.trim() || ''
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
                    W-ID
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Runner
                  </th>
                  <th 
                    className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('wingoMined')}
                  >
                    <span className="hidden sm:inline">Δ WINGO</span>
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
                  <th className="px-2 sm:px-6 py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tag
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
                      {entry.fullId}
                      {entry.initiation && (
                        <span className="ml-1 text-[#E6C200]">🚀</span>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                      {entry.username}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-900">
                      {entry.wingoMined > 0 ? '+' : ''}{entry.wingoMined}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                      {entry.category === 'Mining' ? entry.kmLogged.toFixed(2) : '--'}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-[10px] sm:text-sm text-gray-500">
                      {entry.category}
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