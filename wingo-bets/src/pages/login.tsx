import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import type { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onLogin(response.user);
      navigate('/ledger');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/register" className="font-medium text-wingo-600 hover:text-wingo-500">
              create account
            </a>
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-700">
              Account services not yet active. <a href="sms:9299254744" className="font-medium underline text-yellow-700 hover:text-yellow-600">Text DAISY</a> to join the 320 Track Club and <button onClick={() => {
                onLogin({
                  id: 'guest',
                  email: '',
                  username: 'Guest',
                  name: 'Guest User',
                  wingo_balance: 0,
                  total_wingos: 0,
                  created_at: new Date().toISOString(),
                  last_activity: new Date().toISOString(),
                  balance: 0,
                  isActive: true,
                  createdAt: new Date()
                });
                navigate('/ledger');
              }} className="font-medium underline text-yellow-700 hover:text-yellow-600">continue as guest</button> to explore Wingo World.
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-wingo-500 focus:border-wingo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-wingo-600 hover:text-wingo-500">
                  Forgot password?
                </a>
              </div>
              <div className="text-sm">
                <a href="/register" className="font-medium text-wingo-600 hover:text-wingo-500">
                  Create account
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onLogin({
                  id: 'guest',
                  email: '',
                  username: 'Guest',
                  name: 'Guest User',
                  wingo_balance: 0,
                  total_wingos: 0,
                  created_at: new Date().toISOString(),
                  last_activity: new Date().toISOString(),
                  balance: 0,
                  isActive: true,
                  createdAt: new Date()
                });
                navigate('/ledger');
              }}
              className="w-full py-2 px-4 border-2 border-wingo-600 text-wingo-600 rounded-md text-sm font-medium hover:bg-wingo-50 transition-colors"
            >
              Continue as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 