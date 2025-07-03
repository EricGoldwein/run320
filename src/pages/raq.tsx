import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from "../hooks/usePageTitle";

const FAQ: React.FC = () => {
  usePageTitle("WTF is WINGO? Rarely Asked Questions");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center text-gray-900">
          Rarely Asked Questions
        </h1>
        
        <div className="space-y-12">
          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What is{' '}
              <span className="text-[#E6C200] font-bold">W</span>INGO?
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-bold">W</span>INGO (Workout Independence Network Gains and Optimization) is the official token of the 320 Track Club. It's earned by completing the <a href="https://www.strava.com/segments/39307521" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-500">320-meter lap at Wingate Track</a> in Brooklyn.
              </p>
              <p className="text-lg">
                Each Wingo (320m) = 1{' '}
                <span className="text-[#E6C200] font-bold">W</span>.
              </p>
              <p className="text-lg">
                No fees. No purchases. No membership tier systems. Just a loop, a dream, and a priceless, valueless token.
              </p>
              <p className="text-lg">
                This isn't crypto.
              </p>
              <p className="text-lg">
                This isn't Web3.
              </p>
              <p className="text-lg">
                <b>This is Web320.</b>
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What can you do with{' '}
              <span className="text-[#E6C200] font-bold">W</span>INGO?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <span className="font-bold">W</span>INGO is your key to the 320 Track Club.{' '}
                <a href="/register" className="text-wingo-600 hover:text-wingo-500 font-medium">
                  Membership (1{' '}
                  <span className="text-[#E6C200] font-bold">W</span>)
                </a> perks include:
              </p>
              <ul className="list-none space-y-3">
                {[
                  <span dangerouslySetInnerHTML={{ __html: 'Placement in the <a href="/ledger" class="text-wingo-600 hover:text-wingo-500"><span class="font-bold">W</span>INGO Ledger</a> — updated live(ish) by Coach DAISY™' }} />,
                  <span dangerouslySetInnerHTML={{ __html: 'Access to exclusive experiences like the <a href="/wingate-invitational" class="text-wingo-600 hover:text-wingo-500">Old Balance Wingate Invitational</a> and 320 Day' }} />,
                  <span dangerouslySetInnerHTML={{ __html: '<a href="/vdot" class="text-wingo-600 hover:text-wingo-500">DAISY™-Daniels-powered</a> race projections, pace generator tools, and custom workouts' }} />,
                  <span dangerouslySetInnerHTML={{ __html: '<a href="/vote" class="text-wingo-600 hover:text-wingo-500">Wingocracy</a>: voting rights on club decisions — 1 <span class="text-[#E6C200] font-bold">W</span> = 1 vote' }} />,
                  <span dangerouslySetInnerHTML={{ __html: '<a href="/wager" class="text-wingo-600 hover:text-wingo-500"><span class="font-bold">W</span>INGO Wager World</a>: bet on friends using the proprietary DAISY™-degenerate formula' }} />
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="text-black leading-[1.6rem]">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <p className="text-lg font-medium">
                  <span className="font-bold">W</span>INGO cannot be traded or cashed out. 1 <span className="font-bold">W</span>INGO = 1 <span className="font-bold">W</span>INGO. That's all it will ever be.
                </p>
              </div>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Wait wtf is Coach D<span className="text-cyan-600">AI</span>SY™?</h2>
            <div className="flex items-start gap-8">
              <div className="flex-1 space-y-4 text-gray-700">
              <p className="text-lg">
                  Coach DAISY™ is an equine-powered AI coach and the benevolent overseer of the entire <span className="font-bold">W</span>INGO economy. All appeals go through the Centairenarian.
              </p>
              <a 
                href="https://www.daisy320.com/daisy" 
                target="_blank" 
                rel="noopener noreferrer" 
                  className="inline-block text-wingo-600 hover:text-wingo-700 font-medium"
              >
                  Meet Coach DAISY™ →
                </a>
              </div>
              <div className="w-32 h-32 flex-shrink-0">
                <img 
                  src="/daisy_headshot.png" 
                  alt="Coach DAISY™" 
                  className="w-full h-full object-cover rounded-full border-2 border-wingo-100"
                />
              </div>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How can I mine{' '}
              <span className="text-[#E6C200] font-bold">W</span>INGO?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                You mine <span className="font-bold">W</span>INGO by completing the <a href="https://www.strava.com/segments/39307521" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700">official 320-meter Wingo segment</a> at Wingate Track. Each verified Wingo = 1{' '}
                <span className="text-[#E6C200] font-bold">W</span>.
              </p>
              <p className="text-lg">
                To start mining, run 1 Initiation Wingo and <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700">text Coach DAISY™ (929-WAK-GRIG)</a> your receipts (Strava, Garmin, video).
              </p>
              <p className="text-lg">
                Submissions are reviewed. False attempts will be rejected. Persistent gaming may result in expulsion from the club and forfeiture of all <span className="font-bold">W</span>INGO.
              </p>
              <p className="text-lg">
                <a href="https://www.daisy320.com/game" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700 font-medium">Bonus: Complete Daisy's Yellowstone Adventure</a> and send screenshot of the dancing DAISY™ for <span className="font-bold">5{' '}
                <span className="text-[#E6C200] font-bold">W</span></span> (one-time only)!
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Can I earn unlimited{' '}
              <span className="text-[#E6C200] font-bold">W</span>INGO?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">Yes. No daily caps. No performance minimums.</p>
              <ul className="list-none space-y-3">
                {[
                  'Run 1 Wingo → 1 ',
                  'Walk 1 Wingo → 1 ',
                  'Limp 1 Wingo → still 1 '
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="text-black leading-[1.6rem]">•</span>
                    <span className="text-lg">
                      {item}
                      <span className="text-[#E6C200] font-bold">W</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-lg mt-6">
                No extra credit for speed or style. Just finish the Wingos and send receipts to Coach DAISY™. Bikers excluded.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What if I forget to record my run?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Then it didn't happen. No data = no <span className="font-bold">W</span>INGO.
                Unless it's on video.
              </p>
              <p className="text-lg">
                Exceptions granted at the sole discretion of Coach DAISY™.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Do my old Wingos count?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">No. The Wingo clock starts <em>after</em> initiation. No retroactive mining. No backdated Wingos.</p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Is this a real thing?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">Yes.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 