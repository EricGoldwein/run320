import React, { useState } from 'react';
import { User, BetType, Bet } from '../types/bet';
import { useNavigate } from 'react-router-dom';

interface CreateBetProps {
  user: User;
  onCreateBet: (bet: Omit<Bet, 'id' | 'status' | 'createdAt' | 'participants'>) => void;
}

export default function CreateBet({ user, onCreateBet }: CreateBetProps) {
  const navigate = useNavigate();
  const [betType, setBetType] = useState<BetType>('time');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [odds, setOdds] = useState(-110);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount > user.wingo_balance) {
      setError(`You can't bet more than your current balance of ${user.wingo_balance.toLocaleString()} $WINGO`);
      return;
    }

    const newBet = {
      type: betType,
      title,
      description,
      creator: user,
      amount,
      odds,
      expiresAt: eventDate ? new Date(eventDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now if no date
      event: {
        name: eventName,
        date: eventDate ? new Date(eventDate) : undefined,
        location: eventLocation,
      },
      conditions: betType === 'time' ? [
        {
          type: 'time' as const,
          value: timeValue,
          comparison: 'under' as const,
        },
      ] : [],
    };

    onCreateBet(newBet);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Bet</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setBetType('time')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  betType === 'time'
                    ? 'bg-wingo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Time Bet
              </button>
              <button
                type="button"
                onClick={() => setBetType('matchup')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  betType === 'matchup'
                    ? 'bg-wingo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Matchup
              </button>
              <button
                type="button"
                onClick={() => setBetType('parlay')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  betType === 'parlay'
                    ? 'bg-wingo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Parlay
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
              placeholder="e.g., Dave vs 3:10:00"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
              placeholder="e.g., Will Dave break 3:10:00 in Copenhagen?"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Bet Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="amount"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0"
                  max={user.wingo_balance}
                  className="block w-32 rounded-md border-gray-300 pr-12 focus:border-wingo-500 focus:ring-wingo-500 sm:text-sm bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter amount"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$WINGO</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Available balance: {user.wingo_balance.toLocaleString()} $WINGO
            </p>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                placeholder="e.g., Copenhagen Marathon"
                required
              />
            </div>
            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                Event Date (Optional)
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
              Event Location (Optional)
            </label>
            <input
              type="text"
              id="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
              placeholder="e.g., Copenhagen, Denmark"
            />
          </div>

          {betType === 'time' && (
            <div>
              <label htmlFor="timeValue" className="block text-sm font-medium text-gray-700 mb-2">
                Target Time
              </label>
              <input
                type="text"
                id="timeValue"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                placeholder="e.g., 3:10:00"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              Create Bet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 