import React from 'react';
import styles from './VdotRaceTimes.module.css';

interface VdotRaceTime {
  vdot: number;
  '1.5': number;
  '1.6093': number;
  '3': number;
  '3.2187': number;
  '5': number;
  '10': number;
  '15': number;
  '21.0975': number;
  '42.195': number;
}

const VdotRaceTimes: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [raceData, setRaceData] = React.useState<VdotRaceTime[]>([]);

  React.useEffect(() => {
    fetch('/vdot_full_race_times.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // Skip header
        const parsedData = rows.map(row => {
          const [vdot, d1_5, d1_6093, d3, d3_2187, d5, d10, d15, d21_0975, d42_195] = row.split(',');
          return {
            vdot: parseInt(vdot),
            '1.5': parseFloat(d1_5),
            '1.6093': parseFloat(d1_6093),
            '3': parseFloat(d3),
            '3.2187': parseFloat(d3_2187),
            '5': parseFloat(d5),
            '10': parseFloat(d10),
            '15': parseFloat(d15),
            '21.0975': parseFloat(d21_0975),
            '42.195': parseFloat(d42_195)
          };
        });
        setRaceData(parsedData);
      });
  }, []);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredData = raceData.filter(row => 
    row.vdot.toString().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>VDOT Race Times</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search VDOT..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>VDOT</th>
              <th>1.5 km</th>
              <th>1 m*le</th>
              <th>3 km</th>
              <th>2 m*les</th>
              <th>5 km</th>
              <th>10 km</th>
              <th>15 km</th>
              <th>Half Mare-athon</th>
              <th>Mare-athon</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.vdot}>
                <td>{row.vdot}</td>
                <td>{formatTime(row['1.5'])}</td>
                <td>{formatTime(row['1.6093'])}</td>
                <td>{formatTime(row['3'])}</td>
                <td>{formatTime(row['3.2187'])}</td>
                <td>{formatTime(row['5'])}</td>
                <td>{formatTime(row['10'])}</td>
                <td>{formatTime(row['15'])}</td>
                <td>{formatTime(row['21.0975'])}</td>
                <td>{formatTime(row['42.195'])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VdotRaceTimes; 