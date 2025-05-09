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
  activityType: 'strava' | 'file' | '';
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
                  <span className="block">Wingate</span>
                  <span className="block text-wingo-600">Invitational</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Sunday, September 7, 2025 at 07:20 AM
                </p>
                <p className="mt-2 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Your Balance: {user.wingo_balance} $WINGO
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/wingate1.jpg"
            alt="Wingate Track"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-200">
              <h2 className="text-3xl font-bold mb-6 text-wingo-600">Race Details</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <p className="font-medium text-green-700">This race is NOT SOLD OUT.</p>
                </div>
                <p className="text-lg">
                  To register for races, you do NOT have to create your new NYRR account nor add a credit card. Simply complete 32 laps (WINGOs) at the iconic 320-meter Wingate Track and submit your run to 320 Track Club to earn 32 <span className="relative inline-block group">
                    <span className="text-wingo-600 font-medium cursor-help">$WINGO</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <p className="mb-2"><strong>$WINGO</strong> stands for Workout Independence Network Gains & Optimization</p>
                      <p className="mb-2 text-xs text-gray-300">A digital token earned only by completing 320-meter segments at Wingate Track in Brooklyn.</p>
                      <p className="mb-2 text-xs text-gray-300">Each loop = 1 $WINGO. No purchases. No shortcuts. Just WINGOs.</p>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                    </div>
                  </span>.
                </p>
                <div className="bg-wingo-50 p-4 rounded-lg">
                  <p className="font-medium text-wingo-700">Registration Cost: 32 $WINGO</p>
                </div>
                <p className="text-lg">
                  NOTE: The Wingate Invitational has multiple start times throughout the day. We will provide these start times eventually, probably.
                </p>
                <p className="text-lg">
                  Follow and use <span className="font-medium">#wingo320</span> in your social posts to share your excitement leading up to race day and celebrate all those "mile-stones."
                </p>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-200">
              <h2 className="text-3xl font-bold mb-6 text-wingo-600">Why Race with 320 Track Club?</h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  When you run with 320 TC, you do more than compete in a world-class race—your support and participation play a role in fulfilling our vision to build healthier lives and stronger communities through the transformative power of running.
                </p>
                <p className="text-lg">
                  Your participation benefits 320 TC's free youth and community programs, including:
                </p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center">
                    <span className="text-wingo-500 mr-2">•</span>
                    <span>Rising DAISY Runners</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-wingo-500 mr-2">•</span>
                    <span>The 320 Community Track Club</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  All event information is subject to change.
                </p>
              </div>
            </section>

            {/* Location Section */}
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

            {/* Prize Pool Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Prize Pool</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-4xl">🥇</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1st Place</h3>
                  <p className="text-2xl font-bold text-wingo-600">$WINGO Prize</p>
                  <p className="text-gray-600 mt-2">+ Championship Trophy</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">🥈</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2nd Place</h3>
                  <p className="text-2xl font-bold text-wingo-600">$WINGO Prize</p>
                  <p className="text-gray-600 mt-2">+ Silver Medal</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-4xl">🥉</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3rd Place</h3>
                  <p className="text-2xl font-bold text-wingo-600">$WINGO Prize</p>
                  <p className="text-gray-600 mt-2">+ Bronze Medal</p>
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="relative inline-block group">
                  <p className="text-lg text-gray-600">
                    All prizes will be distributed in <span className="text-wingo-600 font-medium cursor-help">$WINGO</span> tokens
                  </p>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <p className="mb-2"><strong>$WINGO</strong> is our community token that can be:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Earned by running on the track</li>
                      <li>Used to register for future events</li>
                      <li>Traded with other community members</li>
                      <li>Converted to other assets</li>
                    </ul>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration Form */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 text-wingo-600">Race Registration</h2>
              {!isRegistering ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Ready to join the Wingate Invitational? Click below to start your registration.
                  </p>
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="w-full bg-wingo-600 text-white px-4 py-2 rounded-md hover:bg-wingo-700 transition-colors"
                  >
                    Register Now
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="stravaId" className="block text-sm font-medium text-gray-700">
                      Strava ID (Optional)
                    </label>
                    <input
                      type="text"
                      id="stravaId"
                      name="stravaId"
                      value={formData.stravaId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expectedPace" className="block text-sm font-medium text-gray-700">
                      Expected Pace (minutes per mile)
                    </label>
                    <input
                      type="text"
                      id="expectedPace"
                      name="expectedPace"
                      value={formData.expectedPace}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 8:30"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Activity Proof
                    </label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="strava"
                          name="activityType"
                          value="strava"
                          checked={formData.activityType === 'strava'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-wingo-600 focus:ring-wingo-500 border-gray-300"
                        />
                        <label htmlFor="strava" className="ml-2 block text-sm text-gray-700">
                          Strava Activity
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="file"
                          name="activityType"
                          value="file"
                          checked={formData.activityType === 'file'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-wingo-600 focus:ring-wingo-500 border-gray-300"
                        />
                        <label htmlFor="file" className="ml-2 block text-sm text-gray-700">
                          Upload File
                        </label>
                      </div>
                    </div>
                  </div>

                  {formData.activityType === 'file' && (
                    <div>
                      <label htmlFor="activityProof" className="block text-sm font-medium text-gray-700">
                        Upload Activity File
                      </label>
                      <input
                        type="file"
                        id="activityProof"
                        name="activityProof"
                        onChange={handleInputChange}
                        className="mt-1 block w-full"
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-wingo-600 text-white px-4 py-2 rounded-md hover:bg-wingo-700 transition-colors"
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