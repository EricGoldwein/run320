import React, { useState, useEffect } from 'react';
import styles from './LaneConverter.module.css';

interface LaneConversion {
  lane: number;
  distance: number;
  deltaFromLane1: number;
  conversion_factor: number;
}

// WINGO Lane Lengths (320m) - +7.7m per lane from 400m spec
const WINGO_LANE_LENGTHS: { [key: number]: number } = {
  1: 320.0,
  2: 327.7,
  3: 335.3,
  4: 343.0,
  5: 350.7,
  6: 358.3
};

// 400m Lane Lengths - standard track specifications
const TRACK_LANE_LENGTHS: { [key: number]: number } = {
  1: 400.0,
  2: 407.7,
  3: 415.3,
  4: 423.0,
  5: 430.7,
  6: 438.3
};

const getLaneLengths = (distance: '320' | '400') => {
  return distance === '320' ? WINGO_LANE_LENGTHS : TRACK_LANE_LENGTHS;
};

const convertLaneTime = (
  originalTimeSec: number, 
  fromLane: number, 
  toLane: number, 
  distance: '320' | '400'
): number | null => {
  const laneLengths = getLaneLengths(distance);
  const fromLength = laneLengths[fromLane];
  const toLength = laneLengths[toLane];
  
  if (!fromLength || !toLength) return null;
  
  return (originalTimeSec * toLength) / fromLength;
};

const getLaneConversionTable = (distance: '320' | '400'): LaneConversion[] => {
  const laneLengths = getLaneLengths(distance);
  const baseDistance = distance === '320' ? 320.0 : 400.0;
  
  return Object.entries(laneLengths).map(([lane, length]) => ({
    lane: parseInt(lane),
    distance: length,
    deltaFromLane1: length - baseDistance,
    conversion_factor: length / baseDistance
  }));
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(1).padStart(4, '0')}s`;
};

const formatTimeForExplanation = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(1).padStart(4, '0')}`;
};

const parseTimeInput = (input: string): number | null => {
  // Handle MM:SS format
  if (input.includes(':')) {
    const parts = input.split(':');
    if (parts.length === 2) {
      const minutes = parseFloat(parts[0]);
      const seconds = parseFloat(parts[1]);
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return minutes * 60 + seconds;
      }
    }
  }
  
  // Handle seconds only
  const seconds = parseFloat(input);
  return isNaN(seconds) ? null : seconds;
};

