// NOTE: This histogram + KDE is styled to mimic matplotlib/seaborn statistical plots in React.
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Legend, Area } from 'recharts';

/**
 * Wingonomics page: League-wide WINGO stats and charts
 * - Total WINGO balance by day (all categories)
 * - Total WINGO mined by day (category == 'Mining')
 * - Wingi coefficient (Lorenz curve)
 * - WINGOs per session: histogram + KDE styled like seaborn/matplotlib
 */

interface LogRow {
  date: string; // column C
  amount: number; // column D
  user: string; // column B
  category: string; // column K
}

const GOOGLE_SHEET_LOG_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTM_V9eYpvCBXC4rsa77WJeTGKaU4WF2KhwO-51jn99FWCAi2LlILTPkm_IN5UVvUXBajxAQmvDyVn4/pub?gid=270601813&single=true&output=csv';

// Helper to parse M/D/YY to ISO string
function parseMDYYtoISO(dateStr: string): string {
  // e.g. 5/28/25 or 12/31/25
  const [m, d, y] = dateStr.split('/');
  if (!m || !d || !y) return '';
  // Assume 20xx for 2-digit year
  const yyyy = y.length === 2 ? '20' + y.padStart(2, '0') : y;
  // Pad month and day
  const mm = m.padStart(2, '0');
  const dd = d.padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`; // No time component
}

const Wingonomics: React.FC = () => {
  const [log, setLog] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartHeight, setChartHeight] = useState(300);

  // Chart data
  const [balanceByDay, setBalanceByDay] = useState<any[]>([]);
  const [minedByDay, setMinedByDay] = useState<any[]>([]);
  const [lorenzData, setLorenzData] = useState<any[]>([]);
  const [wingiCoefficient, setWingiCoefficient] = useState<number | null>(null);
  const [histogramData, setHistogramData] = useState<{ bin: number; count: number; density: number; label: string }[]>([]);
  const [sessionStats, setSessionStats] = useState<{ mean: number; median: number; std: number }>({ mean: 0, median: 0, std: 0 });
  const [boxPlotData, setBoxPlotData] = useState<any[]>([]);
  const [kdeData, setKdeData] = useState<{ x: number; y: number }[]>([]);

  // Responsive chart height
  useEffect(() => {
    const updateHeight = () => {
      setChartHeight(window.innerWidth >= 768 ? 500 : 220);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    // Fetch and parse the Google Sheet log
    const fetchData = async () => {
      try {
        const response = await fetch(GOOGLE_SHEET_LOG_URL + `&t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch log from Google Sheets');
        const text = await response.text();
        const rows = text.trim().split('\n');
        const data = rows.slice(1); // skip header
        
        // Debug: log the first few raw rows
        console.log('First 3 raw CSV rows:', data.slice(0, 3));
        
        const parsed: LogRow[] = data
          .filter(row => row.trim() && row.split(',').length >= 13)
          .map((row) => {
            const columns = row.split(',');
            const rawDate = columns[2]?.trim() || '';
            const isoDate = rawDate ? parseMDYYtoISO(rawDate) : '';
            console.log('[WINGONOMICS DEBUG] Raw:', rawDate, '| ISO:', isoDate);
            return {
              user: columns[1]?.trim() || '', // column B
              date: isoDate, // column C, just the date
              amount: Number(columns[3]) || 0, // column D (WINGO +/-)
              category: columns[10]?.trim() || '', // column K
            };
          })
          .filter(entry => entry.user && entry.date);
        
        // Debug: log the first few parsed entries
        console.log('First 3 parsed entries:', parsed.slice(0, 3));
        
        setLog(parsed);
        setLoading(false);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute chart data when log is loaded
  useEffect(() => {
    if (!log.length) return;
    
    // Debug: log the first few entries to see the data format
    console.log('First 5 log entries:', log.slice(0, 5));
    
    // 1. Prepare cumulative data for both balance and mined by aggregating by date
    const sorted = [...log].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Group by date and sum amounts
    const dailyData: Record<string, { balance: number; mined: number; hasActivity: boolean }> = {};
    let runningTotal = 0;
    
    // First pass: collect all activity by date
    sorted.forEach(row => {
      // Use the date string directly - no Date object conversion
      const dateStr = row.date; // Already in YYYY-MM-DD format
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { balance: 0, mined: 0, hasActivity: false };
      }
      
      dailyData[dateStr].hasActivity = true;
      
      if (row.category === 'Mining') {
        dailyData[dateStr].mined += row.amount;
      }
    });
    
    // Second pass: calculate cumulative totals only for dates with activity
    const sortedDates = Object.keys(dailyData).sort();
    sortedDates.forEach(date => {
      if (dailyData[date].hasActivity) {
        // Sum all transactions up to this date
        const transactionsUpToDate = sorted.filter(row => {
          // Use date string comparison directly - no Date object conversion
          const rowDate = row.date; // Already in YYYY-MM-DD format
          return rowDate <= date;
        });
        runningTotal = transactionsUpToDate.reduce((sum, row) => sum + row.amount, 0);
        dailyData[date].balance = runningTotal;
      }
    });
    
    // Debug: log the daily data
    console.log('Daily data:', dailyData);
    
    // Convert to cumulative mined totals - only accumulate when there's actual mining activity
    let cumulativeMined = 0;
    sortedDates.forEach(date => {
      if (dailyData[date].mined > 0) {
        cumulativeMined += dailyData[date].mined;
      }
      dailyData[date].mined = cumulativeMined;
    });
    
    // Fill in gaps between dates - start from 5/26/25 as requested
    const startDateStr = '2025-05-26';
    const endDateStr = sortedDates[sortedDates.length - 1];
    const filledData: { date: string; balance: number; mined: number; timestamp: number }[] = [];
    
    let lastBalance = 0;
    let lastMined = 0;
    let firstActivityDate = null;
    
    // Find the first date with activity
    for (const date of sortedDates) {
      if (dailyData[date].hasActivity) {
        firstActivityDate = date;
        break;
      }
    }
    
    // Simple date incrementing without Date objects
    let currentDateStr = startDateStr;
    while (currentDateStr <= endDateStr) {
      if (dailyData[currentDateStr] && dailyData[currentDateStr].hasActivity) {
        lastBalance = dailyData[currentDateStr].balance;
        lastMined = dailyData[currentDateStr].mined;
      }
      
      // Create timestamp for chart (noon on the date)
      const timestamp = new Date(currentDateStr + 'T12:00:00').getTime();
      
      filledData.push({
        date: currentDateStr,
        balance: firstActivityDate && currentDateStr >= firstActivityDate ? lastBalance : 0,
        mined: firstActivityDate && currentDateStr >= firstActivityDate ? lastMined : 0,
        timestamp: timestamp
      });
      
      // Debug logging for 7/17 and 7/18
      if (currentDateStr === '2025-07-17' || currentDateStr === '2025-07-18') {
        console.log(`Date: ${currentDateStr}, Timestamp: ${timestamp}, Balance: ${firstActivityDate && currentDateStr >= firstActivityDate ? lastBalance : 0}, Mined: ${firstActivityDate && currentDateStr >= firstActivityDate ? lastMined : 0}`);
      }
      
      // Increment date string
      const [year, month, day] = currentDateStr.split('-').map(Number);
      const nextDate = new Date(year, month - 1, day + 1);
      currentDateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    }
    
    // Debug: log the final data
    console.log('Final filled data:', filledData.slice(0, 5));
    console.log('Last few filled data entries:', filledData.slice(-5));
    
    setBalanceByDay(filledData);

    // 2. Lorenz curve (Wingi coefficient)
    // Compute user balances
    const userBalances: Record<string, number> = {};
    sorted.forEach(row => {
      if (!userBalances[row.user]) userBalances[row.user] = 0;
      userBalances[row.user] += row.amount;
    });
    const balances = Object.values(userBalances).sort((a, b) => a - b);
    const nBalances = balances.length;
    let cumSum = 0;
    const lorenz: { pctUsers: number; pctWingo: number }[] = [];
    const total = balances.reduce((a, b) => a + b, 0);
    
    // Add starting point (0,0) to ensure lines touch bottom-left corner
    lorenz.push({ pctUsers: 0, pctWingo: 0 });
    
    balances.forEach((bal, i) => {
      cumSum += bal;
      lorenz.push({
        pctUsers: (i + 1) / nBalances,
        pctWingo: total ? cumSum / total : 0
      });
    });
    
    // Add the 45-degree equality line with (0,0) starting point
    const equalityLine = Array.from({ length: lorenz.length }, (_, i) => ({
      pctUsers: lorenz[i].pctUsers,
      equality: lorenz[i].pctUsers
    }));
    
    // Merge equality line into lorenzData for charting
    const lorenzWithEquality = lorenz.map((point, i) => ({ 
      ...point, 
      equality: equalityLine[i].equality
    }));
    setLorenzData(lorenzWithEquality);
    
    // Wingi coefficient = 1 - 2 * area under Lorenz curve
    let area = 0;
    for (let i = 1; i < lorenz.length; i++) {
      area += (lorenz[i].pctUsers - lorenz[i - 1].pctUsers) * (lorenz[i].pctWingo + lorenz[i - 1].pctWingo) / 2;
    }
    setWingiCoefficient(1 - 2 * area);

    // 3. WINGOs per session (distribution for Mining sessions, grouped bins for histogram look)
    const miningSessions = sorted.filter(row => row.category === 'Mining').map(row => row.amount);
    const nSessions = miningSessions.length;
    const mean = nSessions ? miningSessions.reduce((a, b) => a + b, 0) / nSessions : 0;
    const sortedSessions = [...miningSessions].sort((a, b) => a - b);
    const median = nSessions ? (nSessions % 2 === 1 ? sortedSessions[Math.floor(nSessions / 2)] : (sortedSessions[nSessions / 2 - 1] + sortedSessions[nSessions / 2]) / 2) : 0;
    const std = nSessions ? Math.sqrt(miningSessions.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / nSessions) : 0;
    setSessionStats({ mean, median, std });

    // --- Histogram bins (width=4) and KDE density for ComposedChart ---
    const binWidth = 4;
    const minVal = Math.max(1, Math.floor(Math.min(...miningSessions, 1))); // Start from 1, not 0
    const maxVal = Math.ceil(Math.max(...miningSessions, 1));
    const bins: { bin: number; count: number; density: number; label: string }[] = [];
    // 1. Histogram binning
    for (let start = minVal; start <= maxVal; start += binWidth) {
      const end = start + binWidth - 1;
      const count = miningSessions.filter(v => v >= start && v <= end).length;
      const label = end === Infinity ? `${start}+` : `${start}-${end}`;
      bins.push({ bin: start + binWidth / 2, count, density: 0, label });
    }
    // 2. KDE density estimation at bin centers
    if (miningSessions.length > 0) {
      const bandwidth = Math.max(0.8, (maxVal - minVal) / 20);
      function kernel(u: number) {
        return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
      }
      bins.forEach((b, i) => {
        const x = b.bin;
        const sum = miningSessions.reduce((acc, xi) => acc + kernel((x - xi) / bandwidth), 0);
        bins[i].density = sum / (miningSessions.length * bandwidth);
      });
    }
    setHistogramData(bins);

    // --- KDE Curve Calculation ---
    // 1. Get mining session values
    const miningSessionsKde = sorted.filter(row => row.category === 'Mining').map(row => row.amount);
    if (miningSessionsKde.length > 0) {
      // 2. KDE parameters
      const minX = Math.min(...miningSessionsKde);
      const maxX = Math.max(...miningSessionsKde);
      const bandwidth = Math.max(0.8, (maxX - minX) / 20); // Silverman's rule of thumb, but capped
      const steps = 60;
      const xs: number[] = [];
      for (let i = 0; i <= steps; i++) {
        xs.push(minX + (maxX - minX) * (i / steps));
      }
      // 3. Gaussian kernel
      function kernel(u: number) {
        return Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
      }
      // 4. KDE estimation
      const kde: { x: number; y: number }[] = xs.map(x => {
        const sum = miningSessionsKde.reduce((acc, xi) => acc + kernel((x - xi) / bandwidth), 0);
        return { x, y: sum / (miningSessionsKde.length * bandwidth) };
      });
      setKdeData(kde);
    } else {
      setKdeData([]);
    }
  }, [log]);

  if (loading) return <div>Loading Wingonomics data...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-wingo-600">Wingonomics</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2">World Wide WINGO</h2>
        <div className="relative">
          <div className="absolute top-12 left-16 md:left-20 z-10">
            <div className="inline-flex flex-col md:flex-row items-start md:items-center max-w-fit px-2 py-0.5 bg-white/95 border border-gray-300 shadow-md rounded-md text-xs gap-1 md:gap-3 backdrop-blur-sm">
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">W Circulating:</span>
                <span className="font-semibold text-gray-900">{balanceByDay.length > 0 ? balanceByDay[balanceByDay.length - 1].balance.toLocaleString() : '0'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">W Mined:</span>
                <span className="font-semibold text-gray-900">{balanceByDay.length > 0 ? balanceByDay[balanceByDay.length - 1].mined.toLocaleString() : '0'}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Leader:</span>
                <span className="font-semibold text-gray-900">
                  {(() => {
                    const userBalances: Record<string, number> = {};
                    log.forEach(row => {
                      if (!userBalances[row.user]) userBalances[row.user] = 0;
                      userBalances[row.user] += row.amount;
                    });
                    const sortedUsers = Object.entries(userBalances).sort(([,a], [,b]) => b - a);
                    return sortedUsers.length > 0 ? sortedUsers[0][0] : 'N/A';
                  })()}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-[600px] [&_*]:focus:outline-none [&_*]:focus:ring-0 [&_*]:select-none [&_svg]:focus:outline-none [&_svg]:focus:ring-0" style={{ userSelect: 'none' }}>
            <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
              <LineChart data={balanceByDay} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} style={{ outline: 'none', userSelect: 'none' }}>
                <CartesianGrid strokeDasharray="3 3" />
                {/* X-axis: use timestamps for proper time scaling */}
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={timestamp => {
                    const d = new Date(timestamp);
                    return `${d.getMonth() + 1}/${d.getDate()}`;
                  }}
                  minTickGap={3}
                  tick={{ fontSize: 10 }}
                  className="md:minTickGap-10 md:tick-fontSize-12"
                  ticks={(() => {
                    // Generate ticks every 7 days starting from 5/28/2025
                    const startDate = new Date('2025-05-28T12:00:00').getTime();
                    
                    // Find the most recent WINGO logging date
                    const lastWingoDateStr = balanceByDay.length > 0 ? 
                      balanceByDay[balanceByDay.length - 1].date : 
                      '2025-05-28';
                    
                    // Find the most recent Wednesday (or the last WINGO date if it's a Wednesday)
                    const lastWingoDate = new Date(lastWingoDateStr + 'T12:00:00');
                    const lastWingoDay = lastWingoDate.getDay(); // 0=Sunday, 3=Wednesday
                    let lastTickDate;
                    if (lastWingoDay === 3) { // If last WINGO was on a Wednesday
                      lastTickDate = lastWingoDate.getTime();
                    } else {
                      // Find the most recent Wednesday before or on the last WINGO date
                      const daysSinceWednesday = (lastWingoDay + 4) % 7; // Days since last Wednesday
                      lastTickDate = lastWingoDate.getTime() - (daysSinceWednesday * 24 * 60 * 60 * 1000);
                    }
                    
                    const ticks = [];
                    let currentDate = startDate;
                    while (currentDate <= lastTickDate) {
                      ticks.push(currentDate);
                      currentDate += 7 * 24 * 60 * 60 * 1000; // Add 7 days in milliseconds
                    }
                    console.log('Generated ticks:', ticks.map(t => new Date(t).toLocaleDateString()));
                    return ticks;
                  })()}
                />
                <YAxis 
                  label={{ value: 'WINGO', angle: -90, position: 'insideLeft', offset: 10 }} 
                  tick={{ fontSize: 10 }}
                  className="md:tick-fontSize-12"
                />
                <Tooltip labelFormatter={timestamp => {
                  const d = new Date(timestamp as number);
                  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
                }} contentStyle={{ lineHeight: '1.0' }} />
                <Legend wrapperStyle={{ lineHeight: '1.2' }} />
                <Line type="monotone" dataKey="balance" name="Circulating" stroke="#E6C200" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="mined" name="Mined" stroke="#00bcd4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="relative">
            <div className="absolute bottom-2 right-6 bg-gray-900 text-white rounded-md px-2 py-0 text-sm font-medium">
              D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2">WINGO Distribution</h2>
        <div className="relative">
          <div className="absolute top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-600 z-10 md:left-[-60px] left-[-60px]" style={{ top: '50%' }}>WINGO Holdings</div>
          <ResponsiveContainer width="100%" height={400} className="md:h-[400px] h-[150px]" style={{ outline: 'none' }}>
            <LineChart data={lorenzData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              {/* X and Y axes: start at 0, custom labels, more padding */}
              <XAxis 
                dataKey="pctUsers" 
                domain={[0, 1]} 
                type="number" 
                tickFormatter={(v: number) => `${Math.round(v * 100)}%`} 
                tick={{ fontSize: 8 }}
                className="md:tick-fontSize-10"
              />
              <YAxis 
                domain={[0, 1]} 
                tickFormatter={(v: number) => v === 0 ? '' : `${Math.round(v * 100)}%`} 
                tick={{ fontSize: 8 }}
                className="md:tick-fontSize-10"
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  // Skip the first observation (0,0 point)
                  if (props.payload && props.payload.pctUsers === 0 && props.payload.pctWingo === 0) {
                    return null;
                  }
                  if (name === 'Lorenz Curve') {
                    return [`${Math.round(Number(value) * 100)}%`, 'WINGO Equality'];
                  }
                  if (name === 'Equality Line') {
                    return [`${Math.round(Number(value) * 100)}%`, 'Perfect Equality'];
                  }
                  return null; // Hide Area components from tooltip
                }}
                labelFormatter={() => ''}
                contentStyle={{ lineHeight: '1.2' }}
              />
              {/* Shade the area between equality line and Lorenz curve */}
              <Area 
                type="monotone" 
                dataKey="equality" 
                stroke="none" 
                fill="#E6C200" 
                fillOpacity={0.15}
                name=""
              />
              <Area 
                type="monotone" 
                dataKey="pctWingo" 
                stroke="none" 
                fill="#E6C200" 
                fillOpacity={0.05}
                name=""
              />
              <Line type="monotone" dataKey="pctWingo" stroke="#E6C200" strokeWidth={2} dot={false} name="Lorenz Curve" />
              <Line type="monotone" dataKey="equality" stroke="#888" strokeWidth={2} dot={false} name="Equality Line" />
            </LineChart>
          </ResponsiveContainer>
          {/* Add text annotation for Wingi Index in a shaded box - positioned within chart */}
          <div className="absolute top-16 bg-yellow-500 bg-opacity-90 rounded p-3 text-white md:left-40 md:text-base left-20 text-sm">
            <div className="font-bold">
              Wingi Index: {wingiCoefficient !== null ? wingiCoefficient.toFixed(2) : 'N/A'}
            </div>
            <div className="text-xs">
              {wingiCoefficient !== null ? 
                (wingiCoefficient <= 0.10 ? 'Perfectly Even' :
                 wingiCoefficient <= 0.25 ? 'Mostly Balanced' :
                 wingiCoefficient <= 0.40 ? 'Moderate Imbalance' :
                 wingiCoefficient <= 0.60 ? 'Significant Inequality' :
                 wingiCoefficient <= 0.80 ? 'Severe Disparity' :
                 'WINGO Monarchy') : 'N/A'}
            </div>
          </div>
          <div className="text-center -mt-2 text-gray-600 ml-4">% 320 Population</div>
        </div>
        <div className="relative">
          <div className="absolute bottom-2 right-6 bg-gray-900 text-white rounded-md px-2 py-0 text-sm font-medium">
            D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2">WINGO Rate</h2>
        <div className="relative">
          <div className="absolute top-12 left-16 md:left-20 z-10">
            <div className="inline-flex flex-col md:flex-row items-start md:items-center max-w-fit px-2 py-0.5 bg-white/90 border border-gray-200 shadow-sm rounded text-xs gap-1 md:gap-3">
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Mean:</span>
                <span className="font-semibold text-gray-900">{sessionStats.mean.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">(σ = {sessionStats.std.toFixed(1)})</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">Median:</span>
                <span className="font-semibold text-gray-900">{sessionStats.median.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300} style={{ outline: 'none' }}>
            {/* ComposedChart: histogram bars touch, KDE curve overlays */}
            <ComposedChart data={histogramData} margin={{ top: 30, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid stroke="#e5e5e5" strokeDasharray="3 3" />
              {/* X-axis: show all bins, label bins as '1-4', '5-8', ... */}
              <XAxis
                dataKey="bin"
                tick={{ fontSize: 10 }}
                type="category"
                domain={['dataMin', 'dataMax']}
                allowDecimals={false}
                tickFormatter={(_bin, idx) => histogramData[idx]?.label || _bin}
                className="md:tick-fontSize-14"
              />
              <YAxis 
                yAxisId="left" 
                allowDecimals={false} 
                label={{ value: 'Sessions', angle: -90, position: 'insideLeft', offset: 10, dy: 20 }} 
                tick={{ fontSize: 10 }}
                className="md:tick-fontSize-14"
              />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'KDE Curve') {
                    return [Number(value).toFixed(2), name];
                  }
                  if (name === 'Sessions') {
                    return [value, name];
                  }
                  return [value, name];
                }}
                labelFormatter={(value) => {
                  // Find the bin that contains this value
                  const bin = histogramData.find(b => b.bin === value);
                  return bin ? bin.label + ' W' : value;
                }}
                contentStyle={{ lineHeight: '1.0' }}
              />
              <Bar yAxisId="left" dataKey="count" fill="#4F8EF7" fillOpacity={0.85} name="Sessions" barSize={100} />
              <Line yAxisId="right" type="monotone" dataKey="density" stroke="#ff7300" strokeWidth={3} dot={false} name="KDE Curve" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center -mt-2 text-gray-600">Number of WINGO Mined</div>
        <div className="relative">
          <div className="absolute bottom-2 right-6 bg-gray-900 text-white rounded-md px-2 py-0 text-sm font-medium">
            D<span className="!text-[#00bcd4] font-semibold">AI</span>SY™
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wingonomics;