import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OldBalance: React.FC = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePurchase = () => {
    setShowWaitlist(true);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="bg-white overflow-hidden">
            <div className="relative">
              <img 
                src="/old_balance.png" 
                alt="Old Balance DivotAware Pro" 
                className="w-full -mt-[10%] -mb-[10%]"
              />
            </div>
          </div>

          {/* Product Description */}
          <div className="p-6 sm:p-8">
            <div className="prose prose-lg max-w-none">

              <p className="text-xl font-medium text-gray-900 mb-6">
                You trained. You tapered. But did you anticipate the dip? The <span className="font-bold">Old Balance DivotAware 1081 Pro</span> is a predictive AI-powered lacing system calibrated for the notorious mid-Wingo anomaly.
              </p>

              <div className="space-y-6">
                <p className="text-gray-700">
                  At the 140-meter mark of the Wingo — the moment when momentum wobbles and surface trust dissolves — most athletes rely on instinct. At <span className="font-bold">Old Balance</span>, we offer something smarter: adaptive effort anticipation.
                </p>

                <p className="text-gray-700">
                  DivotAware Pro uses AI to analyze past loops, current effort load, and proprietary decay curves to generate a subtle, well-timed alert — just before knots emerge.
                </p>

                <div className="bg-gray-50 border-l-4 border-wingo-600 p-6 rounded-r-lg my-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-wingo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-700 mb-3">
                        "7 in 11 runners fail to recognize shoelace instability as the initiating factor until after the cessation of movement."
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Source: O.B.1. Performance Cognition Lab</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🪢 Key Features</h3>
                  <ul className="space-y-4">
                    <li className="block">
                      <span className="font-semibold text-gray-900 block mb-1">DipNet Engine:</span>
                      <span className="text-gray-700">Pattern-recognition trained on 4,000+ verified Wingo workouts.</span>
                    </li>
                    <li className="block">
                      <span className="font-semibold text-gray-900 block mb-1">Divot Intercept Timestamp:</span>
                      <span className="text-gray-700">Knot your lace, not your pace.</span>
                    </li>
                    <li className="block">
                      <span className="font-semibold text-gray-900 block mb-1">Zero Interface:</span>
                      <span className="text-gray-700">No screen. No app. Nothing to untie.</span>
                    </li>
                  </ul>
                </div>

                {/* Pricing and Purchase */}
                <div className="mt-8 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Product Image */}
                    <div className="lg:w-2/5 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                      <div className="relative">
                        <img 
                          src="/ob_lace.png" 
                          alt="Old Balance DivotAware Pro Lace" 
                          className="max-w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-wingo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          PRO
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Details */}
                    <div className="lg:w-3/5 p-8 lg:p-10">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">DivotAware Pro</h3>
                          <p className="text-gray-600 text-sm">AI-Powered Lacing System</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-gray-900"><span className="text-yellow-500">W</span> 320</p>
                          <p className="text-sm text-gray-500 line-through"><span className="text-yellow-500">W</span> 352</p>
                          <p className="text-xs text-green-600 font-medium">Save <span className="text-yellow-500">W</span> 32</p>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                          🔓 Use code <span className="font-mono font-bold ml-1">DAISY320</span> for W 32 off
                        </span>
                      </div>

                      {!showWaitlist ? (
                        <div className="space-y-4">
                          <button
                            onClick={handlePurchase}
                            className="w-full bg-gradient-to-r from-wingo-600 to-wingo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-wingo-700 hover:to-wingo-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            Get Laced
                          </button>
                          <p className="text-xs text-gray-500 text-center">Free shipping</p>
                        </div>
                      ) : !isSubmitted ? (
                        <div className="space-y-6">
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm text-yellow-800 font-semibold">
                                  Sold out! Join the waitlist to be notified when we restock.
                                </p>
                              </div>
                            </div>
                          </div>
                          <form onSubmit={handleWaitlistSubmit} className="space-y-5">
                            <div>
                              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-4 px-5 text-base transition-all duration-200"
                                placeholder="you@wingo320.com"
                              />
                            </div>
                            <button
                              type="submit"
                              className="w-full bg-gradient-to-r from-wingo-600 to-wingo-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-wingo-700 hover:to-wingo-800 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                              Join Waitlist
                            </button>
                          </form>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <svg className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm text-green-800 font-semibold">
                                Thanks! We'll notify you when DivotAware Pro is back in stock.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invitational Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Old Balance is a proud sponsor of the{' '}
                    <Link to="/wingate-invitational" className="text-wingo-600 hover:text-wingo-700 font-medium">
                      Old Balance Wingate Invitational
                    </Link>
                    , held Sunday, September 7 at 7:20 a.m. Definitely not a m*le. Definitely not sold out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OldBalance; 