import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [wingoOpen, setWingoOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();

  const handleWingoClick = () => {
    setWingoOpen(!wingoOpen);
    setUserOpen(false);
  };

  const handleUserClick = () => {
    setUserOpen(!userOpen);
    setWingoOpen(false);
  };

  const handleNavigation = (path: string) => {
    setWingoOpen(false);
    setUserOpen(false);
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-wingo-600">$WINGO</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to={user ? "/events" : "/login"} 
              className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Events
            </Link>
            <Link 
              to="/faq" 
              className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              FAQ
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={handleWingoClick}
                  className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  $WINGO
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {wingoOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => handleNavigation('/mine')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mine
                    </button>
                    <button
                      onClick={() => handleNavigation('/ledger')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Ledger
                    </button>
                    <button
                      onClick={() => handleNavigation('/wager')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Wager
                    </button>
                  </div>
                )}
              </div>
            ) : null}
            {user ? (
              <div className="relative">
                <button
                  onClick={handleUserClick}
                  className="flex items-center space-x-2 bg-wingo-50 px-3 py-1.5 rounded-full hover:bg-wingo-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-wingo-600 font-medium">{user.wingo_balance}</span>
                    <span className="text-wingo-600 font-bold">$WINGO</span>
                  </div>
                  <span className="text-gray-600 mx-2">•</span>
                  <span className="text-gray-600">{user.username}</span>
                  <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => handleNavigation('/wallet')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Wallet
                    </button>
                    <button
                      onClick={onLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-wingo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-wingo-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 