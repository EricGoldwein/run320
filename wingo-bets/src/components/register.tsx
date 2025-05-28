import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { User } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    strava_activity_url: '',
    wingo_receipts: [] as File[]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, wingo_receipts: [...prev.wingo_receipts, ...files] }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      wingo_receipts: prev.wingo_receipts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // First register the user
      const { user, token } = await register(
        formData.email,
        formData.password,
        formData.username,
        formData.full_name
      );
      
      // Store the token
      localStorage.setItem('token', token);
      
      // Then upload any WINGO receipts if provided
      if (formData.strava_activity_url || formData.wingo_receipts.length > 0) {
        const uploadData = new FormData();
        if (formData.strava_activity_url) {
          uploadData.append('strava_activity_url', formData.strava_activity_url);
        }
        formData.wingo_receipts.forEach((file, index) => {
          uploadData.append(`wingo_receipt_${index}`, file);
        });

        const uploadResponse = await fetch('http://127.0.0.1:3001/upload-wingo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadData
        });

        if (!uploadResponse.ok) {
          console.error('Failed to upload WINGO receipts');
        }
      }
      
      // Update user state first
      onRegister(user);
      setSuccess(true);
      
      // Then navigate after a short delay
      setTimeout(() => {
        navigate('/wallet');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Registration successful!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    We've sent a welcome email to {formData.email}. Check your inbox for next steps.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <p className="text-sm text-green-700">
                      Redirecting to home page...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register for 320 Track Club
          </h2>
          <p className="text-gray-600">
            Requires 10{' '}
            <span className="inline-flex items-center">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span> to join
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/login" className="font-medium text-wingo-600 hover:text-wingo-500">
              sign in to your existing account
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right Column - WINGO Receipts */}
            <div className="space-y-4">
              <div>
                <label htmlFor="strava_activity_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity URL
                </label>
                <input
                  id="strava_activity_url"
                  name="strava_activity_url"
                  type="url"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                  placeholder="https://www.strava.com/activities/..."
                  value={formData.strava_activity_url}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="wingo_receipts" className="block text-sm font-medium text-gray-700 mb-1">
                  WINGO Receipts
                </label>
                <div className="relative">
                  <input
                    id="wingo_receipts"
                    name="wingo_receipts"
                    type="file"
                    accept="image/*,.gpx"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('wingo_receipts')?.click()}
                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors duration-150 text-left"
                  >
                    Upload File(s)
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  (GPX, Screenshot, etc.)
                </p>
                {formData.wingo_receipts.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.wingo_receipts.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-600 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Registering...' : 'Find Your Kick'}
            </button>
            <a 
              href="/faq" 
              className="mt-4 text-sm text-wingo-600 hover:text-wingo-500 block text-center"
            >
              WTF is{' '}
              <span className="inline-flex items-center">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>?
            </a>
            <p className="mt-2 text-sm text-gray-500 text-center">
              <span className="text-red-500">*</span> Must submit either activity URL or proof of WINGO
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 