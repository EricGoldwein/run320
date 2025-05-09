import type { NextPage } from 'next';
import Head from 'next/head';
import MineWingo from './minewingo';
// import Navigation from '../components/Navigation';
import { useState } from 'react';
import Image from 'next/image';

const Home: NextPage = () => {
  const [user, setUser] = useState({
    id: 1,
    email: 'test@example.com',
    username: 'TestUser',
    wingo_balance: 0,
    created_at: new Date().toISOString()
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
        <title>$WINGO World</title>
        <meta name="description" content="Where workout independence network gains and optimization is always 320 meters away" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <Navigation /> */}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">$WINGO World</h1>
          <p className="text-xl text-center mb-8 text-gray-600">
            Where workout independence network gains and optimization is always 320 meters away
          </p>

          <div className="relative w-full h-64 mb-8">
            <Image
              src="/wingate1.jpg"
              alt="320 Track"
              fill
              className="object-contain"
              priority
            />
          </div>

          <MineWingo user={user} onMineWingo={handleMineWingo} />
        </div>
      </main>
    </div>
  );
};

export default Home; 