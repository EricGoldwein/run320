import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left: Text */}
      <div className="flex-1 flex items-center justify-center z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <main className="w-full max-w-2xl px-4 sm:px-6 md:px-8">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
              <span className="block text-wingo-600 xl:inline">WINGO World</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Where workout independence is always 320 meters away.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-wingo-600 hover:bg-wingo-700 md:py-4 md:text-lg md:px-10"
                >
                  Find Your Kick
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link
                  to="/faq"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-wingo-700 bg-wingo-100 hover:bg-wingo-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Right: Image */}
      <div className="flex-1 lg:relative flex items-center justify-center">
        <img
          className="h-full w-full object-cover object-left-bottom rounded-lg"
          src="/wingate1.jpg"
          alt="Wingate Track"
        />
      </div>
    </div>
  );
};

export default Home; 