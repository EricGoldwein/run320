import React, { useState } from 'react';
import type { User } from '../types/bet';

interface MineWingoProps {
  user: User;
  onMineWingo: (amount: number) => void;
}

interface StravaCredentials {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}

interface SubmissionData {
  link: string;
  files: File[];
  context: string;
  wingos: number;
}

export default function MineWingo({ user, onMineWingo }: MineWingoProps) {
  const [stravaCredentials, setStravaCredentials] = useState<StravaCredentials>({
    clientId: '',
    clientSecret: '',
    accessToken: '',
    refreshToken: ''
  });
  const [miningMethod, setMiningMethod] = useState<'flexible' | 'strava'>('flexible');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDecimalPopup, setShowDecimalPopup] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [submissionData, setSubmissionData] = useState<SubmissionData>({
    link: '',
    files: [],
    context: '',
    wingos: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let response;
      if (miningMethod === 'strava') {
        response = await fetch('http://localhost:3001/api/mine-wingo/strava', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            credentials: stravaCredentials,
            dateRange
          })
        });
      } else {
        const formData = new FormData();
        if (submissionData.link) {
          formData.append('link', submissionData.link);
        }
        submissionData.files.forEach((file, index) => {
          formData.append(`files`, file);
        });
        if (submissionData.context) {
          formData.append('context', submissionData.context);
        }
        formData.append('wingos', submissionData.wingos.toString());
        response = await fetch('http://localhost:3001/api/mine-wingo/submit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
      }

      if (!response?.ok) {
        let errorMessage = 'Failed to submit to DAISY™';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
        if (data.wingoAmount) {
          onMineWingo(data.wingoAmount);
        }
      } catch (e) {
        // If response is not JSON but request was successful, just show success message
        console.log('Submission successful');
      }
      
      setSuccess('Successfully submitted to DAISY™ for verification!');
      // Clear the form
      setSubmissionData({
        link: '',
        files: [],
        context: '',
        wingos: 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit to DAISY™. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSubmissionData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setSubmissionData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleWingoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes('.')) {
      setError('DAISY™ doesn\'t do decimals');
      e.target.value = value.replace('.', ''); // Remove the decimal point
      return;
    }
    setError('');
    setSubmissionData(prev => ({ ...prev, wingos: Math.floor(parseInt(value) || 0) }));
  };

  const handleWingoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.') {
      e.preventDefault();
      setShowDecimalPopup(true);
      setTimeout(() => setShowDecimalPopup(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {showDecimalPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-wingo-600 rounded-lg shadow-lg p-4 animate-fade-in-out">
            <div className="flex items-center">
              <span className="text-wingo-600 font-medium">DAISY™ doesn't do decimals</span>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-4xl font-bold text-gray-900">Balance: {user.wingo_balance.toLocaleString()} <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span></span>
        </div>
        <p className="text-gray-600">Complete <a href="https://www.strava.com/segments/39307521" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700 underline">Wingate Track segments</a> to mine <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>. Each Wingo = 1 <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span></p>
        {user.id === 'guest' && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're viewing as a guest. <a href="/login" className="font-medium underline text-yellow-700 hover:text-yellow-600">Log in</a> or <a href="/register" className="font-medium underline text-yellow-700 hover:text-yellow-600">register</a> to save your WINGO balance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMiningMethod('flexible')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${
              miningMethod === 'flexible'
                ? 'bg-wingo-600 text-white border-wingo-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Submit Activity
          </button>
          <button
            onClick={() => setMiningMethod('strava')}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${
              miningMethod === 'strava'
                ? 'bg-wingo-600 text-white border-wingo-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Sync with Coach DAISY™
          </button>
        </div>

        {miningMethod === 'flexible' && (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <label htmlFor="wingos" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                  <span className="text-gray-900">Wingo</span>s Completed
                </label>
                <input
                  type="number"
                  id="wingos"
                  min="0"
                  step="1"
                  value={submissionData.wingos || ''}
                  onChange={handleWingoChange}
                  onKeyDown={handleWingoKeyDown}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  required
                />
              </div>

              <div>
                <label htmlFor="activityLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Link
                </label>
                <input
                  type="url"
                  id="activityLink"
                  value={submissionData.link}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, link: e.target.value }))}
                  className="block w-96 rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm pl-3 pr-2 py-2 border-2 transition-colors duration-200"
                  placeholder="https://www.strava.com/activities/..."
                />
              </div>

              <div>
                <label htmlFor="activityFiles" className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt(s)
                </label>
                <input
                  type="file"
                  id="activityFiles"
                  accept=".gpx,image/*"
                  onChange={handleFileChange}
                  multiple
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-wingo-50 file:text-wingo-700
                    hover:file:bg-wingo-100
                    transition-colors duration-200"
                />
                <p className="mt-1 text-sm text-gray-500">GPX or screenshots (optional)</p>
                
                {submissionData.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {submissionData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">
                  Say More (optional)
                </label>
                <textarea
                  id="context"
                  value={submissionData.context}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, context: e.target.value }))}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm pl-3 pr-2 py-2 border-2 transition-colors duration-200"
                  placeholder="Tell DAISY™ about your Wingos..."
                />
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500 disabled:opacity-50 transition-all duration-200"
                >
                  {isLoading ? 'Submitting...' : 'Send to Coach DAISY™ for review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {miningMethod === 'strava' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Record WINGOs automatically via Strava API</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Sync your Strava account with Coach DAISY™ and <span className="inline-flex items-baseline">
            <span className="text-[#E6C200] font-bold">W</span>
            <span>INGO</span>
          </span>s will be automatically uploaded to your account.</p>
                    <ol className="list-decimal list-inside space-y-2 mt-2">
                      <li>Go to <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Strava API Settings</a></li>
                      <li>Create a new application or use an existing one</li>
                      <li>Copy your Client ID, Client Secret, Access Token, and Refresh Token</li>
                      <li>Note: Strava Premium required for DAISY™ data share</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pl-2">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    id="clientId"
                    value={stravaCredentials.clientId}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-350 rounded-md focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700 mb-1">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    id="clientSecret"
                    value={stravaCredentials.clientSecret}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-350 rounded-md focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700 mb-1">
                    Access Token
                  </label>
                  <input
                    type="text"
                    id="accessToken"
                    value={stravaCredentials.accessToken}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-350 rounded-md focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="refreshToken" className="block text-sm font-medium text-gray-700 mb-1">
                    Refresh Token
                  </label>
                  <input
                    type="text"
                    id="refreshToken"
                    value={stravaCredentials.refreshToken}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, refreshToken: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-350 rounded-md focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pl-2">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-350 rounded-md focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border-2 border-gray-350 rounded-md focus:outline-none focus:ring-2 focus:ring-wingo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
              >
                {isLoading ? 'Submitting...' : 'Authorize DAISY™ WINGO Surveillance'}
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 