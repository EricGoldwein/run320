import React from 'react';

const DaisyMath: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight py-1">
            <span className="text-gray-900">D</span>
            <span className="text-[#00bcd4] font-extrabold">AI</span>
            <span className="text-gray-900">SY™</span> Maths
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8">
          {/* Core Units Section */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Core Units</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-gray-900 sm:w-32 mb-1 sm:mb-0">Wingo</span>
                <span className="text-gray-600">320m (duh)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-gray-900 sm:w-32 mb-1 sm:mb-0">Wingito</span>
                <span className="text-gray-600">160m (half Wingo, short reps)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-gray-900 sm:w-32 mb-1 sm:mb-0">Twingo</span>
                <span className="text-gray-600">640m (double Wingo)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-gray-900 sm:w-32 mb-1 sm:mb-0">PentaWingo</span>
                <span className="text-gray-600">1600m (5 x Wingo, NOT a m*le)</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-semibold text-gray-900 sm:w-32 mb-1 sm:mb-0">DecaWingo</span>
                <span className="text-gray-600">3200m (10×Wingo, not 2 m*les)</span>
              </div>
            </div>
          </section>

          {/* Workout Types Section */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Workout Types (J. Daniels Terminology)</h2>
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Repetition (R pace)</h3>
                <p className="text-gray-600 mb-2">Fast, short reps to improve speed, mechanics & economy. Full recovery.</p>
                <p className="text-gray-600">Usually PentaWingo pace or faster. (e.g. Wingo, Twingo, 400m reps)</p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Interval (I pace)</h3>
                <p className="text-gray-600 mb-2">VO₂max work. Hard but controlled. 3–5 minute reps to build aerobic power.</p>
                <p className="text-gray-600">~5K race pace.</p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Threshold (T pace)</h3>
                <p className="text-gray-600 mb-2">Steady, comfortably hard. Lactate clearance & stamina work.</p>
                <p className="text-gray-600">~1-hour race pace.</p>
              </div>
            </div>
          </section>

          {/* WINGO Conversion Math Section */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">DAISY™ Math</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Conversion</th>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Formula</th>
                      <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">400m → Wingo (320m)</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">400 × 0.78</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">Use for both I and R paces</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">R 200m → Wingito (160m)</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">200 × 0.78</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">Slightly faster than linear. DAISY don't mess around.</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">300m → Wingo (320m)</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">300 × 1.0667</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">Short rep scaling</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">600m → 640m (2×Wingo)</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">600 × 1.0667</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">Extended rep scaling</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">Mile → PentaWingo (1600m)</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">Mile × 0.9942</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">1600m is ~9m short of full mile</td>
                    </tr>
                    <tr>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">T & I pace fudge factor</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">× 0.9932</td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-600">(distance = 0.99429637864); slight adjustment.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DaisyMath; 