import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { User } from '../types';
import html2canvas from 'html2canvas';

interface VDOTTimesProps {
  initialView?: 'race' | 'pace';
  user?: User | null;
}

const VDOTTimes: React.FC<VDOTTimesProps> = ({ initialView = 'race', user }) => {
  const [raceTimesTable, setRaceTimesTable] = useState<{ [vdot: string]: { [distance: string]: number } }>({});
  const [pacesTable, setPacesTable] = useState<{ [vdot: string]: { [pace: string]: string } }>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'race' | 'pace'>(initialView);
  const [searchTerm, setSearchTerm] = useState('');
  const [vdotInput, setVdotInput] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [cardData, setCardData] = useState({
    mile: '--',
    '5k': '--',
    hm: '--',
    marathon: '--',
    easy: '--',
    threshold: '--',
    interval: '--'
  });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load race times CSV
    fetch('/vdot_full_race_times.csv')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load VDOT data: ${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const table: { [vdot: string]: { [distance: string]: number } } = {};
            results.data.forEach((row: any) => {
              const vdotRaw = row['vdot'] || row['VDOT'] || row[''];
              const vdot = parseInt(vdotRaw).toString();
              if (!vdot || isNaN(Number(vdot))) return;
              table[vdot] = {};
              Object.keys(row).forEach(key => {
                if (key !== 'vdot' && key !== 'VDOT' && row[key]) {
                  table[vdot][key] = parseFloat(row[key]);
                }
              });
              // Calculate PentaWingo and DecaWingo times based on mile pace
              if (table[vdot]['1.6093']) {
                const mileTime = table[vdot]['1.6093'];
                // Calculate time for 9.34 meters (difference between mile and PentaWingo)
                const pacePerMeter = mileTime / 1609.34;
                const timeForDifference = pacePerMeter * 9.34;
                // Subtract the time for 9.34 meters from mile time and apply multiplier
                table[vdot]['1.6'] = (mileTime - timeForDifference) * 0.9995;
                // Calculate DecaWingo time based on 2-mile projection adjusted for 3.2km
                if (table[vdot]['3.2187']) {
                  const twoMileTime = table[vdot]['3.2187'];
                  const pacePerMeter = twoMileTime / 3218.7;
                  table[vdot]['3.2'] = (pacePerMeter * 3200) * 0.999;
                }
              }
            });
            setRaceTimesTable(table);
            setLoading(false);
          }
        });
      });

    // Load paces CSV
    fetch('/vdot_paces.csv')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load VDOT paces: ${res.status} ${res.statusText}`);
        }
        return res.text();
      })
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results: Papa.ParseResult<any>) => {
            const table: { [vdot: string]: { [pace: string]: string } } = {};
            results.data.forEach((row: any) => {
              const vdot = row['VDOT'] || row['vdot'];
              if (!vdot) return;
              table[vdot] = {};
              Object.keys(row).forEach(key => {
                if (key !== 'VDOT' && key !== 'vdot' && row[key]) {
                  table[vdot][key] = row[key];
                }
              });
            });
            setPacesTable(table);
          }
        });
      });
  }, []);

  // Helper to format minutes to time
  function formatMinutesToTime(minutes: number): string {
    const totalSeconds = Math.round(minutes * 60);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const generateVDOTCard = () => {
    const vdot = parseInt(vdotInput);
    if (isNaN(vdot) || vdot < 30 || vdot > 85) {
      alert('Please enter a valid VDOT between 30 and 85');
      return;
    }

    // Get times from the race times table using the correct keys
    const mileTime = raceTimesTable[vdot]?.['1.6093'];  // Changed from '1609.34'
    const fiveKTime = raceTimesTable[vdot]?.['5'];      // Changed from '5000'
    const halfMaraTime = raceTimesTable[vdot]?.['21.0975']; // Changed from '21097.5'
    const maraTime = raceTimesTable[vdot]?.['42.195'];  // Changed from '42195'

    // Get paces from the training paces table
    const easyPace = pacesTable[vdot]?.['e_mile'];
    const thresholdPace = pacesTable[vdot]?.['t_mile'];
    const intervalPace = pacesTable[vdot]?.['i_mile'];

    const formatRaceTime = (value: number | undefined) => {
      if (value === undefined) return '--';
      return formatMinutesToTime(value);
    };

    const formatPace = (value: string | undefined) => {
      if (value === undefined) return '--';
      return value;
    };

    setCardData({
      mile: formatRaceTime(mileTime),
      '5k': formatRaceTime(fiveKTime),
      hm: formatRaceTime(halfMaraTime),
      marathon: formatRaceTime(maraTime),
      easy: formatPace(easyPace),
      threshold: formatPace(thresholdPace),
      interval: formatPace(intervalPace)
    });
    setShowCard(true);
  };

  const handleShare = async () => {
    if (!cardRef.current) {
      console.log('No card reference found');
      return;
    }
    
    try {
      console.log('Starting to capture card...');
      const canvas = await html2canvas(cardRef.current, {
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
        const file = new File([blob], 'vdot-card.png', { type: 'image/png' });
        
        if (navigator.share) {
          console.log('Web Share API available, opening share dialog...');
          navigator.share({
            title: `${user ? `${user.username}'s ` : ''}Race & Pace Guide`,
            text: `Check out my ${vdotInput} VDOT Race & Pace Guide!`,
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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      console.log('Starting download...');
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: true,
        useCORS: true,
        allowTaint: true
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = 'vdot-card.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error in handleDownload:', error);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    try {
      console.log('Starting copy...');
      const canvas = await html2canvas(cardRef.current, {
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
    return <div className="max-w-7xl mx-auto text-center text-lg py-12">Loading VDOT tables...</div>;
  }

  const distances = ['1.6', '3.2', '5', '10', '15', '21.0975', '42.195'];
  const vdots = Object.keys(raceTimesTable).sort((a, b) => parseInt(a) - parseInt(b));
  const filteredVdots = vdots.filter(vdot => vdot.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 leading-tight py-1">
            <span className="text-gray-900">D</span><span className="text-[#00bcd4] font-extrabold">AI</span><span className="text-gray-900">SY™</span> Race & Pace Guide
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Based on J. Daniels VDOT Projections
          </p>
        </div>

        {/* VDOT Card Generator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 max-w-sm mx-auto">
            <div className="flex gap-4 items-center justify-center">
              <div className="w-24">
                <input
                  type="number"
                  value={vdotInput}
                  onChange={(e) => setVdotInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                  placeholder="VDOT"
                  min="30"
                  max="85"
                />
              </div>
              <button
                onClick={generateVDOTCard}
                className="px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 shadow"
              >
                Generate Card
              </button>
            </div>
          </div>

          {showCard && (
            <div ref={cardRef} className="mt-4 bg-[rgba(30,30,30,0.92)] rounded-xl p-6 text-white shadow-lg relative">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">
                  {user ? `${user.username}'s ` : ''}Race & Pace Guide ({vdotInput} VDOT)
                </h3>
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
                  <span className="px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
                    D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
                  </span>
                </div>
              </div>
              <div className="hidden sm:grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-2xl mx-auto">
                {/* Race Projections - Left Side (Desktop) */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-[#00ffeb] mb-2 relative">
                    Race Projections
                    <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-[#00ffeb] to-transparent"></div>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">PentaWingo:</span>
                    <span className="font-mono text-lg">{raceTimesTable[vdotInput]?.['1.6'] ? formatMinutesToTime(raceTimesTable[vdotInput]['1.6']) : '--'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">5K:</span>
                    <span className="font-mono text-lg">{cardData['5k']}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">10K:</span>
                    <span className="font-mono text-lg">{raceTimesTable[vdotInput]?.['10'] ? formatMinutesToTime(raceTimesTable[vdotInput]['10']) : '--'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">HM:</span>
                    <span className="font-mono text-lg">{cardData.hm}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Mare-athon:</span>
                    <span className="font-mono text-lg">{cardData.marathon}</span>
                  </div>
                </div>

                {/* Training Paces - Right Side (Desktop) */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-[#00ffeb] mb-2 relative">
                    Training
                    <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-[#00ffeb] to-transparent"></div>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Easy:</span>
                    <span className="font-mono text-lg">{pacesTable[vdotInput]?.e_mile || '--'}/m*le</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Mare-athon:</span>
                    <span className="font-mono text-lg">{pacesTable[vdotInput]?.m_mile || '--'}/m*le</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Threshold:</span>
                    <span className="font-mono text-lg">{pacesTable[vdotInput]?.t_mile || '--'}/m*le</span>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-2">
                    <div className="text-gray-300 flex items-center">Interval:</div>
                    <div className="font-mono text-lg">
                      {pacesTable[vdotInput]?.i_400m ? 
                        `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8) <= 59 ? 
                          `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8)}s` :
                          `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8 / 60)}:${(Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8) % 60).toString().padStart(2, '0')}`}/WINGO (320m)` : 
                        '--'}
                    </div>
                    <div></div>
                    <div className="font-mono text-xs italic text-gray-400 -mt-1 -mb-4 ml-[calc(28%-3.5rem)]">
                      {pacesTable[vdotInput]?.i_400m ? 
                        `${parseInt(pacesTable[vdotInput].i_400m) <= 59 ? 
                          `${pacesTable[vdotInput].i_400m}s` :
                          `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) / 60)}:${(parseInt(pacesTable[vdotInput].i_400m) % 60).toString().padStart(2, '0')}`}/400m` : 
                        '--'}
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 -mt-4">
                    <div className="text-gray-300 flex items-center">Repetition:</div>
                    <div className="font-mono text-lg">
                      {pacesTable[vdotInput]?.r_400m ? 
                        `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8) <= 59 ? 
                          `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8)}s` :
                          `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8 / 60)}:${(Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8) % 60).toString().padStart(2, '0')}`}/WINGO (320m)` : 
                        '--'}
                    </div>
                    <div></div>
                    <div className="font-mono text-xs italic text-gray-400 -mt-1 ml-[calc(28%-3.5rem)]">
                      {pacesTable[vdotInput]?.r_400m ? 
                        `${parseInt(pacesTable[vdotInput].r_400m) <= 59 ? 
                          `${pacesTable[vdotInput].r_400m}s` :
                          `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) / 60)}:${(parseInt(pacesTable[vdotInput].r_400m) % 60).toString().padStart(2, '0')}`}/400m` : 
                        '--'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-4">
                {/* Race Projections Card */}
                <div className="bg-[rgba(40,40,40,0.92)] rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-[#00ffeb] mb-3 relative">
                    Race Projections
                    <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-[#00ffeb] to-transparent"></div>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">PentaWingo:</span>
                      <span className="font-mono text-lg">{raceTimesTable[vdotInput]?.['1.6'] ? formatMinutesToTime(raceTimesTable[vdotInput]['1.6']) : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">5K:</span>
                      <span className="font-mono text-lg">{cardData['5k']}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">10K:</span>
                      <span className="font-mono text-lg">{raceTimesTable[vdotInput]?.['10'] ? formatMinutesToTime(raceTimesTable[vdotInput]['10']) : '--'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">HM:</span>
                      <span className="font-mono text-lg">{cardData.hm}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Mare-athon:</span>
                      <span className="font-mono text-lg">{cardData.marathon}</span>
                    </div>
                  </div>
                </div>

                {/* Training Paces Card */}
                <div className="bg-[rgba(40,40,40,0.92)] rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-[#00ffeb] mb-3 relative">
                    Training
                    <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-[#00ffeb] to-transparent"></div>
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Easy:</span>
                      <span className="font-mono text-lg">{pacesTable[vdotInput]?.e_mile || '--'}/m*le</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Mare-athon:</span>
                      <span className="font-mono text-lg">{pacesTable[vdotInput]?.m_mile || '--'}/m*le</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Threshold:</span>
                      <span className="font-mono text-lg">{pacesTable[vdotInput]?.t_mile || '--'}/m*le</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Interval:</span>
                        <span className="font-mono text-lg">
                          {pacesTable[vdotInput]?.i_400m ? 
                            `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8) <= 59 ? 
                              `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8)}s` :
                              `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8 / 60)}:${(Math.floor(parseInt(pacesTable[vdotInput].i_400m) * 0.8) % 60).toString().padStart(2, '0')}`}/WINGO` : 
                            '--'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs italic text-gray-400">
                          {pacesTable[vdotInput]?.i_400m ? 
                            `${parseInt(pacesTable[vdotInput].i_400m) <= 59 ? 
                              `${pacesTable[vdotInput].i_400m}s` :
                              `${Math.floor(parseInt(pacesTable[vdotInput].i_400m) / 60)}:${(parseInt(pacesTable[vdotInput].i_400m) % 60).toString().padStart(2, '0')}`}/400m` : 
                            '--'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Repetition:</span>
                        <span className="font-mono text-lg">
                          {pacesTable[vdotInput]?.r_400m ? 
                            `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8) <= 59 ? 
                              `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8)}s` :
                              `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8 / 60)}:${(Math.floor(parseInt(pacesTable[vdotInput].r_400m) * 0.8) % 60).toString().padStart(2, '0')}`}/WINGO` : 
                            '--'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs italic text-gray-400">
                          {pacesTable[vdotInput]?.r_400m ? 
                            `${parseInt(pacesTable[vdotInput].r_400m) <= 59 ? 
                              `${pacesTable[vdotInput].r_400m}s` :
                              `${Math.floor(parseInt(pacesTable[vdotInput].r_400m) / 60)}:${(parseInt(pacesTable[vdotInput].r_400m) % 60).toString().padStart(2, '0')}`}/400m` : 
                            '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowCard(false)}
                className="absolute bottom-4 right-4 text-gray-400 hover:text-white text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search VDOT"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-24 sm:w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
            />
            <div className="flex-1 flex justify-center px-4">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('race')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'race'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Race Times
                </button>
                <button
                  onClick={() => setViewMode('pace')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'pace'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Training Paces
                </button>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
              D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
            </span>
          </div>
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full relative" style={{ transform: 'rotateX(180deg)' }}>
            <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900/80 text-white px-2 py-1 rounded-l-md text-xs font-medium animate-pulse">
              ← Scroll →
            </div>
            <div style={{ transform: 'rotateX(180deg)' }}>
              {viewMode === 'race' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        VDOT
                      </th>
                      {distances.map(distance => (
                        <th key={distance} scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                          {distance === '1.6' ? <span>PentaWingo<br />(1,600m)</span> :
                           distance === '3.2' ? <span>DecaWingo<br />(3,200m)</span> :
                           distance === '5' ? '5 km' :
                           distance === '10' ? '10 km' :
                           distance === '15' ? '15 km' :
                           distance === '21.0975' ? <span>HM</span> :
                           'Mare-athon'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVdots.map(vdot => (
                      <tr key={vdot} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {vdot}
                        </td>
                        {distances.map(distance => (
                          <td key={distance} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {raceTimesTable[vdot][distance] ? formatMinutesToTime(raceTimesTable[vdot][distance]) : '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">
                        VDOT
                      </th>
                      <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Easy (km)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Easy (M*LE)
                      </th>
                      <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marathon (km)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marathon (M*LE)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Threshold 400m
                      </th>
                      <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Threshold km
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Threshold M*LE
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interval 400m
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interval km
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interval 1200m
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interval M*LE
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rep 200m
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rep 300m
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rep 400m
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rep 600m
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rep 800m
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVdots.map(vdot => (
                      <tr key={vdot} className="hover:bg-gray-50">
                        <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 z-10">
                          {vdot}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['e_km'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['e_mile'] || '-'}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['m_km'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['m_mile'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['t_400m'] || '-'}
                        </td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['t_km'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['t_mile'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['i_400m'] && parseInt(vdot) > 46 ? 
                            `${Math.floor(parseInt(pacesTable[vdot]['i_400m']) * 0.8) <= 59 ? 
                              `${Math.floor(parseInt(pacesTable[vdot]['i_400m']) * 0.8)}s` :
                              `${Math.floor(parseInt(pacesTable[vdot]['i_400m']) * 0.8 / 60)}:${(Math.floor(parseInt(pacesTable[vdot]['i_400m']) * 0.8) % 60).toString().padStart(2, '0')}`}/WINGO` : 
                            '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['i_km'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['i_1200m'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['i_mile'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['r_200m'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['r_300m'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['r_400m'] ? 
                            `${Math.floor(parseInt(pacesTable[vdot]['r_400m']) * 0.8) <= 59 ? 
                              `${Math.floor(parseInt(pacesTable[vdot]['r_400m']) * 0.8)}s` :
                              `${Math.floor(parseInt(pacesTable[vdot]['r_400m']) * 0.8 / 60)}:${(Math.floor(parseInt(pacesTable[vdot]['r_400m']) * 0.8) % 60).toString().padStart(2, '0')}`}/WINGO` : 
                            '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['r_600m'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pacesTable[vdot]?.['r_800m'] || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VDOTTimes; 