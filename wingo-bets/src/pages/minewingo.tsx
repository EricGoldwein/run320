import React, { useState } from 'react';
import { User } from '../types/bet';

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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{user.username}'s $WINGO Mining</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-4xl font-bold text-wingo-600">Balance: {user.wingo_balance.toLocaleString()} $WINGO</span>
        </div>
        <p className="text-gray-600">Complete <a href="https://www.strava.com/segments/7831001" target="_blank" rel="noopener noreferrer" className="text-wingo-600 hover:text-wingo-700 underline">Wingate Track segments</a> to mine $WINGO. Each lap = 1 $WINGO</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setMiningMethod('flexible')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              miningMethod === 'flexible'
                ? 'bg-wingo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Submit Activity
          </button>
          <button
            onClick={() => setMiningMethod('strava')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              miningMethod === 'strava'
                ? 'bg-wingo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Strava API
          </button>
        </div>

        {miningMethod === 'flexible' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Submit to DAISY™</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Share activity with DAISY™ for verification.</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Link to activity (Strava or other platform)</li>
                      <li>Upload file (GPX, image, and/or other proof)</li>
                      <li>WINGOs completed*</li>
                      <li>Additional context about your run (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="wingos" className="block text-sm font-medium text-gray-700">
                  WINGOs Completed
                </label>
                <input
                  type="number"
                  id="wingos"
                  min="0"
                  step="1"
                  value={submissionData.wingos}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, wingos: Math.floor(parseInt(e.target.value) || 0) }))}
                  className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">Total WINGOs completed in this activity</p>
              </div>

              <div>
                <label htmlFor="activityLink" className="block text-sm font-medium text-gray-700">
                  Activity Link (optional)
                </label>
                <input
                  type="url"
                  id="activityLink"
                  value={submissionData.link}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, link: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                  placeholder="https://www.strava.com/activities/..."
                />
              </div>

              <div>
                <label htmlFor="activityFiles" className="block text-sm font-medium text-gray-700">
                  Upload Files (optional)
                </label>
                <input
                  type="file"
                  id="activityFiles"
                  accept=".gpx,image/*"
                  onChange={handleFileChange}
                  multiple
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-wingo-50 file:text-wingo-700
                    hover:file:bg-wingo-100"
                />
                <p className="mt-1 text-sm text-gray-500">Upload GPX files or images of your activity</p>
                
                {submissionData.files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {submissionData.files.map((file, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                              {file.type.startsWith('image/') && (
                                <div className="mt-2">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="max-h-32 rounded-md object-cover"
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="ml-4 flex-shrink-0 text-red-600 hover:text-red-800"
                            >
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700">
                  Context (optional)
                </label>
                <textarea
                  id="context"
                  value={submissionData.context}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, context: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                  placeholder="Tell us about your run..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
              >
                {isLoading ? 'Submitting...' : 'Submit to DAISY™'}
              </button>
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
                  <h3 className="text-sm font-medium text-blue-800">Submit via Strava API</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Submit your Strava activities directly to DAISY™ for verification. Your activities will be automatically checked for WINGO runs.</p>
                    <ol className="list-decimal list-inside space-y-2 mt-2">
                      <li>Go to <a href="https://www.strava.com/settings/api" target="_blank" rel="noopener noreferrer" className="underline">Strava API Settings</a></li>
                      <li>Log in to your Strava account</li>
                      <li>Create a new application or use an existing one</li>
                      <li>Copy your Client ID, Client Secret, Access Token, and Refresh Token</li>
                      <li>Note: You need a Strava Premium subscription to access segment data</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <input
                    type="text"
                    id="clientId"
                    value={stravaCredentials.clientId}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, clientId: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">
                    Client Secret
                  </label>
                  <input
                    type="text"
                    id="clientSecret"
                    value={stravaCredentials.clientSecret}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, clientSecret: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
                    Access Token
                  </label>
                  <input
                    type="text"
                    id="accessToken"
                    value={stravaCredentials.accessToken}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, accessToken: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="refreshToken" className="block text-sm font-medium text-gray-700">
                    Refresh Token
                  </label>
                  <input
                    type="text"
                    id="refreshToken"
                    value={stravaCredentials.refreshToken}
                    onChange={(e) => setStravaCredentials(prev => ({ ...prev, refreshToken: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
              >
                {isLoading ? 'Submitting...' : 'Submit to DAISY™'}
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