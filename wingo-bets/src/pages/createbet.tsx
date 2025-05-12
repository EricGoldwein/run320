import React, { useState, useEffect } from 'react';
import { User, BetType, Bet } from '../types/bet';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import Papa from 'papaparse';

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

  if (loading) {
    return <div className="max-w-xl mx-auto text-center text-lg py-12">Loading VDOT tables...</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Bet</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VDOT</label>
            <input
              type="number"
              value={vdot}
              onChange={e => setVdot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
              placeholder="e.g., 61"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
            <select
              value={distance}
              onChange={e => setDistance(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
            >
              {DISTANCES.map(d => (
                <option key={d.label} value={d.value}>{d.label}</option>
              ))}
            </select>
            {distance === 'custom' && (
              <input
                type="number"
                value={customDistance}
                onChange={e => setCustomDistance(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                placeholder="Enter distance in km"
              />
            )}
          </div>
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleProject}
              className="px-4 py-2 bg-wingo-600 text-white rounded-md font-bold hover:bg-wingo-700 shadow"
            >
              Project Time
            </button>
            {projectedTime && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">Projection:</div>
                <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-center font-mono text-lg text-gray-800">
                  {projectedTime ? <span className="font-bold">{projectedTime}</span> : <span className="text-gray-400">—</span>}
                </div>
              </div>
            )}
          </div>
          {projectedTime && (
            <div className="md:col-span-2 mt-4 flex flex-col md:flex-row md:items-start md:gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">$WINGO Wager Line</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleTargetTimeChange(adjustTime(targetTime, -10))} className="px-2 py-1 bg-gray-200 rounded h-[42px]">-</button>
                  <div className="flex-1 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-center font-mono text-lg">
                    {targetTime ? <span className="font-bold">{targetTime}</span> : <span className="text-gray-400">—</span>}
                  </div>
                  <button type="button" onClick={() => handleTargetTimeChange(adjustTime(targetTime, 10))} className="px-2 py-1 bg-gray-200 rounded h-[42px]">+</button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center mt-4 md:mt-6">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 shadow min-w-[180px]">
                  <span className="font-bold text-blue-800">DAISY™ Odds:</span>
                  <span className="font-mono text-lg text-blue-900">{odds ? odds : <span className='text-gray-400'>—</span>}</span>
                  <span className="text-blue-700">{odds ? `(${getImpliedProbability(odds)})` : ''}</span>
                  <div className="relative group">
                    <span className="ml-1 text-blue-400 cursor-help"><FaInfoCircle /></span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      DAISY™ Odds show the probability of running under the WINGO Wager Line. For example, +100 means 50% chance of running under the target time.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {projectedTime && (
            <div className="md:col-span-2 mt-2 flex flex-col md:flex-row md:items-center md:gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Wager ($WINGO)</label>
                <input
                  type="number"
                  value={wager}
                  onChange={e => setWager(e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                  placeholder="e.g., 100"
                  min="0"
                />
              </div>
              {wager && odds && (
                <div className="flex items-center mt-2 md:mt-6 text-blue-700 font-medium bg-blue-50 border border-blue-200 rounded px-3 py-2">
                  You win {getPayout(odds, wager)} $WINGO if run is under {targetTime}
                </div>
              )}
            </div>
          )}
          {projectedTime && (
            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowSlip(true)}
                className="px-4 py-2 bg-gray-900 text-white rounded-md font-bold hover:bg-gray-800 shadow"
              >
                Generate Betting Slip
              </button>
            </div>
          )}
          {showSlip && (
            <div className="md:col-span-2 mt-6 flex justify-center">
              <div style={{background: 'rgba(30,30,30,0.92)', borderRadius: '16px', color: 'white', padding: '2rem', minWidth: 320, maxWidth: 440, boxShadow: '0 4px 24px rgba(0,0,0,0.18)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <span style={{display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255,255,255,0.13)', borderRadius: 4, color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', letterSpacing: '0.1em', marginBottom: '1rem', fontWeight: 500, textTransform: 'uppercase', fontStyle: 'italic'}}>Wager</span>
                  <span style={{fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(0,0,0,0.5)', borderRadius: 6}}>
                    D<span style={{color: '#00CED1'}}>AI</span>SY™
                  </span>
                </div>
                <h4 style={{fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em'}}>
                  {DISTANCES.find(d => String(d.value) === String(distance))?.label || distance} Run
                </h4>
                <div style={{fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.2rem'}}>
                  <div style={{marginBottom: '0.7rem'}}>
                    <b>Event:</b> Runner racing {DISTANCES.find(d => String(d.value) === String(distance))?.label || distance}, {new Date().toLocaleDateString()}
                  </div>
                  <div><b>Projection:</b> {projectedTime}</div>
                  <div><b>$WINGO Wager Line:</b> {targetTime} <span style={{fontFamily: 'monospace', fontWeight: 700, marginLeft: 8}}>{odds}</span></div>
                </div>
                <hr style={{borderColor: 'rgba(255,255,255,0.13)', margin: '1.5rem 0'}} />
                <div style={{fontSize: '1.1rem', marginBottom: '1.2rem'}}>
                  <b>{user?.username || 'User'}</b> wins <b>{getPayout(odds, wager)} $WINGO</b> if runner finishes <b>under {targetTime}</b>.
                </div>
                <div style={{fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '1.2rem'}}>
                  Odds determined by Coach DAISY™.
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button type="button" onClick={() => {/* TODO: implement share functionality */}} style={{background: 'none', border: 'none', color: 'rgba(0,206,209,0.95)', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 600}}>Share</button>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="md:col-span-2 rounded-md bg-red-50 p-4 mt-2">
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
          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
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
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              Create Bet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 