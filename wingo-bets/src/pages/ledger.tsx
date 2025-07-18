import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Search, ArrowUpDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { usePageTitle } from "../hooks/usePageTitle";

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

const Ledger: React.FC<LedgerProps> = ({ user }) => {
  usePageTitle("WINGO World: Where workout Independence is always 320 meters away");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof LeaderboardEntry>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLeaderboardView, setIsLeaderboardView] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  
  // Avatar modal state
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<{username: string, avatarUrl: string, balance: number, totalMined: number, distance: number, rank: number} | null>(null);
  
  // Log data state
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [logSortField, setLogSortField] = useState<'date' | 'wingoMined' | 'km' | 'initiation' | 'username' | 'category' | 'fullId'>('date');
  const [logSortDirection, setLogSortDirection] = useState<'asc' | 'desc'>('desc');

  // Username to avatar mapping
  const getAvatarForUser = (username: string): string => {
    const avatarMap: { [key: string]: string } = {
      'madminer': '/avatars/madminer.png',
      'job': '/avatars/job.png',
      'kat': '/avatars/kat.png',
      'melathon': '/avatars/melathon.png',
      'scar': '/avatars/scar.png',
      'willy_wingo': '/avatars/willy_wingo.png',
      'erock': '/avatars/erock.png',
      'jimmy': '/avatars/jimmy.png',
      'kirkland': '/avatars/kirkland.png'
    };
    
    // Debug logging
    const cleanUsername = username.trim().toLowerCase();
    console.log('getAvatarForUser called with:', username, '| cleaned:', cleanUsername);
    if (avatarMap[cleanUsername]) {
      console.log('Cleaned match found:', avatarMap[cleanUsername]);
      return avatarMap[cleanUsername];
    }
    // Try matching with underscores instead of spaces
    const underscoreUsername = cleanUsername.replace(/\s+/g, '_');
    if (avatarMap[underscoreUsername]) {
      console.log('Underscore match found:', avatarMap[underscoreUsername]);
      return avatarMap[underscoreUsername];
    }
    // Try matching without spaces
    const noSpaceUsername = cleanUsername.replace(/\s+/g, '');
    if (avatarMap[noSpaceUsername]) {
      console.log('No space match found:', avatarMap[noSpaceUsername]);
      return avatarMap[noSpaceUsername];
    }
    console.log('No match found, using taytay');
    return '/avatars/taytay.png';
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted || isFetching) return;
      
      setIsFetching(true);
      try {
        // Fetch the Summary sheet for last updated time
        const summaryResponse = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=482134402&single=true&output=csv`, { cache: 'no-store' });
        const summaryText = await summaryResponse.text();
        const summaryRows = summaryText.trim().split('\n');
        
        // Get the last updated time from F2 (row 1, column 5)
        const lastUpdatedCell = summaryRows[1]?.split(',')[5]?.trim().replace(/^["']|["']$/g, '') || '';
        
        if (lastUpdatedCell && isMounted) {
          // Just use the raw value from F2 - it's already formatted by the App Script
          setLastUpdated(lastUpdatedCell);
        }

        // Fetch leaderboard data
        const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=0&single=true&output=csv&t=${Date.now()}`, { cache: 'no-store' });
        const text = await response.text();
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
          .filter(entry => entry.user && entry.user !== '') // Filter out empty entries
          // Remove duplicates by username, keeping the first occurrence
          .filter((entry, index, self) => 
            index === self.findIndex(e => e.user.toLowerCase() === entry.user.toLowerCase())
          );
      
        if (isMounted) {
          setLeaderboardData(parsed);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch or parse leaderboard:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    // Fetch both leaderboard and log data
    fetchData();
    fetchLogData();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchData();
        fetchLogData();
      }
    }, 30000);

    // Cleanup interval on component unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);
  

  // Calculate total WINGO first
  const totalWingo = leaderboardData.reduce((sum, entry) => sum + entry.balance, 0);
  const totalMined = leaderboardData.reduce((sum, entry) => sum + entry.totalMined, 0);

  // Sort by balance and update ranks
  const sortedLeaderboard = [...leaderboardData]
    .sort((a, b) => b.balance - a.balance);

  // Calculate total kilometers as 0.32 * totalMined
  const totalKilometers = Number((totalMined * 0.32).toFixed(1));

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
      
      // Add stable secondary sort by username to prevent duplicates when primary values are equal
      if (result === 0) {
        result = a.user.localeCompare(b.user);
      }
      
      return result;
    });

  const fetchLogData = async () => {
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
        .filter(entry => entry.username && entry.username !== '')
        // Remove duplicates by ID, keeping the first occurrence
        .filter((entry, index, self) => 
          index === self.findIndex(e => e.id === entry.id)
        );
    
      setLogEntries(parsed);
    } catch (err) {
      console.error('Failed to fetch or parse log:', err);
    }
  };

  const handleLogSort = (field: 'date' | 'wingoMined' | 'km' | 'initiation' | 'username' | 'category' | 'fullId') => {
    if (logSortField === field) {
      setLogSortDirection(logSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setLogSortField(field);
      setLogSortDirection('desc');
    }
  };

  const getTopRecords = () => {
    // Sort by WINGO mined (desc), then by date (asc), then by ID (asc)
    const sortedByWingo = [...logEntries].sort((a, b) => {
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
    const sortedByWingo = [...logEntries].sort((a, b) => {
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
    const miningEntries = logEntries.filter(entry => entry.wingoMined > 0);
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

  // Handle avatar click
  const handleAvatarClick = (entry: LeaderboardEntry) => {
    const avatarUrl = getAvatarForUser(entry.user);
    setSelectedAvatar({ 
      username: entry.user, 
      avatarUrl, 
      balance: entry.balance, 
      totalMined: entry.totalMined, 
      distance: entry.distance, 
      rank: entry.rank
    });
    setShowAvatarModal(true);
  };

  // Replace gearQuotes and getGearQuote with new lists and logic
  const gearList = [
    'Divot Awareness Pro',
    'LaceLoop Sync XT',
    'HeelLock 9™',
    'The Aglet Beacon',
    'TongueTamer Core',
    'LaceOS v4.7',
    'LoopPredictor Nano',
    'HitchAware Hybrid',
    'AIglet+ Cloud Lace',
    'ThreadLock Modulator',
    'Forefoot Lace Governor',
    'Autolace Recall Band',
    'Tempo Tug™ ProSeries',
    'The Obsessive Knot System (OKS)',
    'Carbon Weft Companion',
    'Midsole Lace Anchor Pro',
    'Instep Signal Syncer',
    'TensionSync 320',
    'GhostLace Obfuscator',
    'Pronation-Responsive Aglet Dock',
  ];
  const quoteList = [
    'Don’t trust a loop you didn’t tie.',
    'Pain is just uncompressed effort.',
    'You don’t win the WINGO. You earn her favor.',
    'Left foot for pace. Right foot for grace.',
    'Lace yourself. Before you face yourself.',
    'Never raced with a clean tongue.',
    'Each knot holds a memory.',
    'I stopped tying my shoes. I started listening to them.',
    'He brought flats to a PentaWingo.',
    'Wind from the east? DAISY’s teeth.',
    'My laces were taught by monks. Or maybe ghosts.',
    'I don’t train. I foreshadow.',
  ];
  function getGearQuote(username: string) {
    // Deterministic hash for consistent assignment
    let hash = 0;
    for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
    const gear = gearList[hash % gearList.length];
    const quote = quoteList[hash % quoteList.length];
    return { gear, quote };
  }

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
              <span className="font-bold text-base sm:text-base">{totalMined.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 sm:px-2 sm:py-2">
              <span className="text-gray-600 text-base sm:text-base"><span className="text-[#E6C200] font-bold">W</span> in Circulation:</span>
              <span className="font-bold text-base sm:text-base">{totalWingo.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 sm:px-2 sm:py-2">
              <span className="text-gray-600 text-base sm:text-base">Wingo Footprint:</span>
              <span className="font-bold text-base sm:text-base">{totalKilometers} km</span>
            </div>
          </div>
        </div>

        {/* Wingate Invitational Alert */}
        <div className="flex justify-center mb-6">
          <a 
            href="/obwi" 
            className="inline-block transform hover:scale-[1.02] transition-all duration-200"
          >
            <div className="bg-gradient-to-br from-[#E6C200] via-[#FFD700] to-[#FFC107] px-4 sm:px-4 py-3 rounded-lg shadow-lg">
              <p className="text-xs sm:text-sm text-gray-900 text-center font-medium">
                Register for Old Balance Wingate Invitational (Sunday, Sept. 7<span className="hidden sm:inline"></span>)
              </p>
            </div>
          </a>
        </div>

        {/* Leaderboard */}
        {isLeaderboardView && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between gap-4">
                {/* Search left */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <div className="relative w-full max-w-[160px]">
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
                <div className="flex-1 flex flex-col justify-center items-center min-w-0 pl-6 sm:pl-0 text-center">
                  {/* Toggle Button */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-1">
                    <div className="flex">
                      <button
                        onClick={() => setIsLeaderboardView(true)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          isLeaderboardView
                            ? 'bg-[#E6C200] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span className="hidden sm:inline">WINGO Leaderboard</span>
                        <span className="sm:hidden">Rank</span>
                      </button>
                      <button
                        onClick={() => setIsLeaderboardView(false)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          !isLeaderboardView
                            ? 'bg-[#E6C200] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span className="hidden sm:inline">Ransaction Log</span>
                        <span className="sm:hidden">Log</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* DAISY badge right */}
                <div className="flex-1 flex justify-end">
                  <span className="inline-block px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
                    D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 font-mono">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th 
                        scope="col" 
                        className="pl-1 sm:pl-6 pr-1 sm:pr-4 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('rank')}
                      >
                        Rank
                      </th>
                      <th 
                        scope="col" 
                        className="w-8 sm:w-10 py-3 text-center text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        
                      </th>
                      <th 
                        scope="col" 
                        className="pl-2 sm:px-6 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('user')}
                      >
                        Runner
                      </th>
                      <th 
                        scope="col" 
                        className="px-3 sm:px-6 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('balance')}
                      >
                        <div className="flex flex-col sm:block">
                          <span className="hidden sm:inline">WINGO Balance</span>
                          <span className="sm:hidden">WINGO</span>
                          <span className="sm:hidden">Balance</span>
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-1 sm:px-6 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('votingShare')}
                      >
                        <div className="flex flex-col sm:block">
                          <span className="hidden sm:inline">Voting Share</span>
                          <span className="sm:hidden">Voting</span>
                          <span className="sm:hidden">Share</span>
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-1 sm:px-6 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('totalMined')}
                      >
                        <div className="flex flex-col sm:block">
                          <span className="hidden sm:inline">Mined</span>
                          <span className="sm:hidden text-center">Mined</span>
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-1 sm:px-6 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('lastMined')}
                      >
                        <div className="flex flex-col sm:block">
                          <span className="hidden sm:inline">Last Mined</span>
                          <span className="sm:hidden">Last</span>
                          <span className="sm:hidden">Mined</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredLeaderboard.length > 0 ? (
                      filteredLeaderboard.map((entry, index) => (
                        <tr key={`${entry.user}-${entry.rank}`} className={`hover:bg-gray-50 transition-colors border-b border-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
                          <td className="pl-1 sm:pl-6 pr-0 sm:pr-4 py-4 whitespace-nowrap text-[9px] sm:text-sm text-gray-900">{entry.rank}</td>
                          <td className="w-8 sm:w-10 py-4 flex justify-center">
                            <div 
                              className="flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-200" 
                              style={{ width: '2.5rem', height: '3rem' }}
                              onClick={() => handleAvatarClick(entry)}
                            >
                              <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 40 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ display: 'block' }}
                              >
                                <defs>
                                  <clipPath id={`avatar-clip-${entry.rank}`}>
                                    <path d="M 2 16 A 14 14 0 0 1 16 2 L 24 2 A 14 14 0 0 1 38 16 L 38 32 A 14 14 0 0 1 24 46 L 16 46 A 14 14 0 0 1 2 32 Z" />
                                  </clipPath>
                                  <linearGradient id={`border-gradient-${entry.rank}`} x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stopColor="#B02E0C" />
                                    <stop offset="25%" stopColor="#FF7A00" />
                                    <stop offset="50%" stopColor="#FFA733" />
                                    <stop offset="75%" stopColor="#FF7A00" />
                                    <stop offset="100%" stopColor="#B02E0C" />
                                  </linearGradient>
                                  <linearGradient id={`shine-gradient-${entry.rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255, 167, 51, 0.9)" />
                                    <stop offset="25%" stopColor="rgba(255, 167, 51, 0.6)" />
                                    <stop offset="50%" stopColor="rgba(255, 167, 51, 0.3)" />
                                    <stop offset="75%" stopColor="rgba(255, 167, 51, 0.6)" />
                                    <stop offset="100%" stopColor="rgba(255, 167, 51, 0.9)" />
                                  </linearGradient>
                                  <filter id={`oval-glow-${entry.rank}`}>
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                    <feMerge> 
                                      <feMergeNode in="coloredBlur"/>
                                      <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                  </filter>
                                </defs>
                                {/* Shimmering semi-gloss orange ring */}
                                <path
                                  d="M 2 16 A 14 14 0 0 1 16 2 L 24 2 A 14 14 0 0 1 38 16 L 38 32 A 14 14 0 0 1 24 46 L 16 46 A 14 14 0 0 1 2 32 Z"
                                  stroke={`url(#border-gradient-${entry.rank})`}
                                  strokeWidth="3"
                                  fill="white"
                                />
                                {/* Enhanced shine effect at top-right */}
                                <path
                                  d="M 25 8 A 14 14 0 0 1 32 16"
                                  stroke={`url(#shine-gradient-${entry.rank})`}
                                  strokeWidth="3"
                                  fill="none"
                                  strokeLinecap="round"
                                  opacity="0.9"
                                />
                                {/* Enhanced shine effect at bottom-left */}
                                <path
                                  d="M 15 40 A 14 14 0 0 1 8 32"
                                  stroke={`url(#shine-gradient-${entry.rank})`}
                                  strokeWidth="2.5"
                                  fill="none"
                                  strokeLinecap="round"
                                  opacity="0.8"
                                />
                                {/* Avatar image, clipped to stadium */}
                                <image
                                  href={getAvatarForUser(entry.user)}
                                  x="2"
                                  y="2"
                                  width="36"
                                  height="44"
                                  clipPath={`url(#avatar-clip-${entry.rank})`}
                                  preserveAspectRatio="xMidYMid slice"
                                />
                              </svg>
                              
                            </div>
                          </td>
                          <td className="pl-2 sm:px-6 py-4 whitespace-nowrap text-[9px] sm:text-sm text-gray-900">
                            <span 
                              className="cursor-pointer hover:text-[#E6C200] transition-colors"
                              onClick={() => handleAvatarClick(entry)}
                            >
                              {entry.user}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-[9px] sm:text-sm text-gray-900">{entry.balance}</td>
                          <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[9px] sm:text-sm text-gray-900">{entry.votingShare.toFixed(1)}%</td>
                          <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[9px] sm:text-sm text-gray-900 text-center sm:text-left">
                            <div className="flex flex-col sm:block">
                              <span className="sm:hidden">{entry.totalMined}</span>
                              <span className="text-[7px] sm:text-xs text-gray-500 sm:hidden">{entry.distance.toFixed(1)}km</span>
                              <span className="hidden sm:inline">{entry.totalMined} <span className="text-[6px] sm:text-xs text-gray-500">({entry.distance.toFixed(1)}km)</span></span>
                            </div>
                          </td>
                          <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[7px] sm:text-sm text-gray-900">
                            {entry.lastMined}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                          {isLoading ? 'Loading...' : (searchTerm ? 'No matching users found' : 'No Wingo activity yet')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Log View */}
        {!isLeaderboardView && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between gap-4">
                {/* Search left */}
                <div className="flex-1 min-w-0 hidden sm:block">
                  <div className="relative w-full max-w-[160px]">
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
                <div className="flex-1 flex flex-col justify-center items-center min-w-0 pl-6 sm:pl-0 text-center">
                  {/* Toggle Button */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-1">
                    <div className="flex">
                      <button
                        onClick={() => setIsLeaderboardView(true)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          isLeaderboardView
                            ? 'bg-[#E6C200] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span className="hidden sm:inline">WINGO Leaderboard</span>
                        <span className="sm:hidden">Rank</span>
                      </button>
                      <button
                        onClick={() => setIsLeaderboardView(false)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                          !isLeaderboardView
                            ? 'bg-[#E6C200] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <span className="hidden sm:inline">Ransaction Log</span>
                        <span className="sm:hidden">Log</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* DAISY badge right */}
                <div className="flex-1 flex justify-end">
                  <span className="inline-block px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
                    D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
                  </span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 font-mono">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-1 sm:px-6 py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleLogSort('date')}
                    >
                      Date
                      {logSortField === 'date' && (
                        <span className="ml-1">
                          {logSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleLogSort('username')}
                    >
                      Runner
                      {logSortField === 'username' && (
                        <span className="ml-1">
                          {logSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleLogSort('wingoMined')}
                    >
                      <span className="hidden sm:inline">Δ WINGO</span>
                      <span className="sm:hidden">Δ WINGO</span>
                      {logSortField === 'wingoMined' && (
                        <span className="ml-1">
                          {logSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleLogSort('km')}
                    >
                      <span className="hidden sm:inline">KM Logged</span>
                      <span className="sm:hidden">KM</span>
                      {logSortField === 'km' && (
                        <span className="ml-1">
                          {logSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleLogSort('category')}
                    >
                      Tag
                      {logSortField === 'category' && (
                        <span className="ml-1">
                          {logSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th 
                      className="px-1 sm:px-6 py-3 text-left text-[8px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleLogSort('fullId')}
                    >
                      W-ID
                      {logSortField === 'fullId' && (
                        <span className="ml-1">
                          {logSortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logEntries
                    .filter(entry => 
                      searchTerm === '' || 
                      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      entry.fullId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      entry.category.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (logSortField === 'date') {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);
                        const dateComparison = logSortDirection === 'asc' 
                          ? dateA.getTime() - dateB.getTime()
                          : dateB.getTime() - dateA.getTime();
                        
                        if (dateComparison === 0) {
                          return logSortDirection === 'asc'
                            ? a.id - b.id
                            : b.id - a.id;
                        }
                        return dateComparison;
                      } else if (logSortField === 'wingoMined') {
                        return logSortDirection === 'asc'
                          ? a.wingoMined - b.wingoMined
                          : b.wingoMined - a.wingoMined;
                      } else if (logSortField === 'km') {
                        return logSortDirection === 'asc'
                          ? a.kmLogged - b.kmLogged
                          : b.kmLogged - a.kmLogged;
                      } else if (logSortField === 'username') {
                        return logSortDirection === 'asc'
                          ? a.username.localeCompare(b.username)
                          : b.username.localeCompare(a.username);
                      } else if (logSortField === 'category') {
                        return logSortDirection === 'asc'
                          ? a.category.localeCompare(b.category)
                          : b.category.localeCompare(a.category);
                      } else if (logSortField === 'fullId') {
                        return logSortDirection === 'asc'
                          ? a.fullId.localeCompare(b.fullId)
                          : b.fullId.localeCompare(a.fullId);
                      } else {
                        return logSortDirection === 'asc'
                          ? (a.initiation === b.initiation ? 0 : a.initiation ? 1 : -1)
                          : (a.initiation === b.initiation ? 0 : a.initiation ? -1 : 1);
                      }
                    })
                    .map((entry) => {
                      const topMiningSessionIds = getTopMiningSessionIds();
                      const lowestMiningSessionId = getLowestMiningSessionId();
                      const isTopMiningSession = topMiningSessionIds.includes(entry.id);
                      const isLowestMiningSession = entry.id === lowestMiningSessionId;
                      const topRank = isTopMiningSession ? topMiningSessionIds.indexOf(entry.id) + 1 : 0;
                      
                      return (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[7px] sm:text-sm text-gray-500">
                            {format(new Date(entry.date), 'M.dd.yy')}
                          </td>
                          <td className="px-1 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-900">{entry.username}</td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-[8px] sm:text-sm text-gray-900">
                            {entry.wingoMined > 0 ? '+' : ''}{entry.wingoMined}
                            {isTopMiningSession && (
                              <span className="ml-1">{getMedalEmoji(topRank)}</span>
                            )}
                            {isLowestMiningSession && (
                              <span className="ml-1">🪙</span>
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
        )}
        
        {/* Text Coach DAISY™ Link */}
        <div className="mt-8 text-center">
          <p className="text-[13px] sm:text-lg text-gray-600">
            Text Coach DAISY™ at{' '}
            <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700 font-medium">
              929-WAK-GRIG
            </a>{' '}
            to start mining
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500 italic sm:mt-1">
            {lastUpdated && (
              <>Updated: {lastUpdated} 🐎🤖🪽8️⃣</>
            )}
          </p>
        </div>

        {/* Avatar Modal */}
        {showAvatarModal && selectedAvatar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-sm perspective-1000">
              <div className="relative w-full h-96 transform-style-preserve-3d transition-transform duration-700" id="avatarCard">
                {/* Front Side - Keep exactly as is */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
                    {/* Avatar Image with Username Overlay */}
                    <div className="relative">
                      <img
                        src={selectedAvatar.avatarUrl}
                        alt={`${selectedAvatar.username}'s avatar`}
                        className="w-full h-96 object-cover"
                        style={{ objectPosition: 'center 25%' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/avatars/taytay.png';
                        }}
                      />
                      {/* Username Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                          {selectedAvatar.username}
                        </h3>
                      </div>
                      {/* Close Button */}
                      <button
                        onClick={() => setShowAvatarModal(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold bg-black/30 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
                      >
                        <span className="-mt-0.5">×</span>
                      </button>
                      {/* Stats Button (disabled, back card removed) */}
                      {/*
                      <button
                        onClick={() => {
                          const card = document.getElementById('avatarCard');
                          if (card) {
                            card.style.transform = card.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
                          }
                        }}
                        className="absolute top-4 left-4 text-white hover:text-gray-300 text-sm font-bold bg-black/30 rounded-lg px-3 py-1 flex items-center justify-center backdrop-blur-sm"
                      >
                        Stats
                      </button>
                      */}
                    </div>
                    {/* Stats Section */}
                    <div className="p-2">
                      <div className="bg-gray-50 rounded-lg p-2 flex flex-row items-center justify-start w-full">
                        {/* WINGO Balance with Rank */}
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#E6C200] to-[#FFD700] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">W</span>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 font-medium">Balance</div>
                            <div className="text-lg font-bold text-gray-900">
                              {selectedAvatar.balance.toLocaleString()} <span className="text-xs text-gray-500 font-normal">(Rank: {leaderboardData.find(e => e.user === selectedAvatar?.username)?.rank ?? '--'})</span>
                            </div>
                          </div>
                        </div>
                        {/* Voting Share */}
                        <div className="text-left ml-6">
                          <div className="text-xs text-gray-500 font-medium">Voting Share</div>
                          <div className="text-lg font-bold text-gray-900">
                            {leaderboardData.find(e => e.user === selectedAvatar?.username)?.votingShare.toFixed(1) ?? '--'}%
                          </div>
                        </div>
                        {/* Mined Stats */}
                        <div className="text-left ml-6">
                          <div className="text-xs text-gray-500 font-medium">Mined</div>
                          <div className="text-lg font-bold text-gray-900">
                            {selectedAvatar.totalMined.toLocaleString()} <span className="text-xs text-gray-500 font-normal">({selectedAvatar.distance.toFixed(1)} km)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Back Side - Baseball Card Style (removed, see ledger-back-card-backup.tsx for backup) */}
                {/*
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                  ... (see backup file)
                </div>
                */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ledger; 