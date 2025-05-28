import React from 'react';
import { Link } from 'react-router-dom';

const WingoWednesday: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <img src="http://localhost:5173/wingate1.jpg" alt="WINGO Wednesday" className="w-full rounded-xl shadow-lg object-cover h-64 mb-6" />
          <h1 className="text-5xl font-bold mb-4 text-center text-wingo-600">WINGO Wednesdays</h1>
          <p className="text-xl text-center text-gray-700 mb-2">Biweekly at Wingate Track, Brooklyn</p>
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-6 text-center">
            <span className="font-semibold text-green-700">Next Session:</span> <span className="text-green-800">Wednesday, May 28</span>
          </div>
        </div>
        <div className="space-y-8">
          <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-wingo-600">What is WINGO Wednesday?</h2>
            <p className="text-lg text-gray-700 mb-2">
              Every other Wednesday, the 320 Track Club hosts a free, open session at the historic Wingate Track. Walk, run, sprint, limp, plank, or just hang out—everyone is welcome!
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Get a custom workout from <span className="font-semibold">Coach DAISY™</span></li>
              <li>Earn 1 <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> for every 320m lap you complete</li>
              <li>All paces, all abilities, all vibes</li>
              <li>No registration, no fees, no pressure</li>
            </ul>
          </section>
          <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-wingo-600">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Do I have to run fast?</h3>
                <p className="text-gray-700">Nope! Fast or slow, every <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> counts the same.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">How do I earn 1 <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span>?</h3>
                <p className="text-gray-700">Complete a 320m lap and log it with Coach DAISY™. Each <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> = 1 <span className="inline-flex items-center">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span>.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Do I need to sign up?</h3>
                <p className="text-gray-700">No registration required. Just show up and join the fun.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">What if I have questions?</h3>
                <p className="text-gray-700">Ask Coach DAISY™ or any 320 Track Club member. Or <Link to="/faq" className="text-wingo-600 hover:text-wingo-700 underline">read the FAQ</Link>.</p>
              </div>
            </div>
          </section>
          <div className="text-center mt-8">
            <Link to="/events" className="inline-block px-6 py-3 bg-wingo-600 text-white font-bold rounded-lg shadow hover:bg-wingo-700 transition">Back to Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingoWednesday; 