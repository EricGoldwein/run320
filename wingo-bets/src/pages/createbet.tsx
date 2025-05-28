import React, { useState, useEffect, useRef } from 'react';
import { BetType, Bet } from '../types/bet';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';

const DISTANCES = [
  { label: '5k', value: 5 },
  { label: '10k', value: 10 },
  { label: 'Half Mare-athon', value: 21.0975 },
  { label: 'Mare-athon', value: 42.195 },
  { label: 'Custom (km)', value: 'custom' },
];

interface CreateBetProps {
  user: User;
  onCreateBet: (bet: Omit<Bet, 'id' | 'status' | 'createdAt' | 'participants'>) => void;
}

function normalCdf(z: number): number {
  // Standard normal CDF using error function approximation
  return 0.5 * (1 + (Math as any).erf(z / Math.sqrt(2)));
}

// Polyfill for Math.erf if not present
if (!(Math as any).erf) {
  (Math as any).erf = function(x: number): number {
    // Abramowitz and Stegun formula 7.1.26
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    const t = 1.0/(1.0 + p*x);
    const y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
    return sign*y;
  };
}

export default function CreateBet({ user, onCreateBet }: CreateBetProps) {
  const navigate = useNavigate();
  const slipRef = useRef<HTMLDivElement>(null);
  const [vdot, setVdot] = useState('');
  const [distance, setDistance] = useState('5');
  const [customDistance, setCustomDistance] = useState('');
  const [projectedTime, setProjectedTime] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [odds, setOdds] = useState('+100');
  const [error, setError] = useState('');
  const [wager, setWager] = useState('');
  const [raceTimesTable, setRaceTimesTable] = useState<{ [vdot: string]: { [distance: string]: number } }>({});
  const [stdevTable, setStdevTable] = useState<{ [vdot: string]: { [distance: string]: number } }>({});
  const [loading, setLoading] = useState(true);
  const [showSlip, setShowSlip] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Load CSVs on mount
  useEffect(() => {
    setLoading(true);
    let loaded = 0;
    // Load race times
    fetch('/vdot_full_race_times.csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const table: { [vdot: string]: { [distance: string]: number } } = {};
            results.data.forEach((row: any) => {
              // Force VDOT key to be integer string
              const vdotRaw = row['vdot'] || row['VDOT'] || row[''];
              const vdot = parseInt(vdotRaw).toString();
              if (!vdot || isNaN(Number(vdot))) return;
              table[vdot] = {};
              Object.keys(row).forEach(key => {
                if (key !== 'vdot' && key !== 'VDOT' && row[key]) {
                  table[vdot][key] = parseFloat(row[key]);
                }
              });
            });
            console.log('Loaded VDOT keys:', Object.keys(table));
            setRaceTimesTable(table);
            loaded++;
            if (loaded === 2) setLoading(false);
          }
        });
      });
    // Load stdevs
    fetch('/Granular_VDOT_Race_Time_Variability.csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const table: { [vdot: string]: { [distance: string]: number } } = {};
            results.data.forEach((row: any) => {
              const vdot = row['VDOT'] || row['vdot'];
              const dist = row['Distance'] || row['distance'];
              const stddev = row['StdDev (sec)'] || row['stddev'];
              if (!vdot || !dist || !stddev) return;
              if (!table[vdot]) table[vdot] = {};
              table[vdot][dist.toLowerCase()] = parseFloat(stddev);
            });
            setStdevTable(table);
            loaded++;
            if (loaded === 2) setLoading(false);
          }
        });
      });
  }, []);

  // Helper to map user-friendly distance values to CSV/backend keys
  function getRaceTimeDistanceKey(distance: string | number): string {
    if (distance === 5 || distance === '5') return '5';
    if (distance === 10 || distance === '10') return '10';
    if (distance === 21.0975 || distance === '21.0975') return '21.0975';
    if (distance === 42.195 || distance === '42.195') return '42.195';
    return String(distance);
  }

  // Update all lookups to use the mapped key
  function getStdDev(vdot: number, distance: string): number | null {
    const vdotLow = Math.floor(vdot).toString();
    const vdotHigh = Math.ceil(vdot).toString();
    const d = getRaceTimeDistanceKey(distance); // stdev table may use '5k', '10k', etc.
    if (!stdevTable[vdotLow] || !stdevTable[vdotHigh]) return null;
    const stdLow = stdevTable[vdotLow][d];
    const stdHigh = stdevTable[vdotHigh][d];
    if (stdLow === undefined || stdHigh === undefined) return null;
    if (vdotLow === vdotHigh) return stdLow;
    return stdLow + (stdHigh - stdLow) * (vdot - parseFloat(vdotLow)) / (parseFloat(vdotHigh) - parseFloat(vdotLow));
  }

  function interpolateRaceTime(vdot: number, distance: string | number): number | null {
    const vdotLow = Math.floor(vdot).toString();
    const vdotHigh = Math.ceil(vdot).toString();
    const key = getRaceTimeDistanceKey(distance);
    console.log('VDOT:', vdot, 'vdotLow:', vdotLow, 'vdotHigh:', vdotHigh, 'key:', key);
    console.log('raceTimesTable[vdotLow]:', raceTimesTable[vdotLow]);
    console.log('raceTimesTable[vdotHigh]:', raceTimesTable[vdotHigh]);
    if (!raceTimesTable[vdotLow] || !raceTimesTable[vdotHigh]) return null;
    const tLow = raceTimesTable[vdotLow][key];
    const tHigh = raceTimesTable[vdotHigh][key];
    console.log('tLow:', tLow, 'tHigh:', tHigh);
    if (tLow === undefined || tHigh === undefined) return null;
    if (vdotLow === vdotHigh) return Math.round(tLow * 60);
    const minutes = tLow + (tHigh - tLow) * (vdot - parseFloat(vdotLow)) / (parseFloat(vdotHigh) - parseFloat(vdotLow));
    return Math.round(minutes * 60);
  }

  // Update getProjectedTime to use the correct table and formatting
  function getProjectedTime(vdot: number, distance: string): string {
    const sec = interpolateRaceTime(vdot, distance);
    if (sec === null) return '';
    return formatSecondsToTime(sec);
  }

  // Update calculateOdds to use the correct getStdDev
  const calculateOdds = (projected: string, target: string, vdot: number, distance: string): string => {
    // Convert times to seconds
    const toSeconds = (t: string) => {
      const parts = t.split(':').map(Number);
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    };
    const projSec = toSeconds(projected);
    const targSec = toSeconds(target);
    const stddev = getStdDev(vdot, distance);
    if (!stddev || stddev === 0) return '+100';
    // Z-score: positive if target is slower than projection (probability of running under target)
    const z = (targSec - projSec) / stddev;
    // Probability of running under target (lower time is better)
    const prob = normalCdf(z);
    // Convert probability to American odds
    if (prob <= 0) return '+100';
    if (prob === 0.5) return '+100';
    if (prob > 0.5) {
      // Favorite (negative odds)
      const odds = -Math.round((prob / (1 - prob)) * 100);
      return odds > -10000 ? `${odds}` : '-10000';
    } else {
      // Underdog (positive odds)
      const odds = Math.round(((1 - prob) / prob) * 100);
      return odds < 10000 ? `+${odds}` : '+10000';
    }
  };

  // Implied probability from American odds, capped 1-99%
  const getImpliedProbability = (odds: string): string => {
    if (!odds) return '';
    const n = parseInt(odds);
    let prob = 0;
    if (n > 0) {
      prob = 100 / (n + 100);
    } else {
      prob = Math.abs(n) / (Math.abs(n) + 100);
    }
    prob = Math.max(0.01, Math.min(0.99, prob));
    return (prob * 100).toFixed(1) + '%';
  };

  // Helper to add/subtract seconds from HH:MM:SS
  const adjustTime = (time: string, delta: number) => {
    const parts = time.split(':').map(Number);
    let total = parts[0] * 3600 + parts[1] * 60 + parts[2] + delta;
    if (total < 0) total = 0;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate payout from odds and wager
  const getPayout = (odds: string, wager: string) => {
    const w = parseFloat(wager);
    if (isNaN(w) || !odds) return '0';
    if (odds.startsWith('+')) {
      return ((w * parseInt(odds.slice(1)) / 100) + w).toFixed(2);
    } else if (odds.startsWith('-')) {
      return ((w / (Math.abs(parseInt(odds)) / 100)) + w).toFixed(2);
    }
    return w.toFixed(2);
  };

  // Helper to format seconds to HH:MM:SS
  function formatSecondsToTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Helper to get the stddev distance key
  function getStdDevDistanceKey(distance: string): string {
    if (distance === '5') return '5k';
    if (distance === '10') return '10k';
    if (distance === '21.0975') return 'half';
    if (distance === '42.195') return 'marathon';
    return '';
  }

  const handleProject = () => {
    setError('');
    const v = parseFloat(vdot);
    let d = distance === 'custom' ? parseFloat(customDistance) : parseFloat(distance);
    if (isNaN(v) || isNaN(d) || d <= 0) {
      setError('Please enter valid VDOT and distance.');
      return;
    }
    if (v < 40 || v > 75) {
      setError('VDOT must be between 40 and 75.');
      return;
    }
    const proj = getProjectedTime(v, String(d));
    if (!proj) {
      setError('Could not calculate projected time. Please check your VDOT and distance.');
      return;
    }
    setProjectedTime(proj);
    setTargetTime(proj);
    setOdds('+100');
  };

  const handleTargetTimeChange = (val: string) => {
    setTargetTime(val);
    if (projectedTime && vdot) {
      const stddevKey = getStdDevDistanceKey(distance);
      setOdds(calculateOdds(projectedTime, val, parseFloat(vdot), stddevKey));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vdot || !distance || !targetTime || !odds || !wager) {
      setError('Please fill in all fields.');
      return;
    }
    onCreateBet({
      title: `${distance}km Run`,
      description: `VDOT ${vdot} runner targeting ${targetTime}`,
      type: 'time',
      creator: user,
      amount: parseFloat(wager),
      odds: parseFloat(odds),
      conditions: [{
        type: 'time',
        value: targetTime,
        comparison: 'under'
      }],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    navigate('/');
  };

  useEffect(() => {
    if (projectedTime && targetTime && vdot && distance) {
      const stddevKey = getStdDevDistanceKey(distance);
      setOdds(calculateOdds(projectedTime, targetTime, parseFloat(vdot), stddevKey));
    }
  }, [projectedTime, targetTime, vdot, distance]);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    if (!slipRef.current) {
      console.log('No slip reference found');
      return;
    }
    
    try {
      console.log('Starting to capture slip...');
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      });
      
      console.log('Canvas created, converting to blob...');
      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          console.log('Failed to create blob');
          return;
        }
        
        console.log('Blob created, creating file...');
        const file = new File([blob], 'wingo-bet.png', { type: 'image/png' });
        
        if (navigator.share) {
          console.log('Web Share API available, opening share dialog...');
          navigator.share({
            title: 'WINGO Bet',
            text: `Check out my ${DISTANCES.find(d => String(d.value) === String(distance))?.label.replace('k', 'K') || distance} bet!`,
            files: [file]
          }).catch((error) => {
            console.error('Share failed:', error);
            setShowShareMenu(true);
          });
        } else {
          console.log('Web Share API not available, showing menu...');
          setShowShareMenu(true);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error in handleShare:', error);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    if (!slipRef.current) return;
    try {
      console.log('Starting download...');
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = 'wingo-bet.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error in handleDownload:', error);
    }
  };

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    if (!slipRef.current) return;
    try {
      console.log('Starting copy...');
      const canvas = await html2canvas(slipRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      });
      
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          console.log('Failed to create blob for copy');
          return;
        }
        
        try {
          console.log('Attempting to copy to clipboard...');
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob
            })
          ]);
          console.log('Successfully copied to clipboard');
          setShowShareMenu(false);
        } catch (error) {
          console.error('Error copying to clipboard:', error);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error in handleCopyImage:', error);
    }
  };

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu && !(event.target as Element).closest('.share-menu')) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  if (loading) {
    return <div className="max-w-xl mx-auto text-center text-lg py-12">Loading VDOT tables...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Bet
          </h1>
          {user.id === 'guest' && (
            <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 max-w-2xl mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You're viewing as a guest. <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">Log in</a> or <a href="/register" className="font-medium underline text-yellow-700 hover:text-yellow-600">register</a> to place bets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VDOT</label>
                  <input
                    type="number"
                    value={vdot}
                    onChange={e => {
                      setVdot(e.target.value);
                      if (e.target.value && distance) {
                        const v = parseFloat(e.target.value);
                        const d = distance === 'custom' ? parseFloat(customDistance) : parseFloat(distance);
                        if (!isNaN(v) && !isNaN(d) && d > 0 && v >= 40 && v <= 75) {
                          const proj = getProjectedTime(v, String(d));
                          if (proj) {
                            setProjectedTime(proj);
                            setTargetTime(proj);
                            setOdds('+100');
                          }
                        }
                      }
                    }}
                    className="w-24 h-[42px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <select
                    value={distance}
                    onChange={e => {
                      setDistance(e.target.value);
                      if (vdot && e.target.value) {
                        const v = parseFloat(vdot);
                        const d = e.target.value === 'custom' ? parseFloat(customDistance) : parseFloat(e.target.value);
                        if (!isNaN(v) && !isNaN(d) && d > 0 && v >= 40 && v <= 75) {
                          const proj = getProjectedTime(v, String(d));
                          if (proj) {
                            setProjectedTime(proj);
                            setTargetTime(proj);
                            setOdds('+100');
                          }
                        }
                      }
                    }}
                    className="w-24 h-[42px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                  >
                    {DISTANCES.map(d => (
                      <option key={d.label} value={d.value}>{d.label.replace('k', 'K')}</option>
                    ))}
                  </select>
                  {distance === 'custom' && (
                    <input
                      type="number"
                      value={customDistance}
                      onChange={e => {
                        setCustomDistance(e.target.value);
                        if (vdot && e.target.value) {
                          const v = parseFloat(vdot);
                          const d = parseFloat(e.target.value);
                          if (!isNaN(v) && !isNaN(d) && d > 0 && v >= 40 && v <= 75) {
                            const proj = getProjectedTime(v, String(d));
                            if (proj) {
                              setProjectedTime(proj);
                              setTargetTime(proj);
                              setOdds('+100');
                            }
                          }
                        }
                      }}
                      className="mt-2 w-24 h-[42px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                      placeholder="Enter distance in km"
                    />
                  )}
                </div>
              </div>
              <div className="hidden sm:flex items-end">
                <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-center font-mono text-lg text-gray-800 h-[42px] flex items-center">
                  Projection: {projectedTime ? <span className="font-bold">{projectedTime}</span> : <span className="text-gray-400">—</span>}
                </div>
              </div>
            </div>

            {projectedTime && (
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="inline-flex items-center">
                      <span className="font-bold">W</span>
                      <span>INGO</span>
                    </span> Wager Line
                  </label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleTargetTimeChange(adjustTime(targetTime, -10))} className="px-2 py-1 bg-gray-200 rounded h-[42px]">-</button>
                    <div className="w-32 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-center font-mono text-lg">
                      {targetTime ? <span className="font-bold">{targetTime}</span> : <span className="text-gray-400">—</span>}
                    </div>
                    <button type="button" onClick={() => handleTargetTimeChange(adjustTime(targetTime, 10))} className="px-2 py-1 bg-gray-200 rounded h-[42px]">+</button>
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow min-w-[180px]">
                    <span className="font-bold text-blue-800">DAISY™ Odds:</span>
                    <span className="font-mono text-lg text-blue-900">{odds ? odds : <span className='text-gray-400'>—</span>}</span>
                    <span className="text-blue-700">{odds ? `(${getImpliedProbability(odds)})` : ''}</span>
                    <div className="relative group">
                      <span className="ml-1 text-blue-400 cursor-help hidden sm:inline-block"><FaInfoCircle /></span>
                      <span className="ml-1 text-blue-400 cursor-help sm:hidden" style={{ padding: '8px' }}><FaInfoCircle /></span>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        DAISY™ Odds show probability of running under WINGO Wager Line. Example: +100 means 50% chance of running under WWL.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {projectedTime && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wager (<span className="text-[#E6C200] font-bold">W</span>)</label>
                    <input
                      type="number"
                      value={wager}
                      onChange={e => setWager(e.target.value)}
                      className="w-24 h-[42px] px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={user.id === 'guest'}
                      className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                        user.id === 'guest' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-wingo-600 hover:bg-wingo-700'
                      }`}
                    >
                      {user.id === 'guest' ? 'Log in to Place Bet' : 'Place Bet'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSlip(true)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md font-bold hover:bg-gray-800 shadow"
                    >
                      Generate Bet Slip
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVdot('');
                        setDistance('5');
                        setCustomDistance('');
                        setProjectedTime('');
                        setTargetTime('');
                        setOdds('+100');
                        setError('');
                        setWager('');
                      }}
                      className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                {wager && odds && (
                  <div className="flex items-center text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded px-4 py-3 w-fit">
                    <div className="flex items-center gap-1">
                      <span>Win {getPayout(odds, wager)} <span className="text-[#E6C200] font-bold">W</span> if run is under {targetTime}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
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
            <div className="text-[10px] text-gray-400 text-center mt-4">
              18+ and present in Wingate. Gambling problem? Text 929-WAK-GRIG. Terms apply.
            </div>
          </form>
        </div>

        {showSlip && (
          <div className="md:col-span-2 mt-6 flex justify-center">
            <div ref={slipRef} style={{background: 'rgba(30,30,30,0.92)', borderRadius: '16px', color: 'white', padding: '2rem', minWidth: 320, maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.18)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <span style={{display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.13)', borderRadius: 4, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 500, textTransform: 'uppercase', fontStyle: 'italic'}}>Wager</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 share-menu">
                        <button
                          onClick={handleDownload}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Image
                        </button>
                        <button
                          onClick={handleCopyImage}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Image
                        </button>
                      </div>
                    )}
                  </div>
                  <span style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.5)', borderRadius: 6}}>
                    D<span style={{color: '#00CED1'}}>AI</span>SY™
                  </span>
                </div>
              </div>
              <h4 style={{fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em'}}>
                {DISTANCES.find(d => String(d.value) === String(distance))?.label.replace('k', 'K') || distance} Run
              </h4>
              <div style={{fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.2rem'}}>
                <div style={{marginBottom: '0.7rem'}}>
                  <b>Event:</b> {DISTANCES.find(d => String(d.value) === String(distance))?.label.replace('k', 'K') || distance} ({new Date().toLocaleDateString()})
                </div>
                <div><b><span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> Wager Line:</b> {targetTime} <span style={{fontFamily: 'monospace', fontWeight: 700, marginLeft: 8}}>{odds.startsWith('-') ? `(${odds})` : odds}</span></div>
              </div>
              <hr style={{borderColor: 'rgba(255,255,255,0.13)', margin: '1.5rem 0'}} />
              <div style={{fontSize: '1.1rem', marginBottom: '1.2rem'}}>
                <b>{user?.username || 'User'}</b> wins <b>{getPayout(odds, wager)}{' '}
                <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                </span></b> if runner finishes <b>under {targetTime}</b>.
              </div>
              <div style={{fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '1.2rem'}}>
                Odds determined by DAISY™ Degenerate Formula.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 