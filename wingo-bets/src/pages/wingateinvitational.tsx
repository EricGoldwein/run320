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
          {/* Old Balance Logo - Moved to right side */}
          <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <a href="/old-balance">
              <img
                className="h-full w-full object-cover"
                src="/old_balance.png"
                alt="Old Balance"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Old Balance Logo */}
        <div className="lg:hidden mb-8">
          <a href="/old-balance">
            <img
              className="w-full h-64 object-cover object-center"
              src="/old_balance.png"
              alt="Old Balance"
              style={{ objectPosition: 'center 20%' }}
            />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {/* Event Details */}
          <div className="space-y-8">
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
                  <a href="sms:9299254744" className="text-wingo-600 hover:text-wingo-700 font-bold">Message Coach DAISY™</a> (929-WAK-GRIG) to experience the OBWI.
                </p>
                <p className="text-lg">
                  All <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span> unlocked at the gate will be reallocated to top finishers. Additional <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span> may be gained — or forfeited — through the <a href="/wager" className="text-wingo-600 hover:text-wingo-700">WINGO Wager Market</a>.
                </p>
              </div>
            </section>

            {/* Location Section */}
            <section className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 transform hover:scale-[1.02] transition-transform duration-200">
              <h2 className="text-3xl font-bold mb-6 text-wingo-600">Location</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=40.658941671401536,-73.94705262370852&zoom=18&maptype=satellite"
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
        </div>
      </div>
    </div>
  );
};

export default WingateInvitational; 