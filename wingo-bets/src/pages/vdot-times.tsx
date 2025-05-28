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
    <div className="min-h-screen bg-gray-100 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Race & Pace Guide</h1>
          <p className="text-sm text-gray-600 mb-4 sm:mb-6">Based on J. Daniels' VDOT Projections</p>
          
          {/* View Mode Toggle */}
          <div className="flex space-x-2 sm:space-x-4 mb-4 sm:mb-6">
            <button
              onClick={() => setViewMode('race')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                viewMode === 'race'
                  ? 'bg-[#E6C200] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Race Times
            </button>
            <button
              onClick={() => setViewMode('pace')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                viewMode === 'pace'
                  ? 'bg-[#E6C200] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Training Paces
            </button>
          </div>

          {/* VDOT Input */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="number"
                value={vdotInput}
                onChange={(e) => setVdotInput(e.target.value)}
                placeholder="Enter VDOT (30-85)"
                className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E6C200] focus:border-transparent"
              />
              <button
                onClick={generateVDOTCard}
                className="w-full sm:w-auto px-6 py-2 bg-[#E6C200] text-white rounded-lg hover:bg-[#D4B200] transition-colors"
              >
                Generate Card
              </button>
            </div>
          </div>

          {/* Tables */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        VDOT
                      </th>
                      {viewMode === 'race' ? (
                        <>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mile
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            5K
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Half
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Full
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Easy
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Threshold
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interval
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(viewMode === 'race' ? raceTimesTable : pacesTable)
                      .filter(([vdot]) => {
                        if (!searchTerm) return true;
                        return vdot.includes(searchTerm);
                      })
                      .map(([vdot, times]) => (
                        <tr key={vdot} className="hover:bg-gray-50">
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {vdot}
                          </td>
                          {viewMode === 'race' ? (
                            <>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatMinutesToTime(times['1.6093'])}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatMinutesToTime(times['5'])}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatMinutesToTime(times['21.0975'])}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatMinutesToTime(times['42.195'])}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {times['e_mile']}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {times['t_mile']}
                              </td>
                              <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {times['i_mile']}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* VDOT Card */}
          {showCard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full relative" ref={cardRef}>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#E6C200] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">★</span>
                </div>
                <h2 className="text-xl font-bold mb-4">VDOT {vdotInput} Card</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Race Times</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Mile:</span> {cardData.mile}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">5K:</span> {cardData['5k']}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Half:</span> {cardData.hm}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Full:</span> {cardData.marathon}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Training Paces</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Easy:</span> {cardData.easy}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Threshold:</span> {cardData.threshold}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Interval:</span> {cardData.interval}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCard(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-[#E6C200] text-white rounded hover:bg-[#D4B200]"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VDOTTimes; 