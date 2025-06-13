import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface RegistrationForm {
  name: string;
  email: string;
  stravaId: string;
  age: string;
  gender: string;
  expectedPace: string;
  activityProof: string;
  activityType: 'strava' | 'file' | 'wallet' | 'earn' | 'transfer' | 'upload' | '';
}

interface WingateInvitationalProps {
  user: User;
}

const WingateInvitational: React.FC<WingateInvitationalProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<RegistrationForm>({
    name: '',
    email: '',
    stravaId: '',
    age: '',
    gender: '',
    expectedPace: '',
    activityProof: '',
    activityType: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle registration logic
    console.log('Registration submitted:', formData);
    setIsRegistering(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Old Balance</span>
                  <span className="block text-wingo-600">Wingate Invitational</span>
                </h1>
                <div className="mt-4 mb-6">
                </div>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Sunday, September 7, 2025 at 07:20 AM
                </p>
                <p className="mt-2 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Definitely not a mile. Definitely not sold out.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Sponsored by <a href="/old-balance" className="text-wingo-600 hover:text-wingo-700 font-bold">Old Balance</a>.</p>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-200">
              <h2 className="text-3xl font-bold mb-6 text-wingo-600">Wingate Invitational</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="font-medium text-green-700">This race is NOT SOLD OUT.</p>
                </div>
                <p className="text-lg">
                  The <span className="font-bold">Old Balance Wingate Invitational</span> is the flagship experience of the 320 Track Club.
                </p>
                <p className="text-lg">
                  All <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span> unlocked at the gate will be reallocated to top finishers. Additional <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span> may be gained — or forfeited — through the <a href="/wager" className="text-wingo-600 hover:text-wingo-700 underline">WINGO Wager Market</a>.
                </p>
              </div>
            </section>

            {/* Registration Section - Moved above Old Balance photo */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Register (<span className="text-[#E6C200] font-bold">W</span> 10)</h2>
              <p className="text-gray-600 mb-4">
                Online registration coming soon. Message <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700">Coach DAISY™</a> to experience the Wingate Invitational.
              </p>
            </div>

            <div className="mt-8">
              <a href="/old-balance" className="block">
                <div className="overflow-hidden">
                  <img 
                    src="/old_balance.png" 
                    alt="Old Balance" 
                    className="w-full h-auto -mb-[12.5%]"
                  />
                </div>
              </a>
            </div>

            {/* Location Section - Moved to bottom */}
            <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-200">
              <h2 className="text-3xl font-bold mb-6 text-wingo-600">Location</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6053.363823832913!2d-73.94705262370852!3d40.658941671401536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b64fb0f1bf1%3A0xec3b714e74e97824!2sWingate%20Park!5e0!3m2!1sen!2sus!4v1746618184061!5m2!1sen!2sus"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </section>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              {!isRegistering ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="w-full bg-wingo-600 text-white px-4 py-2 rounded-md hover:bg-wingo-700 transition-colors"
                  >
                    Unlock the Gate
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-0.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="stravaId" className="block text-xs font-medium text-gray-700 mb-0.5">
                      Strava ID (Optional)
                    </label>
                    <input
                      type="text"
                      id="stravaId"
                      name="stravaId"
                      value={formData.stravaId}
                      onChange={handleInputChange}
                      className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-0.5">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="18"
                      className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-0.5">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                    >
                      <option value=""></option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expectedPace" className="block text-xs font-medium text-gray-700 mb-0.5">
                      Expected Pace (per 1600m PentaWingo)
                    </label>
                    <input
                      type="text"
                      id="expectedPace"
                      name="expectedPace"
                      value={formData.expectedPace}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 8:30"
                      className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Gate Unlock: 10 <span className="text-[#E6C200] font-bold">W</span>INGO
                    </label>
                    <div className="mt-1 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="wallet"
                          name="activityType"
                          value="wallet"
                          checked={formData.activityType === 'wallet'}
                          onChange={handleInputChange}
                          className="h-3 w-3 text-wingo-600 focus:ring-wingo-500 border-gray-300"
                        />
                        <label htmlFor="wallet" className="ml-2 block text-xs text-gray-700">
                          Wallet ({user.wingo_balance} <span className="text-[#E6C200] font-bold">W</span> available)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="upload"
                          name="activityType"
                          value="upload"
                          checked={formData.activityType === 'upload'}
                          onChange={handleInputChange}
                          className="h-3 w-3 text-wingo-600 focus:ring-wingo-500 border-gray-300"
                        />
                        <label htmlFor="upload" className="ml-2 block text-xs text-gray-700">
                          WINGO Upload
                        </label>
                      </div>
                    </div>

                  </div>

                  {formData.activityType === 'upload' && (
                    <div className="space-y-2">
                    <div>
                        <label htmlFor="wingoProof" className="block text-xs font-medium text-gray-700 mb-0.5">
                          Upload WINGO Receipts
                      </label>
                      <input
                        type="file"
                          id="wingoProof"
                          name="wingoProof"
                          onChange={handleInputChange}
                          className="mt-0.5 block w-full py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="wingoLinks" className="block text-xs font-medium text-gray-700 mb-0.5">
                          Activity Link (Optional)
                        </label>
                        <input
                          type="text"
                          id="wingoLinks"
                          name="wingoLinks"
                        onChange={handleInputChange}
                          className="mt-0.5 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 py-1.5 px-2 text-sm"
                          placeholder="Enter link(s) to WINGO activity"
                      />
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        Your submission will be reviewed by Coach DAISY™
                      </p>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-wingo-600 text-white px-4 py-2 rounded-md hover:bg-wingo-700 transition-colors text-sm"
                    >
                      Complete Registration
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingateInvitational; 