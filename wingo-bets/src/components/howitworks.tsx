import React from 'react';

export default function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">How <span className="inline-flex items-baseline">
        <span className="text-[#E6C200] font-bold">W</span>
        <span>INGO</span>
      </span> Works</h1>

      <div className="space-y-8">
        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4"><span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span> Benefits</h2>
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Holding <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> tokens comes with exclusive benefits and privileges:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Exclusive access to 320 Track Club events and competitions</li>
                <li>Special discounts on premium running socks and merchandise</li>
                <li>Priority access to Coach DAISY's training programs and personalized coaching</li>
                <li>Recognition in the <span className="inline-flex items-baseline">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> Hall of Fame for top performers</li>
                <li>Early access to new features and betting opportunities</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mining <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span> Tokens</h2>
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> tokens are earned by completing Wingate track segments. Each 320m segment completed equals 1 <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> token.
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Ways to Mine <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Connect your Strava account using the API token</li>
                <li>Upload a GPX file from your run</li>
                <li>Submit a Strava activity link</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Using <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span> Tokens</h2>
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> tokens can be used to place bets on various running events and challenges:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Types of Bets:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Time Bets: Bet on whether someone will run under a specific time</li>
                <li>Matchups: Bet on head-to-head competitions between runners</li>
                <li>Parlays: Combine multiple bets for higher rewards</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Creating Bets</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              You can create your own bets for others to participate in:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Bet Creation Process:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Choose the type of bet (Time, Matchup, or Parlay)</li>
                <li>Set the bet amount in <span className="inline-flex items-baseline">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> tokens</li>
                <li>Define the conditions and odds</li>
                <li>Add event details and expiration date</li>
                <li>Submit the bet for others to join</li>
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Leaderboard</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Track your performance and compete with other runners:
            </p>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Leaderboard Features:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Total <span className="inline-flex items-baseline">
                  <span className="text-[#E6C200] font-bold">W</span>
                  <span>INGO</span>
                </span> tokens won</li>
                <li>Correct picks percentage</li>
                <li>Total number of picks made</li>
                <li>Ranking among all users</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 