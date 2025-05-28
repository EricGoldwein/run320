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
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>?
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> is the digital token of the 320 Track Club. It's earned by completing 320-meter segments at Wingate Track in Brooklyn.
              </p>
              <p className="text-lg">
                Each WINGO (320m loop) = 1{' '}
                <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span>. No purchases. No shortcuts. Just WINGOs.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Why does this exist?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Because no one wants to pay $60 annually for the privilege of being waitlisted for $100 races six months out.
              </p>
              <p className="text-lg">
                No fees. No merch. No corporate partners. No prestige points.
                Just a loop, a track, and a priceless, valueless token earned by showing up.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What can you do with{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> is your key to the 320 Track Club.{' '}
                <a href="/register" className="text-wingo-600 hover:text-wingo-500 font-medium">
                  Membership (10{' '}
                  <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span>)
                </a> unlocks:
              </p>
              <ul className="list-none space-y-3">
                {[
                  <span dangerouslySetInnerHTML={{ __html: 'Access to exclusive experiences like the Wingate Invitational and 320 Day' }} />,
                  <span dangerouslySetInnerHTML={{ __html: 'Custom workouts designed by Coach DAISY™ for the magical 320-meter WINGO loop' }} />,
                  <span dangerouslySetInnerHTML={{ __html: 'DAISY™-Daniels-powered race projections and pace generator tools' }} />,
                  <span dangerouslySetInnerHTML={{ __html: 'Democracy: voting rights on club decisions — 1 <span class="inline-flex items-center"><span class="text-[#E6C200] font-bold">W</span><span class="leading-none">INGO</span></span> = 1 vote' }} />,
                  <span dangerouslySetInnerHTML={{ __html: '<span class="inline-flex items-center"><span class="text-[#E6C200] font-bold">W</span><span class="leading-none">INGO</span></span> Wager World: bet on friends using the proprietary DAISY™-degenerate formula' }} />
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="text-black leading-[1.6rem]">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <p className="text-lg font-medium">
                  <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span> cannot be traded or cashed out. 1 WINGO = 1{' '}
                  <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span>. That's all it will ever be.
                </p>
              </div>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Wait wtf is Coach D<span className="text-cyan-600">AI</span>SY™?</h2>
            <div className="flex items-start gap-8">
              <div className="flex-1 space-y-4 text-gray-700">
              <p className="text-lg">
                  Coach DAISY™ is an equine-powered AI coach and the benevolent overseer of the entire{' '}
                  <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span> economy. All appeals go through the Centairenarian.
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
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How do I acquire{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <Link to="/mine" className="text-wingo-600 hover:text-wingo-700">
                  You mine{' '}
                  <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span>
                </Link> by completing the official 320-meter WINGO segment at Wingate Track. Each verified WINGO = 1{' '}
                <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span>.
              </p>
              <p className="text-lg font-medium">Verification methods:</p>
              <ul className="list-none space-y-3">
                {[
                  'Send to Coach DAISY™: Submit an activity link, screenshot, or GPX file showing the WINGOs',
                  'Auto-mining via Strava (coming soon): Authorize the Coach DAISY™ WINGO surveillance program — WINGOs will be counted automatically',
                  <span key="daisy-game">
                    <a href="https://www.daisy320.com/game" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700 font-medium">Play Daisy's Yellowstone Adventure</a>: Complete the game and send us a screenshot of the dancing DAISY™ and we'll add <span className="font-bold">5{' '}
                    <span className="inline-flex items-center">
                      <span className="text-[#E6C200] font-bold">W</span>
                      <span>INGO</span>
                    </span></span> (one-time only) to your account!<br/>
                    <span className="text-xs text-gray-500">(Yes, really. Try it: it's fun and glitchy and horse-approved.)</span>
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
                Persistent gaming may result in expulsion from the club and forfeiture of all{' '}
                <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span>.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Can I earn unlimited{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">Yes. No daily caps. No performance minimums.</p>
              <ul className="list-none space-y-3">
                {[
                  'Run 1 WINGO → 1 ',
                  'Run 50 WINGOs → 50 ',
                  'Limp a WINGO → still 1 '
                ].map((item, index) => (
                  <li key={index} className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="text-black leading-[1.6rem]">•</span>
                    <span className="text-lg">
                      {item}
                      <span className="inline-flex items-center">
                        <span className="text-[#E6C200] font-bold">W</span>
                        <span>INGO</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-lg mt-6">
                No extra credit for speed or style. Just finish the WINGO and send receipts to Coach DAISY™.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">What if I forget to record my run?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Then it didn't happen. No data = no{' '}
                <span className="text-[#D4AF37] font-['Cambria'] text-[1.1em] font-bold">W</span>INGO.
                Unless it's on video.
              </p>
              <p className="text-lg">
                Rare exceptions may be granted at the sole discretion of Coach DAISY™.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How do I register for the 320 Track Club?</h2>
            <div className="space-y-4 text-gray-700">
              <ol className="list-decimal list-inside space-y-3 text-lg">
                {[
                  <span key="earn">Earn at least 10{' '}
                    <span className="text-[#D4AF37] font-['Cambria'] text-[1.1em] font-bold">W</span>INGO
                  </span>,
                  <a key="register" href="/register" className="text-wingo-600 hover:text-wingo-500 font-medium">Click Register</a>,
                  'Connect your Strava account and/or upload your WINGO receipts',
                  'Wait for approval from Coach DAISY™'
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
              <div className="mt-6 space-y-2">
                <p className="text-lg">
                  No cash. No credit. No crypto. Just{' '}
                  <span className="text-[#D4AF37] font-['Cambria'] text-[1.1em] font-bold">W</span>INGO.
                </p>
              </div>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Is this a real thing?</h2>
            <p className="text-lg text-gray-700">Yes.</p>
          </section>
        </div>

        <div className="mt-12 space-y-4">
          <p className="text-gray-600">
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> is part of the DAISY™ Universe and a creation of 320 Track Club.
          </p>
          <p className="text-[10px] text-gray-400 mt-4">
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> has no monetary value and is not a form of currency, cryptocurrency, legal tender, or investment vehicle. It cannot be bought, sold, or traded for goods or services outside the{' '}
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> ecosystem. Participation in WINGO-related activities is voluntary and subject to the whims of Coach DAISY™. Please run responsibly. Void where prohibited. Consult your legs before beginning any exercise program. DAISY™ is not a licensed financial advisor, life coach, or track official.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 