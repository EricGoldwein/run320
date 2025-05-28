import React from 'react';

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What is <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>?</h2>
          <p className="text-gray-600 mb-4">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> stands for <strong>Workout Independence Network Gains & Optimization</strong>. It is a digital token that can only be earned by completing the 320-meter segment at Wingate Track in Brooklyn. Each completed lap = 1 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>. There is no other way to acquire it.
          </p>
          <p className="text-gray-600 mt-2">
            <a href="https://www.strava.com/segments/7831001" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700">
              View the segment on Strava →
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Why does this exist?</h2>
          <p className="text-gray-600 mb-4">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> was created as a response to the current state of running culture — where races cost $100+, sell out months in advance, and increasingly resemble subscription services.
          </p>
          <p className="text-gray-600 mb-4">
            This is not that. <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> is meant to be a leveling mechanism. Anyone who can complete a 320-meter loop — fast or slow — is eligible to participate. There is no registration fee. No merch. No sponsors. There is also no money. Only <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What can I do with <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>?</h2>
          <p className="text-gray-600">
            At the moment: not much. Eventually, it may be used to enter 320 Track Club events (The Wingate Invitational, 3/20 Day, and annual pre-5th Ave workout) claim local perks, or place friendly wagers with other participants or with DAISY™ (the house). Details to come.
          </p>
          <p className="text-gray-600 mb-4">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> is not transferable for cash or credit. It has no monetary value. 1 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> is worth 1 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">How do I mine <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>?</h2>
          <p className="text-gray-600 mb-4">
            You must complete the designated 320-meter segment at Wingate Track in Brooklyn. Each verified completion = 1 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.
          </p>
          <p className="text-gray-600 mt-2">
            Verification can happen in one of the following ways:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Automatically via Strava API (preferred). You'll link your account, and approved segment efforts will be counted.</li>
            <li>Manually, by sending a GPS file (e.g. .gpx) or public activity link showing the completed segment.</li>
            <li>Directly, by notifying Coach DAISY™ with a timestamp, effort type, and supporting evidence (screenshot, shoe selfie, etc.).</li>
          </ul>
          <p className="text-gray-600 mt-2">
            All submissions are reviewed. False or incomplete efforts will be discarded. Excessive gaming of the system may result in symbolic consequences.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Can I earn unlimited <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>?</h2>
          <p className="text-gray-600">
            Yes. There is no daily cap, monthly ceiling, or performance minimum.
          </p>
          <p className="text-gray-600 mb-4">
            Run the loop 10 times = 10 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.<br />
            Run it 100 times = 100 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.<br />
            Walk it once = 1 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>.
          </p>
          <p className="text-gray-600 mt-2">
            There is no penalty for pace, clothing, or style. There is no bonus for speed.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">What if I forget to record my run?</h2>
          <p className="text-gray-600 mb-4">
            Then it did not happen, and no <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> will be awarded. Exceptions may be granted in rare cases at the sole discretion of Coach DAISY™.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Who is Coach DAISY™?</h2>
          <p className="text-gray-600 mb-4">
            Coach DAISY™ is an equine-powered AI coach that oversees the <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> economy. All appeals are reviewed by her. All final judgments are hers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">How do I register for the 320 Track Club?</h2>
          <p className="text-gray-600">
            To register for the 320 Track Club:
            1. Ensure you have at least 10 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> tokens in your wallet
            2. Navigate to the registration page
            3. Connect your Strava account
            4. Pay the 10 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> membership fee
            5. Complete your profile information
            Once registered, you'll have immediate access to all club benefits and voting rights.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">How does voting work in the 320 Track Club?</h2>
          <p className="text-gray-600">
            Voting power in the 320 Track Club is proportional to your <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> holdings. For example, if there are
            25 members with a total of 246 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> tokens, and you hold 123 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>, you would have 50% of the voting share.
            This ensures that members with greater investment in the community have proportional influence in decisions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Is this a real thing?</h2>
          <p className="text-gray-600">
            Yes.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> is part of the DAISY™ Universe and a creation of 320 Track Club. For more information, visit{' '}
            <a href="https://daisy320.com" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700">
              daisy320.com
            </a>
          </p>
          <p className="text-[10px] text-gray-400 mt-4">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> has no monetary value and is not a form of currency, cryptocurrency, legal tender, or investment vehicle. It cannot be bought, sold, or traded for goods or services outside the <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> ecosystem. Participation in WINGO-related activities is voluntary and subject to the whims of Coach DAISY™. Please run responsibly. Void where prohibited. Consult your legs before beginning any exercise program. DAISY™ is not a licensed financial advisor, life coach, or track official.
          </p>
        </div>
      </div>
    </div>
  );
} 