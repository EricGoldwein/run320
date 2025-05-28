import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const wingoRef = useRef<HTMLDivElement>(null);
  const daisyRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (activeDropdown === 'wingo' && wingoRef.current && !wingoRef.current.contains(target)) {
        setActiveDropdown(null);
      } else if (activeDropdown === 'daisy' && daisyRef.current && !daisyRef.current.contains(target)) {
        setActiveDropdown(null);
      } else if (activeDropdown === 'user' && userRef.current && !userRef.current.contains(target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleNavigation = (path: string) => {
    setActiveDropdown(null);
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/favicon.ico" alt="Daisy" className="w-8 h-8 rounded-full" />
              <div className="flex flex-col items-start">
                <span className="text-2xl font-bold text-wingo-600">WINGO World</span>
                <span className="text-[8px] text-gray-500 ml-1">A 320 Track Club Experience</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={wingoRef}>
                <button
                  onClick={() => handleDropdownClick('wingo')}
                  className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <span className="inline-flex items-center">
                    <span className="text-[#E6C200] font-bold">W</span>
                    <span>INGO</span>
                  </span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'wingo' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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
            <Link 
              to={user ? "/events" : "/login"} 
              className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Experiences
            </Link>
            <div className="relative" ref={daisyRef}>
              <button
                onClick={() => handleDropdownClick('daisy')}
                className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                D<span className="text-[#00bcd4]">AI</span>SY™
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'daisy' && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => handleNavigation('/converter')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Converter
                  </button>
                  <button
                    onClick={() => handleNavigation('/vdot-times')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Race & Pace Tables
                  </button>
                </div>
              )}
            </div>
            <Link 
              to="/faq" 
              className="text-gray-600 hover:text-wingo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              RAQ
            </Link>
            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => handleDropdownClick('user')}
                  className="flex items-center space-x-2 bg-wingo-50 px-3 py-1.5 rounded-full hover:bg-wingo-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">{user.wingo_balance}</span>
                    <span className="inline-flex items-center">
                      <span className="text-[#E6C200] font-bold">W</span>
                      <span>INGO</span>
                    </span>
                  </div>
                  <span className="text-gray-600 mx-2">•</span>
                  <span className="text-gray-600">{user.username}</span>
                  <svg className="w-4 h-4 ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeDropdown === 'user' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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