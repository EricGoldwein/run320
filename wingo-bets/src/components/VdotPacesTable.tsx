import React from 'react';
import styles from './VdotPacesTable.module.css';

interface VdotPace {
  vdot: number;
  e_km: string;
  e_mile: string;
  m_km: string;
  m_mile: string;
  t_400m: string;
  t_km: string;
  t_mile: string;
  i_400m: string;
  i_km: string;
  i_1200m: string;
  i_mile: string;
  r_200m: string;
  r_300m: string;
  r_400m: string;
  r_600m: string;
  r_800m: string;
}

const VdotPacesTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [vdotData, setVdotData] = React.useState<VdotPace[]>([]);

  React.useEffect(() => {
    fetch('/vdot_paces.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // Skip header
        const parsedData = rows.map(row => {
          const [vdot, e_km, e_mile, m_km, m_mile, t_400m, t_km, t_mile, i_400m, i_km, i_1200m, i_mile, r_200m, r_300m, r_400m, r_600m, r_800m] = row.split(',');
          return {
            vdot: parseInt(vdot),
            e_km,
            e_mile,
            m_km,
            m_mile,
            t_400m,
            t_km,
            t_mile,
            i_400m,
            i_km,
            i_1200m,
            i_mile,
            r_200m,
            r_300m,
            r_400m,
            r_600m,
            r_800m
          };
        });
        setVdotData(parsedData);
      });
  }, []);

  const filteredData = vdotData.filter(row => 
    row.vdot.toString().includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>VDOT Training Paces</h1>
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
              <th>Easy (km)</th>
              <th>Easy (mile)</th>
              <th>Marathon (km)</th>
              <th>Marathon (mile)</th>
              <th>Threshold 400m</th>
              <th>Threshold km</th>
              <th>Threshold mile</th>
              <th>Interval 400m</th>
              <th>Interval km</th>
              <th>Interval 1200m</th>
              <th>Interval mile</th>
              <th>Rep 200m</th>
              <th>Rep 300m</th>
              <th>Rep 400m</th>
              <th>Rep 600m</th>
              <th>Rep 800m</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.vdot}>
                <td>{row.vdot}</td>
                <td>{row.e_km}</td>
                <td>{row.e_mile}</td>
                <td>{row.m_km}</td>
                <td>{row.m_mile}</td>
                <td>{row.t_400m}</td>
                <td>{row.t_km}</td>
                <td>{row.t_mile}</td>
                <td>{row.i_400m}</td>
                <td>{row.i_km}</td>
                <td>{row.i_1200m}</td>
                <td>{row.i_mile}</td>
                <td>{row.r_200m}</td>
                <td>{row.r_300m}</td>
                <td>{row.r_400m}</td>
                <td>{row.r_600m}</td>
                <td>{row.r_800m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VdotPacesTable; 