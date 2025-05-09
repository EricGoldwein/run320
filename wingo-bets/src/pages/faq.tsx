import React from 'react';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-wingo-600 to-wingo-400">
          Frequently (never) Asked Questions
        </h1>
        
        <div className="space-y-12">
          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">What is $WINGO?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                $WINGO stands for Workout Independence Network Gains & Optimization — a digital token earned only by <Link to="/mine" className="text-wingo-600 hover:text-wingo-700">completing a 320-meter segment at the historic Wingate Track in Brooklyn</Link>.
              </p>
              <p className="text-lg font-medium">
                Each loop = 1 $WINGO.
              </p>
              <p className="text-lg">
                There is no other way to get it. No purchases. No shortcuts. Just WINGOs.
              </p>
              <a 
                href="https://www.strava.com/segments/7831001" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-wingo-600 hover:text-wingo-700 font-medium group"
              >
                View WINGO segment on Strava 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">What can you do with $WINGO?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">$WINGO can be used to:</p>
              <ul className="list-none space-y-3">
                {[
                  <><Link to="/register" className="text-wingo-600 hover:text-wingo-700">Join the 320 Track Club</Link> (10 $WINGO gets you in)</>,
                  <><Link to="/events" className="text-wingo-600 hover:text-wingo-700">Enter exclusive events</Link> like the Wingate Invitational and 3/20 Day</>,
                  <><Link to="/wager" className="text-wingo-600 hover:text-wingo-700">Place friendly wagers</Link> with other runners or with DAISY™ (the house)</>,
                  'Vote on club decisions — your voting power is proportional to your $WINGO holdings'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-wingo-500 mr-2">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <p className="text-lg font-medium">
                  $WINGO cannot be traded or cashed out.
                </p>
                <p className="text-lg">
                  1 $WINGO = 1 $WINGO. That's all it will ever be.
                </p>
              </div>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">Why does this exist?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Because no one wants to pay $60 annually for the right to be put on waiting lists for $100 races six months out.
              </p>
              <p className="text-lg font-medium">
                $WINGO is a counterpoint to 9+1 culture.
              </p>
              <p className="text-lg">
                No fees. No merch. No corporate partners. No prestige points.
                Just a loop, a track, and a token earned by showing up.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">Wait who the heck is Coach DAISY™?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Coach DAISY™ is an equine-powered AI coach and the benevolent overseer of the entire $WINGO economy. All appeals go through her. Her judgments are final.
              </p>
              <a 
                href="https://www.daisy320.com/daisy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-wingo-600 hover:text-wingo-700 font-medium group"
              >
                Meet Coach DAISY™ 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">How do I acquire $WINGO?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                <Link to="/mine" className="text-wingo-600 hover:text-wingo-700">You mine $WINGO</Link> by completing the official 320-meter segment at Wingate Track. Each verified effort = 1 token.
              </p>
              <p className="text-lg font-medium">Verification methods:</p>
              <ul className="list-none space-y-3">
                {[
                  'Strava API (preferred): Connect your account — efforts will be counted automatically',
                  'Manual upload: Submit a GPS file or public activity link showing the segment',
                  'Message Coach DAISY™: Include timestamp, activity type, and evidence (screenshot, shoe selfie, etc.)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-wingo-500 mr-2">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg mt-6">
                Submissions are reviewed. False attempts will be rejected.
                Persistent gaming may result in expulsion from the club and forfeiture of all $WINGO.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">Can I earn unlimited $WINGO?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">Yes. No daily caps. No performance minimums.</p>
              <ul className="list-none space-y-3">
                {[
                  'Run 1 lap → 1 $WINGO',
                  'Run 100 laps → 100 $WINGO',
                  'Walk a lap in Crocs → still 1 $WINGO'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-wingo-500 mr-2">•</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg mt-6">
                No extra credit for speed or gear. Just finish the WINGO.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">What if I forget to record my run?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Then it didn't happen. No data = no $WINGO.
                Unless it's on video.
              </p>
              <p className="text-lg">
                Rare exceptions may be granted — at the sole discretion of Coach DAISY™.
              </p>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">How do I register for the 320 Track Club?</h2>
            <div className="space-y-4 text-gray-700">
              <ol className="list-none space-y-3">
                {[
                  'Earn at least 10 $WINGO',
                  'Visit the registration page',
                  'Connect your Strava account',
                  'Pay the 10 $WINGO membership fee',
                  'Complete your profile'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-wingo-500 mr-2">{index + 1}.</span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 space-y-2">
                <p className="text-lg">
                  Once registered, you unlock club perks and gain voting rights.
                </p>
                <p className="text-lg">
                  The more $WINGO you hold, the more say you have.
                </p>
              </div>
            </div>
          </section>

          <section className="transform hover:scale-[1.02] transition-transform duration-200 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-6 text-wingo-600">Is this a real thing?</h2>
            <p className="text-lg text-gray-700">Yes.</p>
          </section>
        </div>

        <div className="mt-12 space-y-4">
          <p className="text-gray-600">
            $WINGO is part of the DAISY™ Universe and a creation of 320 Track Club. For more information, visit{' '}
            <a href="https://daisy320.com" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700">
              daisy320.com
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-4">
            $WINGO has no monetary value and is not a form of currency, cryptocurrency, legal tender, or investment vehicle. It cannot be bought, sold, or traded for goods or services outside the $WINGO ecosystem. Participation in WINGO-related activities is voluntary and subject to the whims of Coach DAISY™. Please run responsibly. Void where prohibited. Consult your legs before beginning any exercise program. DAISY™ is not a licensed financial advisor, life coach, or track official.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 