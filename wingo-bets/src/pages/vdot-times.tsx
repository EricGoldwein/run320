import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { User } from '../types';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import styles from './vdot-times.module.css';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

interface VDOTTimesProps {
  initialView?: 'pace' | 'race';
  user?: User | null;
}

const customStyles = `
  .custom-scrollbar {
    position: relative;
  }
  .custom-scrollbar::before {
    content: '';
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: #EDF2F7;
    z-index: 50;
  }
  .custom-scrollbar::-webkit-scrollbar {
    height: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #EDF2F7;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #CBD5E0;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #A0AEC0;
  }
  .simplebar-scrollbar::before {
    background-color: #CBD5E0;
    border-radius: 4px;
  }
  .simplebar-scrollbar.simplebar-visible::before {
    opacity: 1;
  }
  .simplebar-track.simplebar-horizontal {
    height: 8px;
    background: #EDF2F7;
  }
  .simplebar-track.simplebar-vertical {
    width: 8px;
    background: #EDF2F7;
  }
  .table-container {
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .table-container::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  .table-container::-webkit-scrollbar-track {
    background: #EDF2F7;
  }
  .table-container::-webkit-scrollbar-thumb {
    background: #CBD5E0;
    border-radius: 4px;
  }
  .table-container::-webkit-scrollbar-thumb:hover {
    background: #A0AEC0;
  }
  /* Fixed column widths */
  .fixed-width-column {
    width: 80px !important;
    min-width: 80px !important;
    max-width: 80px !important;
  }
  /* Force center alignment for specific headers */
  .fixed-width-column[data-header="pentawingo"],
  .fixed-width-column[data-header="mare-athon"] {
    text-align: center !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
  /* Chill section specific widths */
  .chill-column {
    width: 140px !important;
    min-width: 140px !important;
    max-width: 140px !important;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);

const useSyncScroll = () => {
  const [topScroll, setTopScroll] = useState<HTMLDivElement | null>(null);
  const [bottomScroll, setBottomScroll] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!topScroll || !bottomScroll) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      if (target === topScroll) {
        bottomScroll.scrollLeft = target.scrollLeft;
      } else {
        topScroll.scrollLeft = target.scrollLeft;
      }
    };

    topScroll.addEventListener('scroll', handleScroll);
    bottomScroll.addEventListener('scroll', handleScroll);

    return () => {
      topScroll.removeEventListener('scroll', handleScroll);
      bottomScroll.removeEventListener('scroll', handleScroll);
    };
  }, [topScroll, bottomScroll]);

  return { topScroll, setTopScroll, bottomScroll, setBottomScroll };
};

const VDOTTimes: React.FC<VDOTTimesProps> = ({ initialView = 'pace', user }) => {
  const [raceTimesTable, setRaceTimesTable] = useState<{ [vdot: string]: { [distance: string]: number } }>({});
  const [pacesTable, setPacesTable] = useState<{ [vdot: string]: { [pace: string]: string } }>({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'race' | 'pace'>(initialView);
  const [searchTerm, setSearchTerm] = useState('');
  const [vdotInput, setVdotInput] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showVdotFinder, setShowVdotFinder] = useState(false);
  const [findVdotTime, setFindVdotTime] = useState('');
  const [findVdotDistance, setFindVdotDistance] = useState('5');
  const [foundVdot, setFoundVdot] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardData, setCardData] = useState({
    mile: '--',
    '5k': '--',
    '10k': '--',
    hm: '--',
    marathon: '--',
    easy: '--',
    threshold: '--',
    interval: '--'
  });
  const [timeInput, setTimeInput] = useState('');
  const [timeFormat, setTimeFormat] = useState<'mm:ss' | 'h:mm:ss'>('mm:ss');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const { topScroll, setTopScroll, bottomScroll, setBottomScroll } = useSyncScroll();

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

  // Helper to format seconds to M:SS
  function formatSecondsToTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Add effect to update card data when VDOT changes
  useEffect(() => {
    const vdot = parseInt(vdotInput);
    if (isNaN(vdot) || vdot < 30 || vdot > 85) return;

    // Get times from the race times table using the correct keys
    const mileTime = raceTimesTable[vdot.toString()]?.['1.6093'];
    const fiveKTime = raceTimesTable[vdot.toString()]?.['5'];
    const tenKTime = raceTimesTable[vdot.toString()]?.['10'];
    const halfMaraTime = raceTimesTable[vdot.toString()]?.['21.0975'];
    const maraTime = raceTimesTable[vdot.toString()]?.['42.195'];

    // Get paces from the training paces table
    const easyPace = pacesTable[vdot.toString()]?.['e_mile'];
    const thresholdPace = pacesTable[vdot.toString()]?.['t_mile'];
    const intervalPace = pacesTable[vdot.toString()]?.['i_mile'];

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
      '10k': formatRaceTime(tenKTime),
      hm: formatRaceTime(halfMaraTime),
      marathon: formatRaceTime(maraTime),
      easy: formatPace(easyPace),
      threshold: formatPace(thresholdPace),
      interval: formatPace(intervalPace)
    });
  }, [vdotInput, raceTimesTable, pacesTable]);

  // Modify generateVDOTCard to only handle showing the card
  const generateVDOTCard = () => {
    const vdot = parseInt(vdotInput);
    if (isNaN(vdot) || vdot < 30 || vdot > 85) {
      alert('Please enter a valid VDOT between 30 and 85');
      return;
    }
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
        
        // Check if running on mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
          if (navigator.share) {
            console.log('Mobile device detected, using Web Share API...');
            navigator.share({
              title: `${user && user.username !== 'Guest' ? `${user.username}'s ` : 'Your '}Race & Pace Guide`,
              text: `Check out my ${vdotInput} VDOT Race & Pace Guide!`,
              files: [file]
            }).catch((error) => {
              console.error('Share failed:', error);
              // Fallback to copy image on mobile if share fails
              handleCopyImage();
            });
          } else {
            // If Web Share API is not available on mobile, use copy image
            handleCopyImage();
          }
        } else {
          console.log('Desktop detected, showing menu...');
          setShowShareMenu(true);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error in handleShare:', error);
      setShowShareMenu(true);
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
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = `${user ? `${user.username}-` : ''}vdot-${vdotInput}-card.png`;
      
      // Trigger the download
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
          
          // Show a temporary success message
          const successMsg = document.createElement('div');
          successMsg.textContent = 'Image copied to clipboard!';
          successMsg.style.position = 'fixed';
          successMsg.style.bottom = '20px';
          successMsg.style.left = '50%';
          successMsg.style.transform = 'translateX(-50%)';
          successMsg.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          successMsg.style.color = 'white';
          successMsg.style.padding = '8px 16px';
          successMsg.style.borderRadius = '4px';
          successMsg.style.zIndex = '1000';
          document.body.appendChild(successMsg);
          setTimeout(() => successMsg.remove(), 2000);
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          // On mobile, if copy fails, try to save the image
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          if (isMobile) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png', 1.0);
            link.download = `${user ? `${user.username}-` : ''}vdot-${vdotInput}-card.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // On desktop, show the share menu as fallback
            setShowShareMenu(true);
          }
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

  const findVDOTFromTime = () => {
    if (!findVdotTime || !findVdotDistance) return;

    // Convert time to minutes
    const timeParts = findVdotTime.split(':');
    let timeInMinutes: number;
    
    try {
      if (timeParts.length === 2) {
        // MM:SS format
        timeInMinutes = parseInt(timeParts[0]) + parseInt(timeParts[1]) / 60;
      } else if (timeParts.length === 3) {
        // HH:MM:SS format
        timeInMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]) + parseInt(timeParts[2]) / 60;
      } else {
        return;
      }

      if (isNaN(timeInMinutes)) {
        return;
      }

      // Find closest VDOT
      let closestVdot = null;
      let minDiff = Infinity;

      Object.entries(raceTimesTable).forEach(([vdot, times]) => {
        const raceTime = times[findVdotDistance];
        if (raceTime) {
          const diff = Math.abs(raceTime - timeInMinutes);
          if (diff < minDiff) {
            minDiff = diff;
            closestVdot = vdot;
          }
        }
      });

      if (closestVdot) {
        setFoundVdot(closestVdot);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  // Update VDOT when time or distance changes
  useEffect(() => {
    if (findVdotTime && findVdotDistance) {
      findVDOTFromTime();
    }
  }, [findVdotTime, findVdotDistance]);

  // Close VDOT finder when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showVdotFinder && !(event.target as Element).closest('.vdot-finder-modal')) {
        setShowVdotFinder(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVdotFinder]);

  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distance = e.target.value;
    setFindVdotDistance(distance);
    setFindVdotTime('');
    // Set time format based on distance
    if (distance === '21.0975' || distance === '42.195') {
      setTimeFormat('h:mm:ss');
    } else {
      setTimeFormat('mm:ss');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto text-center text-lg py-12">Loading VDOT tables...</div>;
  }

  const distances = ['1.6', '3.2', '5', '10', '15', '21.0975', '42.195'];
  const vdots = Object.keys(raceTimesTable).sort((a, b) => parseInt(a) - parseInt(b));
  const filteredVdots = vdots.filter(vdot => vdot.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Race & Pace Guide</h1>
          <p className="text-xl text-gray-600">Based on J. Daniels VDOT and DAISY™ Maths</p>
        </div>

        {/* DAISY™ Maths Explained Link */}
        <div className="absolute top-4 left-4 sm:left-8">
          <a href="/daisy_math" className="text-xs text-gray-500 hover:text-gray-700">
            DAISY™ Maths Explained
          </a>
        </div>

        {/* VDOT Card Generator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 pb-2 max-w-sm mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={vdotInput}
                  onChange={(e) => setVdotInput(e.target.value)}
                  placeholder="VDOT"
                  className="w-24 px-3 py-2 border rounded-md"
                  min="30"
                  max="85"
                />
                <button
                  onClick={generateVDOTCard}
                  className="px-4 py-2 bg-wingo-600 text-white rounded-md hover:bg-wingo-700"
                >
                  Generate Card
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowVdotFinder(true)}
                  className="text-xs text-gray-600 hover:text-gray-800 italic"
                >
                  What's my VDOT?
                </button>
              </div>
            </div>
          </div>

          {/* VDOT Finder Modal */}
          {showVdotFinder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-50 rounded-xl p-6 max-w-md w-full mx-4 vdot-finder-modal">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Find Your VDOT</h3>
                  <button
                    onClick={() => setShowVdotFinder(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4 items-end justify-center">
                    <div className="w-30">
                      <select
                        value={findVdotDistance}
                        onChange={handleDistanceChange}
                        className="w-full h-[42px] px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 text-sm"
                      >
                        <option value="1.6">PentaWingo</option>
                        <option value="5">5K</option>
                        <option value="10">10K</option>
                        <option value="21.0975">HM</option>
                        <option value="42.195">Mare-athon</option>
                      </select>
                    </div>
                    <div className="w-28">
                      <input
                        type="text"
                        value={findVdotTime}
                        onChange={(e) => setFindVdotTime(e.target.value)}
                        className="w-full h-[42px] px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 text-base"
                        placeholder={timeFormat === 'h:mm:ss' ? "h:mm:ss" : "mm:ss"}
                        style={{ fontSize: '16px' }}
                      />
                    </div>
                  </div>
                  {foundVdot && (
                    <div className="text-center text-2xl font-bold text-gray-900">
                      Estimated VDOT: {foundVdot}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (foundVdot) {
                        setVdotInput(foundVdot);
                        generateVDOTCard();
                        setShowVdotFinder(false);
                      }
                    }}
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!foundVdot}
                  >
                    Generate Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCard && (
            <div ref={cardRef} className="mt-4 bg-[rgba(30,30,30,0.92)] rounded-xl p-6 text-white shadow-lg relative max-w-lg mx-auto">
              <div className="flex justify-between items-start mb-6 px-2">
                <div>
                  <h3 className="text-xl font-bold">
                    {user && user.username !== 'Guest' ? `${user.username}'s Wingo Guide` : 'Your Wingo Guide'}
                  </h3>
                  <div className="text-sm text-gray-400 mt-1">
                    {vdotInput} VDOT
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
                    D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
                  </span>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="p-2 bg-gray-800 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                      title="Share"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
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
                </div>
              </div>
              <div className="hidden sm:grid sm:grid-cols-2 gap-x-0 gap-y-2 max-w-lg mx-auto">
                {/* Race Projections - Left Side (Desktop) */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-[#00ffeb] mb-2 relative">
                    Race Projections
                    <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-[#00ffeb] to-transparent"></div>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">PentaWingo:</span>
                    <span className="font-mono text-base">{cardData.mile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">5K:</span>
                    <span className="font-mono text-base">{cardData['5k']}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">10K:</span>
                    <span className="font-mono text-base">{cardData['10k']}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">HM:</span>
                    <span className="font-mono text-base">{cardData.hm}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Mare-athon:</span>
                    <span className="font-mono text-base">{cardData.marathon}</span>
                  </div>
                </div>

                {/* Training Paces - Right Side (Desktop) */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-[#00ffeb] mb-2 relative">
                    Training
                    <div className="absolute bottom-0 left-0 w-3/4 h-[1px] bg-gradient-to-r from-[#00ffeb] to-transparent"></div>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Easy:</span>
                    <span className="font-mono text-base">{pacesTable[vdotInput]?.e_mile || '--'}/m*le</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Mare-athon:</span>
                    <span className="font-mono text-base">{pacesTable[vdotInput]?.m_mile || '--'}/m*le</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">Threshold:</span>
                    <span className="font-mono text-base">{pacesTable[vdotInput]?.t_mile || '--'}/m*le</span>
                  </div>
                  {parseInt(vdotInput) > 46 && (
                    <div className="grid grid-cols-[auto_1fr] gap-x-2">
                      <div className="text-gray-300 flex items-center">Interval:</div>
                      <div className="font-mono text-base">
                        {pacesTable[vdotInput]?.i_320m ? (
                          <span>{formatSecondsToTime(parseInt(pacesTable[vdotInput].i_320m))}/Wingo</span>
                        ) : (
                          <span>No data</span>
                        )}
                      </div>
                      <div></div>
                      <div className="font-mono text-xs italic text-gray-400 -mt-1 -mb-4 ml-[calc(28%-1rem)]">
                        {pacesTable[vdotInput]?.i_400m ? 
                          `${pacesTable[vdotInput]['i_400m']}s/400` : 
                          '--'}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-[auto_1fr] gap-x-2">
                    <div className="text-gray-300 flex items-center">Repetition:</div>
                    <div className="font-mono text-base">
                      {pacesTable[vdotInput]?.r_320m ? (
                        <span>{formatSecondsToTime(parseInt(pacesTable[vdotInput].r_320m))}/Wingo</span>
                      ) : (
                        <span>No data</span>
                      )}
                    </div>
                    <div></div>
                    <div className="font-mono text-xs italic text-gray-400 -mt-1 ml-[calc(28%-1rem)]">
                      {pacesTable[vdotInput]?.['r_400m'] ? 
                        `${pacesTable[vdotInput]['r_400m']}s/400` : 
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
                      <span className="font-mono text-base">{cardData.mile}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">5K:</span>
                      <span className="font-mono text-base">{cardData['5k']}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">10K:</span>
                      <span className="font-mono text-base">{cardData['10k']}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">HM:</span>
                      <span className="font-mono text-base">{cardData.hm}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Mare-athon:</span>
                      <span className="font-mono text-base">{cardData.marathon}</span>
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
                      <span className="font-mono text-base">{pacesTable[vdotInput]?.e_mile || '--'}/m*le</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Mare-athon:</span>
                      <span className="font-mono text-base">{pacesTable[vdotInput]?.m_mile || '--'}/m*le</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Threshold:</span>
                      <span className="font-mono text-base">{pacesTable[vdotInput]?.t_mile || '--'}/m*le</span>
                    </div>
                    {parseInt(vdotInput) > 46 && (
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Interval:</span>
                          <div className="font-mono text-base">
                            {pacesTable[vdotInput]?.i_320m ? (
                              <span>{formatSecondsToTime(parseInt(pacesTable[vdotInput].i_320m))}</span>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right -mt-2.5">
                          <span className="font-mono text-xs italic text-gray-400">
                            {pacesTable[vdotInput]?.['i_400m'] ? 
                              `${pacesTable[vdotInput]['i_400m']}s/400m` : 
                              '--'}
                          </span>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Repetition:</span>
                        <div className="font-mono text-base">
                          {pacesTable[vdotInput]?.r_320m ? (
                            <span>{formatSecondsToTime(parseInt(pacesTable[vdotInput].r_320m))}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right -mt-2.5">
                        <span className="font-mono text-xs italic text-gray-400">
                          {pacesTable[vdotInput]?.['r_400m'] ? 
                            `${pacesTable[vdotInput]['r_400m']}s/400m` : 
                            '--'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowCard(false)}
                className="absolute top-1 right-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center px-2 sm:px-4 py-3 sm:py-2 border-b border-gray-200">
            <a href="/daisy_math" className="text-xs text-blue-600 hover:text-blue-800 italic">
              DAISY™ Maths Explained
            </a>
            <div className="absolute left-[79.3%] sm:left-1/2 transform -translate-x-1/2">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setViewMode('pace')}
                  className={`px-2 sm:px-4 py-1.5 sm:py-2 text-sm font-medium rounded-l-md ${
                    viewMode === 'pace'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Training Paces</span>
                  <span className="sm:hidden">Pace</span>
                </button>
                <button
                  onClick={() => setViewMode('race')}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 text-sm font-medium rounded-r-md ${
                    viewMode === 'race'
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <span className="hidden sm:inline">Race Times</span>
                  <span className="sm:hidden">Race</span>
                </button>
              </div>
            </div>
            <span className="hidden sm:inline-block px-3 py-1 bg-gray-900 text-white rounded-md text-sm font-medium">
              D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
            </span>
          </div>
          <div className="relative">
            {/* Main table container with forced top scrollbar */}
            <div className="table-container">
              {viewMode === 'pace' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="sticky left-0 bg-gray-50 pl-4 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10 w-10">
                        <input
                          type="text"
                          placeholder=""
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-10 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent text-sm"
                        />
                      </th>
                      {/* Repetition Paces Section */}
                      <th colSpan={3} className="px-6 py-2 text-center text-sm font-semibold text-gray-500 italic bg-red-50 border-l border-r border-red-100">
                        Repetition
                      </th>
                      {/* Interval Paces Section */}
                      <th colSpan={3} className="px-6 py-2 text-center text-sm font-semibold text-gray-500 italic bg-yellow-50 border-l border-r border-yellow-100">
                        Interval
                      </th>
                      {/* Threshold Paces Section */}
                      <th colSpan={3} className="px-6 py-2 text-center text-sm font-semibold text-gray-500 italic bg-green-50 border-l border-r border-green-100">
                        Threshold
                      </th>
                      {/* Easy Paces Section */}
                      <th colSpan={2} className="px-6 py-2 text-center text-sm font-semibold text-gray-500 italic bg-blue-50 border-l border-r border-blue-100">
                        Chill
                      </th>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <th className="sticky left-0 bg-white z-50 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 w-16">
                        VDOT
                      </th>
                      {/* Repetition Paces Columns */}
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50 border-l border-r border-red-100 fixed-width-column">
                        Wingito
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50 border-r border-red-100 fixed-width-column">
                        Wingo
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50 border-r border-red-100 fixed-width-column">
                        Twingo
                      </th>
                      {/* Interval Paces Columns */}
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50 border-l border-r border-yellow-100 fixed-width-column">
                        Wingo
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50 border-r border-yellow-100 fixed-width-column">
                        KM
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-yellow-50 border-r border-yellow-100 fixed-width-column">
                        1600m
                      </th>
                      {/* Threshold Paces Columns */}
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-l border-r border-green-100 fixed-width-column whitespace-nowrap">
                        Wingo
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-r border-green-100 fixed-width-column whitespace-nowrap">
                        KM
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-green-50 border-r border-green-100 fixed-width-column whitespace-nowrap">
                        1600m
                      </th>
                      {/* Easy Paces Columns */}
                      <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-l border-r border-blue-100 chill-column whitespace-nowrap">
                        M*LE
                      </th>
                      <th scope="col" className="px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50 border-r border-blue-100 chill-column whitespace-nowrap">
                        Mare-athon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVdots.map(vdot => (
                      <tr key={vdot} className="hover:bg-gray-50">
                        <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 z-10">
                          {vdot}
                        </td>
                        {/* Repetition Paces Data */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-red-50/30 border-l border-r border-red-100 text-center">
                          {pacesTable[vdot]?.['r_160m'] ? (
                            <span>{formatSecondsToTime(parseInt(pacesTable[vdot].r_160m))}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-red-50/30 border-r border-red-100 text-center">
                          {pacesTable[vdot]?.r_320m ? (
                            <span>{formatSecondsToTime(parseInt(pacesTable[vdot].r_320m))}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-red-50/30 border-r border-red-100 text-center">
                          {pacesTable[vdot]?.['r_640m'] ? (
                            <span>{formatMinutesToTime(parseInt(pacesTable[vdot].r_640m) / 60)}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        {/* Interval Paces Data */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-yellow-50/30 border-l border-r border-yellow-100 text-center">
                          {pacesTable[vdot]?.i_320m ? (
                            <span>{formatSecondsToTime(parseInt(pacesTable[vdot].i_320m))}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-yellow-50/30 border-r border-yellow-100 text-center">
                          {pacesTable[vdot]?.['i_mile'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-yellow-50/30 border-r border-yellow-100 text-center">
                          {pacesTable[vdot]?.['i_penta'] || '-'}
                        </td>
                        {/* Threshold Paces Data */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-green-50/30 border-l border-r border-green-100 text-center">
                          {pacesTable[vdot]?.t_320m ? (
                            <span>{formatSecondsToTime(parseInt(pacesTable[vdot].t_320m))}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-green-50/30 border-r border-green-100 text-center">
                          {pacesTable[vdot]?.['t_mile'] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 bg-green-50/30 border-r border-green-100 text-center">
                          {pacesTable[vdot]?.['t_penta'] || '-'}
                        </td>
                        {/* Easy Paces Data */}
                        <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-500 bg-blue-50/30 border-l border-r border-blue-100 text-center">
                          {pacesTable[vdot]?.['e_mile'] || '-'}
                        </td>
                        <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-500 bg-blue-50/30 border-r border-blue-100 text-center">
                          {pacesTable[vdot]?.['m_mile'] || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider z-10">VDOT</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PentaWingo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">5k</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">10k</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HM</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mare-athon</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(raceTimesTable)
                        .filter(vdot => !isNaN(Number(vdot)))
                        .sort((a, b) => Number(a) - Number(b))
                        .map(vdot => (
                          <tr key={vdot} className="hover:bg-gray-50">
                            <td className="sticky left-0 bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vdot}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMinutesToTime(raceTimesTable[vdot]['1.6'])}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMinutesToTime(raceTimesTable[vdot]['5'])}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMinutesToTime(raceTimesTable[vdot]['10'])}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMinutesToTime(raceTimesTable[vdot]['21.1'])}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatMinutesToTime(raceTimesTable[vdot]['42.2'])}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VDOTTimes; 