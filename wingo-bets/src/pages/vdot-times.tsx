import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { User } from '../types';
import html2canvas from 'html2canvas';
import { Share2, Download } from 'lucide-react';

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

    // Get times from the race times table
    const mileTime = raceTimesTable[vdot]?.['1.6093'];
    const fiveKTime = raceTimesTable[vdot]?.['5'];
    const halfMaraTime = raceTimesTable[vdot]?.['21.0975'];
    const maraTime = raceTimesTable[vdot]?.['42.195'];

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
    <div className="min-h-screen bg-white sm:bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Race & Pace Guide
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Based on J. Daniels' VDOT Projections</p>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
            <button
              onClick={() => setViewMode('race')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'race'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Race Times
            </button>
            <button
              onClick={() => setViewMode('pace')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'pace'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Training Paces
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <label htmlFor="vdot" className="block text-sm font-medium text-gray-700 mb-1">
                Enter VDOT
              </label>
              <input
                type="number"
                id="vdot"
                value={vdotInput}
                onChange={(e) => setVdotInput(e.target.value)}
                className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6C200] focus:border-transparent"
                placeholder="e.g., 50"
                min="30"
                max="85"
              />
            </div>
            <button
              onClick={generateVDOTCard}
              className="w-full sm:w-auto px-4 py-2 bg-[#E6C200] text-white rounded-md font-medium hover:bg-[#D4B200] transition-colors"
            >
              Generate Card
            </button>
          </div>
        </div>

        {/* Full Table View - Hidden on mobile */}
        <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VDOT
                  </th>
                  {viewMode === 'race' ? (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mile (1.6km)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        5K
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Half Marathon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marathon
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Easy Pace (per mile)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Threshold Pace (per mile)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interval Pace (per mile)
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
                  .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort VDOT values in descending order
                  .map(([vdot, times]) => (
                    <tr key={vdot} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vdot}
                      </td>
                      {viewMode === 'race' ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatMinutesToTime(times['1.6093'])}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatMinutesToTime(times['5'])}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatMinutesToTime(times['21.0975'])}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatMinutesToTime(times['42.195'])}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {times['e_mile']}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {times['t_mile']}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

        {/* Mobile Card View - Only shown on mobile */}
        {showCard && (
          <div className="sm:hidden bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">VDOT {vdotInput}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {viewMode === 'race' ? (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </>
                      ) : (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pace Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pace (per mile)</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {viewMode === 'race' ? (
                      <>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Mile (1.6km)</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData.mile}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">5K</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData['5k']}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Half Marathon</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData.hm}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Marathon</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData.marathon}</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Easy Pace</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData.easy}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Threshold Pace</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData.threshold}</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">Interval Pace</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cardData.interval}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VDOTTimes; 