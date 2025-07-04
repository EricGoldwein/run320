import type { NextPage } from 'next';
import Head from 'next/head';
import MineWingo from './minewingo';
// import Navigation from '../components/Navigation';
import { useState } from 'react';
import Image from 'next/image';
import { User } from '../types';

const Home: NextPage = () => {
  const [user, setUser] = useState<User>({
    id: '1',
    email: 'test@example.com',
    username: 'TestUser',
    name: 'Test User',
    wingo_balance: 0,
    total_wingos: 0,
    created_at: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    balance: 0,
    isActive: true,
    createdAt: new Date()
  });

  const handleMineWingo = async (amount: number) => {
    console.log(`Mined ${amount} WINGO tokens`);
    setUser(prev => ({
      ...prev,
      wingo_balance: prev.wingo_balance + amount
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title><span className="inline-flex items-baseline">
          <span className="text-[#E6C200] font-bold">W</span>
          <span>INGO</span>
        </span> World</title>
        <meta name="description" content="Where workout independence network gains and optimization is always 320 meters away" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Navigation /> */}

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 sm:mb-4">
            <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> World
          </h1>
          <p className="text-lg sm:text-xl text-center mb-6 sm:mb-8 text-gray-600 px-4">
            Where workout independence network gains and optimization is always 320 meters away
          </p>

          <div className="relative w-full h-48 sm:h-64 mb-6 sm:mb-8">
            <Image
              src="/wingate1.jpg"
              alt="320 Track"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <MineWingo user={user} onMineWingo={handleMineWingo} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home; 