const LaneConverter: React.FC = () => {
  const [originalTime, setOriginalTime] = useState<string>('');
  const [fromLane, setFromLane] = useState<number>(4);
  const [toLane, setToLane] = useState<number>(1);
  const [distance, setDistance] = useState<'320' | '400'>('320');
  const [convertedTime, setConvertedTime] = useState<string>('--');
  const [laneTable, setLaneTable] = useState<LaneConversion[]>([]);

  useEffect(() => {
    setLaneTable(getLaneConversionTable(distance));
  }, [distance]);

  useEffect(() => {
    if (!originalTime) {
      setConvertedTime('--');
      return;
    }

    const timeInSeconds = parseTimeInput(originalTime);
    if (timeInSeconds === null) {
      setConvertedTime('Invalid time');
      return;
    }

    const converted = convertLaneTime(timeInSeconds, fromLane, toLane, distance);
    if (converted === null) {
      setConvertedTime('Invalid lanes');
      return;
    }

    setConvertedTime(formatTimeForExplanation(converted));
  }, [originalTime, fromLane, toLane, distance]);

  return (
    <div className="container">
      <div className={styles['converter-container']}>
        <div className="text-center mb-4">
          <h1 className={styles['brand-heading']}>Stay in Yo Lane</h1>
          <p className={styles['subheading']}>
            Stuck in Lane 4 with no clue how fast you're moving? Find your Lane 1 {distance === '320' ? 'Wingo' : `${distance}m`} time with <strong>DAISY's</strong> <strong>SIYL System</strong>.
          </p>
          <p className="text-xs text-gray-500 mt-2 px-2 py-1 bg-gray-50 border border-gray-200 rounded inline-block">
            Brought to you by{' '}
            <a 
              href="https://wingo320.com/old-balance" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wingo-600 hover:text-wingo-700 underline"
            >
              Old Balance
            </a>
          </p>
        </div>

        {/* Distance Toggle */}
        <div className={styles['distance-toggle']}>
          <div className={styles['toggle-container']}>
            <button
              onClick={() => setDistance('320')}
              className={`${styles['toggle-button']} ${distance === '320' ? styles.active : ''}`}
            >
              Wingo (320m)
            </button>
            <button
              onClick={() => setDistance('400')}
              className={`${styles['toggle-button']} ${distance === '400' ? styles.active : ''}`}
            >
              Corporate (400m)
            </button>
          </div>
        </div>

        {/* Converter Form */}
        <div className={styles['input-section']}>
          {/* From/To Lanes Row */}
          <div className={styles['input-row']}>
            {/* From Lane */}
            <div className={styles['input-group']}>
              <label className={styles['form-label']}>From</label>
              <select
                value={fromLane}
                onChange={(e) => setFromLane(parseInt(e.target.value))}
                className={`${styles['form-control']} ${styles['form-control']}`}
              >
                {[1, 2, 3, 4, 5, 6].map(lane => (
                  <option key={lane} value={lane}>
                    Lane {lane}
                  </option>
                ))}
              </select>
              <div className={styles['lane-distance']}>
                {laneTable.find(l => l.lane === fromLane)?.distance.toFixed(1)}m
              </div>
            </div>

            {/* To Lane */}
            <div className={styles['input-group']}>
              <label className={styles['form-label']}>To</label>
              <select
                value={toLane}
                onChange={(e) => setToLane(parseInt(e.target.value))}
                className={`${styles['form-control']} ${styles['form-control']}`}
              >
                {[1, 2, 3, 4, 5, 6].map(lane => (
                  <option key={lane} value={lane}>
                    Lane {lane}
                  </option>
                ))}
              </select>
              <div className={styles['lane-distance']}>
                {laneTable.find(l => l.lane === toLane)?.distance.toFixed(1)}m
              </div>
            </div>
          </div>

          {/* Time Input/Output Row */}
          <div className={styles['input-row']}>
            {/* Original Time Input */}
            <div className={styles['input-group']}>
              <label className={`${styles['form-label']} ${styles['centered-label']}`}>Recorded Time</label>
              <input
                type="text"
                value={originalTime}
                onChange={(e) => setOriginalTime(e.target.value)}
                placeholder=""
                className={`${styles['form-control']} ${styles['original-time-input']}`}
              />
            </div>

            {/* Converted Time Display */}
            <div className={styles['input-group']}>
              <label className={`${styles['form-label']} ${styles['centered-label']}`}>Projected</label>
              <div className={`${styles['result-display']} ${styles['equivalent-time-display']}`}>
                {convertedTime}
              </div>
            </div>
          </div>

          {/* Conversion Explanation */}
          {originalTime && convertedTime !== '--' && convertedTime !== 'Invalid time' && convertedTime !== 'Invalid lanes' && (() => {
            const timeInSeconds = parseTimeInput(originalTime);
            const converted = convertLaneTime(timeInSeconds!, fromLane, toLane, distance);
            return (
              <div className={styles['conversion-explanation']}>
                Your <strong>{formatTimeForExplanation(timeInSeconds!)}</strong> Lane {fromLane} {distance === '320' ? 'Wingo' : '400m'} is equivalent to a <strong>{formatTimeForExplanation(converted!)}</strong> Lane {toLane} {distance === '320' ? 'Wingo' : '400m'}
                <div className={styles['conversion-emojis']}>
                  🐎🤖🪽8️⃣
                </div>
              </div>
            );
          })()}
        </div>

        {/* Lane Lengths Table */}
        <div className={styles['lane-table']}>
          <div className={styles['table-header']}>
            <h2 className={styles['table-title']}>
              {distance === '320' ? 'Wingo Lane Specifications' : `${distance}m Lane Specifications`}
            </h2>
          </div>
          <div className={styles['table-container']}>
            <table>
              <thead>
                <tr>
                  <th>Lane</th>
                  <th>Distance</th>
                  <th>Δ Lane 1</th>
                  <th>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {laneTable.map((lane) => (
                  <tr key={lane.lane}>
                    <td>{lane.lane}</td>
                    <td>{lane.distance.toFixed(1)}m</td>
                    <td>{lane.deltaFromLane1 > 0 ? '+' : ''}{lane.deltaFromLane1.toFixed(1)}m</td>
                    <td>{lane.conversion_factor.toFixed(3)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DAISY Footer with Run Hive Credit */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Powered by{' '}
            <span className={styles['daisy-badge']}>
              D<span className={styles['ai']}>AI</span>SY™
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Lane distance calculations courtesy of{' '}
            <a 
              href="https://runhive.com/tools/running-track-lane-distances" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-wingo-600 hover:text-wingo-700 underline"
            >
              Run Hive
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaneConverter; 