import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import { usePageTitle } from "../hooks/usePageTitle";

interface WagerProps {
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

export default function Wager({ user }: WagerProps) {
  usePageTitle("The DAISY™ Degenerate Dashboard");
  const [selectedOption, setSelectedOption] = useState<'willy' | 'british'>('willy');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betSlip, setBetSlip] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [showDecimalPopup, setShowDecimalPopup] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  // Fetch leaderboard data to get usernames
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=0&single=true&output=csv&t=${Date.now()}`, { cache: 'no-store' });
        const text = await response.text();
        const rows = text.trim().split('\n');
        const data = rows.slice(1); // skip header row
        
        const parsed = data
          .filter(row => row.trim() && row.split(',').length >= 5)
          .map((row) => {
            const columns = row.split(',');
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
      } catch (err) {
        console.error('Failed to fetch leaderboard data:', err);
      }
    };

    fetchLeaderboardData();
  }, []);

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes('.')) {
      setShowDecimalPopup(true);
      e.target.value = value.replace('.', ''); // Remove the decimal point
      setTimeout(() => setShowDecimalPopup(false), 2000); // Hide popup after 2 seconds
      return;
    }
    setBetAmount(Number(value) || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (betAmount <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }
    setError(null);
    setBetSlip('generated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The <span className="font-bold">D</span><span className="text-[#00CED1]">AI</span><span className="font-bold">SY</span><span className="text-xl align-top ml-1">™</span> Degenerate Dashboard
          </h1>
        </div>

        {/* Featured Wager */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Wager</h2>
            <p className="text-lg text-gray-600 mt-2">Brooklyn M*le – August 3, 2025</p>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                 onClick={() => setSelectedOption('willy')}>
              <input
                type="radio"
                name="bet-option"
                checked={selectedOption === 'willy'}
                onChange={() => setSelectedOption('willy')}
                className="h-4 w-4 text-wingo-600 focus:ring-wingo-500"
              />
              <div className="flex-1">
                <label className="text-base sm:text-lg font-medium text-gray-900">Willy Wingo</label>
                <span className="ml-2 text-green-600 font-medium">+110</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                 onClick={() => setSelectedOption('british')}>
              <input
                type="radio"
                name="bet-option"
                checked={selectedOption === 'british'}
                onChange={() => setSelectedOption('british')}
                className="h-4 w-4 text-wingo-600 focus:ring-wingo-500"
              />
              <div className="flex-1">
                <label className="text-base sm:text-lg font-medium text-gray-900">British Colombia</label>
                <span className="ml-2 text-red-600 font-medium">-110</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  User:
                </label>
                <select
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                >
                  <option value="">Select user</option>
                  {leaderboardData.map((entry) => (
                    <option key={entry.user} value={entry.user}>
                      {entry.user}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Wager:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="betAmount"
                    value={betAmount || ''}
                    onChange={handleBetAmountChange}
                    min="1"
                    step="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">WINGO</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-55 mx-auto block bg-wingo-600 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              Generate Wager Slip
            </button>
          </form>
        </div>

        {/* Bet Slip Display */}
        {betSlip && (
          <div className="md:col-span-2 mt-6 flex justify-center">
            <div style={{background: 'rgba(30,30,30,0.92)', borderRadius: '16px', color: 'white', padding: '2rem', minWidth: 320, maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.18)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <span style={{display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.13)', borderRadius: 4, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 500, textTransform: 'uppercase', fontStyle: 'italic'}}>Wager</span>
                <div className="flex items-center gap-2">
                  <span style={{fontSize: '0.95rem', padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.5)', borderRadius: 6}}>
                    D<span style={{color: '#00CED1'}}>AI</span>SY™
                  </span>
                </div>
              </div>
              <div style={{fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.2rem'}}>
                <div style={{marginBottom: '0.7rem'}}><b>User:</b> {username || 'Guest'}</div>
                <div style={{marginBottom: '0.7rem'}}><b>Event:</b> Brooklyn M*le – Aug. 3, 2025</div>
                <div style={{marginBottom: '0.7rem'}}>
                  <b>Pick:</b> {selectedOption === 'willy' ? 'Willy Wingo' : 'British Colombia'} 
                  <span style={{fontFamily: 'monospace', fontWeight: 700, marginLeft: 8}}>
                    ({selectedOption === 'willy' ? '+110' : '-110'})
                  </span>
                </div>
                <div style={{marginBottom: '0.7rem'}}>
                  <b>Staked:</b> <span className="text-[#E6C200] font-bold">W</span> {betAmount} WINGO
                </div>
              </div>
              <hr style={{borderColor: 'rgba(255,255,255,0.13)', margin: '1.5rem 0'}} />
              <div style={{fontSize: '0.95rem', marginBottom: '0.5rem'}}>
                {username || 'Guest'} collects <b>
                  <span className="text-[#E6C200] font-bold">W</span>{' '}
                  {selectedOption === 'willy' 
                    ? `${(betAmount * 2.1).toFixed(0)}`
                    : `${(betAmount * 1.909).toFixed(0)}`}
                </b> if {selectedOption === 'willy' ? 'Willy Wingo' : 'British Colombia'} wins.
              </div>
            </div>
          </div>
        )}

        {/* Decimal Warning Popup */}
        {showDecimalPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border-2 border-wingo-600 rounded-lg shadow-lg p-4 animate-fade-in-out">
              <div className="flex items-center">
                <span className="text-wingo-600 font-medium">DAISY™ doesn't do decimals</span>
              </div>
            </div>
          </div>
        )}

        {/* DAISY Text */}
        {betSlip && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Send screenshot to D<span className="text-cyan-400">AI</span>SY™: <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700 font-medium">929-WAK-GRIG</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 