import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WingoConverter.module.css';
import { User } from '../types';

interface WingoConverterProps {
  user?: User | null;
}

const WingoConverter: React.FC<WingoConverterProps> = ({ user }) => {
  const [targetDistance, setTargetDistance] = useState<string>('');
  const [targetDays, setTargetDays] = useState<string>('');
  const [targetHours, setTargetHours] = useState<string>('');
  const [targetMinutes, setTargetMinutes] = useState<string>('');
  const [targetSeconds, setTargetSeconds] = useState<string>('');
  const [wingoTime, setWingoTime] = useState<string>('--');
  const [selectedDistance, setSelectedDistance] = useState<string>('--');
  const [projections, setProjections] = useState({
    furlong: '--',
    '400m': '--',
    '800m': '--',
    km: '--',
    mile: '--',
    '5k': '--',
    loop: '--',
    '10k': '--',
    '15k': '--',
    hm: '--',
    marathon: '--',
    yellowstone: '--'
  });

  const validateTimeInput = (value: string): boolean => {
    if (value === '') return true;
    if (!/^[0-9.]+$/.test(value)) {
      alert('Time values can only contain numbers and decimal points');
      return false;
    }
    if ((value.match(/\./g) || []).length > 1) {
      alert('Time values can only have one decimal point');
      return false;
    }
    return true;
  };

  const updateTimeInputs = () => {
    const distance = parseFloat(targetDistance);
    if (distance === 644000) {
      // Yellowstone case - default to 4 days
      setTargetDays('4');
      setTargetHours('');
      setTargetMinutes('');
      setTargetSeconds('');
    } else if (distance > 10000) {
      // Show hours for longer distances
      setTargetDays('');
      setTargetHours('');
      setTargetMinutes('');
      setTargetSeconds('');
    } else {
      // Standard case
      setTargetDays('');
      setTargetHours('');
      setTargetMinutes('');
      setTargetSeconds('');
    }
  };

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    
    let timeString = '';
    if (days > 0) {
      timeString += `${days}d ${hours}h ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else if (hours > 0) {
      timeString += `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      timeString += `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return timeString;
  };

  const convertFromTarget = () => {
    if (!targetDistance) {
      alert('Please select a distance');
      return;
    }

    const distance = parseFloat(targetDistance);
    const days = parseFloat(targetDays) || 0;
    const hours = parseFloat(targetHours) || 0;
    const minutes = parseFloat(targetMinutes) || 0;
    const seconds = parseFloat(targetSeconds) || 0;

    const totalSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;
    const pacePerMeter = totalSeconds / distance;

    // Calculate all projections
    const newProjections = {
      furlong: formatTime(pacePerMeter * 201.168),
      '400m': formatTime(pacePerMeter * 400),
      '800m': formatTime(pacePerMeter * 800),
      km: formatTime(pacePerMeter * 1000),
      mile: formatTime(pacePerMeter * 1609.34),
      '5k': formatTime(pacePerMeter * 5000),
      loop: formatTime(pacePerMeter * 5407),
      '10k': formatTime(pacePerMeter * 10000),
      '15k': formatTime(pacePerMeter * 15000),
      hm: formatTime(pacePerMeter * 21097.5),
      marathon: formatTime(pacePerMeter * 42195),
      yellowstone: formatTime(pacePerMeter * 644000)
    };

    setProjections(newProjections);
    setWingoTime(`${(pacePerMeter * 320).toFixed(1)}s`);
    setSelectedDistance(`${formatTime(totalSeconds)} per ${targetDistance === '21097.5' ? 'HM' : targetDistance === '42195' ? 'Marathon' : targetDistance}`);
  };

  const resetConverter = () => {
    setTargetDistance('');
    setTargetDays('');
    setTargetHours('');
    setTargetMinutes('');
    setTargetSeconds('');
    setWingoTime('--');
    setSelectedDistance('--');
    setProjections({
      furlong: '--',
      '400m': '--',
      '800m': '--',
      km: '--',
      mile: '--',
      '5k': '--',
      loop: '--',
      '10k': '--',
      '15k': '--',
      hm: '--',
      marathon: '--',
      yellowstone: '--'
    });
  };

  useEffect(() => {
    updateTimeInputs();
  }, [targetDistance]);

  return (
    <div className="container">
      <div className={styles['converter-container']}>
        <div className="text-center mb-4">
          <h1 className={styles['brand-heading']}>Wingo Pace Converter</h1>
          <p className={styles['subheading']}>From Wingos to Mare-athons, DAISY™ does the math</p>
        </div>

        <div className={styles['input-section']}>
          <div className={styles['input-row']}>
            <div className={styles['input-group']}>
              <label className={styles['form-label']}>Distance</label>
                <select 
                  className={styles['form-control']} 
                  value={targetDistance}
                  onChange={(e) => setTargetDistance(e.target.value)}
                >
                  <option value="" disabled>---</option>
                  <option value="201.168">Furlong</option>
                  <option value="320">Wingo (320m)</option>
                  <option value="400">400m</option>
                  <option value="800">800m</option>
                  <option value="1000">Kilometer</option>
                  <option value="1600">Fingo (1600m)</option>
                  <option value="1609.34">M*le</option>
                  <option value="5000">5K</option>
                  <option value="10000">10K</option>
                  <option value="21097.5">Half Mare-athon</option>
                  <option value="42195">Mare-athon</option>
                  <option value="644000">Yellowstone (3,200 Furlongs)</option>
                </select>
              </div>
            <div className={styles['input-group']}>
              <label className={styles['form-label']}>Time</label>
                <div className={styles['time-input']}>
                  {parseFloat(targetDistance) === 644000 && (
                    <>
                      <div className={styles['time-input-group']}>
                        <input
                          type="number"
                          className={styles['form-control']}
                          value={targetDays}
                          onChange={(e) => validateTimeInput(e.target.value) && setTargetDays(e.target.value)}
                          placeholder="D"
                        />
                      </div>
                      <div className={styles['time-input-group']}>
                        <input
                          type="number"
                          className={styles['form-control']}
                          value={targetHours}
                          onChange={(e) => validateTimeInput(e.target.value) && setTargetHours(e.target.value)}
                          placeholder="H"
                        />
                      </div>
                      <div className={styles['time-input-group']}>
                        <input
                          type="number"
                          className={styles['form-control']}
                          value={targetMinutes}
                          onChange={(e) => validateTimeInput(e.target.value) && setTargetMinutes(e.target.value)}
                          placeholder="M"
                        />
                      </div>
                      <span>:</span>
                      <div className={styles['time-input-group']}>
                        <input
                          type="number"
                          className={styles['form-control']}
                          value={targetSeconds}
                          onChange={(e) => validateTimeInput(e.target.value) && setTargetSeconds(e.target.value)}
                          placeholder="S"
                        />
                      </div>
                    </>
                  )}
                  {parseFloat(targetDistance) > 10000 && parseFloat(targetDistance) !== 644000 && (
                    <div className={styles['time-input-group']}>
                      <input
                        type="number"
                        className={styles['form-control']}
                        value={targetHours}
                        onChange={(e) => validateTimeInput(e.target.value) && setTargetHours(e.target.value)}
                        placeholder="H"
                      />
                    </div>
                  )}
                  {parseFloat(targetDistance) !== 644000 && (
                    <>
                      <div className={styles['time-input-group']}>
                        <input
                          type="number"
                          className={styles['form-control']}
                          value={targetMinutes}
                          onChange={(e) => validateTimeInput(e.target.value) && setTargetMinutes(e.target.value)}
                          placeholder="M"
                        />
                      </div>
                      <span>:</span>
                      <div className={styles['time-input-group']}>
                        <input
                          type="number"
                          className={styles['form-control']}
                          value={targetSeconds}
                          onChange={(e) => validateTimeInput(e.target.value) && setTargetSeconds(e.target.value)}
                          placeholder="S"
                        />
                      </div>
                    </>
                  )}
                </div>
            </div>
          </div>
          <div className="text-center">
            <div className={styles['button-group']}>
              <button className={styles['btn-convert']} onClick={convertFromTarget}>
                Calculate
              </button>
              <button className={styles['btn-reset']} onClick={resetConverter}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className={styles['pace-display']}>
          Wingo (320m) Pace: <span>{wingoTime}</span>
        </div>

        <div className={styles['result-section']}>
          <div className={`${styles['result-card']} ${styles['projections-card']}`}>
            <div className={styles['projections-content']}>
              <div className={styles['projections-header']}>
                <div className={styles['header-content']}>
                  <div className={styles['header-line-1']}>
                    {user ? `${user.username}'s Pace` : 'Your Pace'}
                  </div>
                  <div className={styles['header-line-2']}>
                    at <span>{selectedDistance}</span>
                  </div>
                </div>
                <span className={styles['daisy-badge']}>D<span className={styles['ai']}>AI</span>SY™</span>
              </div>
              <ul className={styles['projections-list']}>
                <li><span className={styles['distance']}>Furlong</span><span className={styles['time']}>{projections.furlong}</span></li>
                <li><span className={styles['distance']}>400m</span><span className={styles['time']}>{projections['400m']}</span></li>
                <li><span className={styles['distance']}>800m</span><span className={styles['time']}>{projections['800m']}</span></li>
                <li><span className={styles['distance']}>1000m</span><span className={styles['time']}>{projections.km}</span></li>
                <li><span className={styles['distance']}>M*le</span><span className={styles['time']}>{projections.mile}</span></li>
                <li><span className={styles['distance']}>5K</span><span className={styles['time']}>{projections['5k']}</span></li>
                <li><span className={styles['distance']}>The Loop</span><span className={styles['time']}>{projections.loop}</span></li>
                <li><span className={styles['distance']}>10K</span><span className={styles['time']}>{projections['10k']}</span></li>
                <li><span className={styles['distance']}>15K</span><span className={styles['time']}>{projections['15k']}</span></li>
                <li><span className={styles['distance']}>Half Mare-athon</span><span className={styles['time']}>{projections.hm}</span></li>
                <li><span className={styles['distance']}>Mare-athon</span><span className={styles['time']}>{projections.marathon}</span></li>
                <li><span className={styles['distance']}>Yellowstone</span><span className={styles['time']}>{projections.yellowstone}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingoConverter; 