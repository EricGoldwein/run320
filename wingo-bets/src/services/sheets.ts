import Papa from 'papaparse';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?output=csv&gid=270601813';

export interface LogEntry {
  id: number;
  username: string;
  date: string;
  wingoMined: number;
  kmLogged: number;
  initiation: boolean;
}

export const fetchLogEntries = async (): Promise<LogEntry[]> => {
  try {
    const response = await fetch(SHEET_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          const entries = results.data.map((row: any) => ({
            id: parseInt(row.ID),
            username: row.Username,
            date: row.Date,
            wingoMined: parseInt(row['WINGO Mined']),
            kmLogged: parseFloat(row['Total KM for Activity']),
            initiation: row['Initiation?'] === 'Yes'
          }));
          resolve(entries);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching log entries:', error);
    throw error;
  }
}; 