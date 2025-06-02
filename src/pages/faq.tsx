import React from 'react';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
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
                <span className="font-bold">W</span>INGO (Workout Independence Network Gains and Optimization) is the official token of the 320 Track Club. It's earned by completing the 320-meter Wingo laps at Wingate Track in Brooklyn.
              </p>
              <p className="text-lg">
                Each Wingo (320m) = 1{' '}
                <span className="text-[#E6C200] font-bold">W</span>.
              </p>
              <p className="text-lg">
                No fees. No purchases. No membership tier systems. Just a loop, a dream, and a priceless, valueless token.
              </p>
              <p className="text-lg">
                This isn't crypto. This isn't Web3.
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
                </a> unlocks:
              </p>
              <ul className="list-none space-y-3">
                {[
                  <span dangerouslySetInnerHTML={{ __html: 'Access to exclusive experiences like the <a href="/wingate-invitational" class="text-wingo-600 hover:text-wingo-500">Old Balance Wingate Invitational</a> and 320 Day' }} />,
                  <span dangerouslySetInnerHTML={{ __html: 'DAISY™-Daniels-powered race projections, pace generator tools, and custom workouts' }} />,
                  <span dangerouslySetInnerHTML={{ __html: 'Democracy: voting rights on club decisions — 1 <span class="text-[#E6C200] font-bold">W</span> = 1 vote' }} />,
                  <span dangerouslySetInnerHTML={{ __html: '<span class="font-bold">W</span>INGO Wager World: bet on friends using the proprietary DAISY™-degenerate formula' }} />
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
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How do I earn{' '}
              <span className="text-[#E6C200] font-bold">W</span>INGO?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <Link to="/mine" className="text-wingo-600 hover:text-wingo-700">
                  You mine <span className="font-bold">W</span>INGO
                </Link> by completing the <a href="https://www.strava.com/segments/39307521" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700">official 320-meter Wingo segment</a> at Wingate Track. Each verified Wingo = 1{' '}
                <span className="text-[#E6C200] font-bold">W</span>.
              </p>
              <p className="text-lg font-medium">Verification methods:</p>
              <ul className="list-none space-y-3">
                {[
                  <span key="send">
                    <Link to="/mine" className="text-wingo-600 hover:text-wingo-700">Send to Coach DAISY™</Link>: Submit activity link, screenshot, or GPX file showing Wingo segments
                  </span>,
                  <span key="text">
                    <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700">Text Coach DAISY™</a>: Send <span className="font-bold">W</span>INGO receipt to 929-WAK-GRIG
                  </span>,
                  <span key="daisy-game">
                    <a href="https://www.daisy320.com/game" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700 font-medium">Play Daisy's Yellowstone Adventure</a>: Complete the game and send screenshot of the dancing DAISY™ for <span className="font-bold">5{' '}
                    <span className="text-[#E6C200] font-bold">W</span></span> (one-time only)!<br/>
                  </span>
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="text-black leading-[1.6rem]">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg mt-6">
                Submissions are reviewed. False attempts will be rejected.
                Persistent gaming may result in expulsion from the club and forfeiture of all <span className="font-bold">W</span>INGO.
              </p>
              <p className="text-lg mt-4 italic">
                Auto-mining via Strava (coming soon): Authorize the Coach DAISY™ WINGO surveillance program for automatic Wingo recording
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
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How do I register for the 320 Track Club?</h2>
            <div className="space-y-4 text-gray-700">
              <ol className="list-decimal list-inside space-y-3 text-lg">
                {[
                  'Run 1 Wingo',
                  <a key="register" href="/register" className="text-wingo-600 hover:text-wingo-500 font-medium">Register</a>,
                  'Connect your Strava account and/or upload your WINGO receipts',
                  'Wait for approval from Coach DAISY™'
                ].map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
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