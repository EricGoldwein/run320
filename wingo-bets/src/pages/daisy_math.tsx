import React from 'react';

const DaisyMath: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 leading-tight py-1">
            <span className="text-gray-900">D</span>
            <span className="text-[#00bcd4] font-extrabold">AI</span>
            <span className="text-gray-900">SY™</span> Maths
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Core Units Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Units</h2>
            <div className="space-y-4">
              <div className="flex items-baseline">
                <span className="font-semibold text-gray-900 w-32">Wingo</span>
                <span className="text-gray-600">320m (duh)</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-semibold text-gray-900 w-32">Wingito</span>
                <span className="text-gray-600">160m (half Wingo, short reps)</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-semibold text-gray-900 w-32">Twingo</span>
                <span className="text-gray-600">640m (double Wingo)</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-semibold text-gray-900 w-32">PentaWingo</span>
                <span className="text-gray-600">1600m (5 x Wingo, NOT a m*le)</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-semibold text-gray-900 w-32">DecaWingo</span>
                <span className="text-gray-600">3200m (10×WINGO, not 2 m*les)</span>
              </div>
            </div>
          </section>

          {/* Workout Types Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Workout Types (Jack Daniels Terminology)</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Repetition (R pace)</h3>
                <p className="text-gray-600 mb-2">Fast, short reps to improve speed, mechanics & economy. Full recovery.</p>
                <p className="text-gray-600">Usually PentaWingo pace or faster. (e.g. Wingo, TWINGO, 400m reps)</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Interval (I pace)</h3>
                <p className="text-gray-600 mb-2">VO₂max work. Hard but controlled. 3–5 minute reps to build aerobic power.</p>
                <p className="text-gray-600">~5K race pace.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Threshold (T pace)</h3>
                <p className="text-gray-600 mb-2">Steady, comfortably hard. Lactate clearance & stamina work.</p>
                <p className="text-gray-600">~1-hour race pace.</p>
              </div>
            </div>
          </section>

          {/* WINGO Conversion Math Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">WINGO Conversion Math</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formula</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">400m → WINGO (320m)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">400 × 0.78</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Use for both I and R paces</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R 200m → Wingito (160m)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">200 × 0.78</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Slightly faster than linear. DAISY don't mess around.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">300m → WINGO (320m)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">300 × 1.0667</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Short rep scaling</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">600m → 640m (2×WINGO)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">600 × 1.0667</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Extended rep scaling</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mile → PentaWingo (1600m)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Mile × 0.9935</td>
                    <td className="px-6 py-4 text-sm text-gray-600">1600m is ~9m short of full mile</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">T & I pace fudge factor</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">× 0.9932</td>
                    <td className="px-6 py-4 text-sm text-gray-600">(distance = 0.99419637864); slight adjustment.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DaisyMath; 