import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from './types';
import { authService } from './services/auth';
import { AuthProvider } from './contexts/AuthContext';
import { WingoBalanceProvider } from './contexts/WingoBalanceContext';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import Home from './pages/home';
import Login from './pages/login';
import Register from './components/register';
import { ForgotPassword } from './components/forgot-password';
import ResetPassword from './components/reset-password';
import Wallet from './components/wallet';
import MineWingo from './pages/minewingo';
import Ledger from './pages/ledger';
import Wager from './pages/wager';
import CreateBet from './pages/createbet';
import BetBoard from './pages/betboard';
import WingateInvitational from './pages/wingateinvitational';
import FAQ from './pages/faq';
import Experience from './pages/experience';
import WingoConverter from './components/WingoConverter';
import VDOTTimes from './pages/vdot-times';
import WingoWednesday from './pages/wingo-wednesday';
import Vote from './pages/vote';
import DaisyMath from './pages/daisy_math';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then((userData: User) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AuthProvider>
        <WingoBalanceProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/wallet" />} />
                <Route path="/register" element={!user ? <Register onRegister={setUser} /> : <Navigate to="/wallet" />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/wallet" element={user ? <Wallet user={user} /> : <Navigate to="/login" />} />
                <Route path="/mine" element={<MineWingo user={user || {
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
                }} onMineWingo={(amount) => {
                  if (user) {
                    setUser(prev => prev ? { ...prev, wingo_balance: prev.wingo_balance + amount } : null);
                  }
                }} />} />
                <Route path="/ledger" element={<Ledger user={user || {
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
                }} />} />
                <Route path="/wager" element={<Wager user={user || {
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
                }} />} />
                <Route path="/vote" element={user ? <Vote /> : <Navigate to="/login" />} />
                <Route path="/create-bet" element={user ? <CreateBet user={user} onCreateBet={() => {}} /> : <Navigate to="/login" />} />
                <Route path="/bet-board" element={user ? <BetBoard user={user} bets={[]} onAcceptBet={() => {}} /> : <Navigate to="/login" />} />
                <Route path="/wingate-invitational" element={user ? <WingateInvitational user={user} /> : <Navigate to="/login" />} />
                <Route path="/experience" element={user ? <Experience /> : <Navigate to="/login" />} />
                <Route path="/wingo-wednesday" element={<WingoWednesday />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/converter" element={<WingoConverter />} />
                <Route path="/vdot-paces" element={<VDOTTimes initialView="pace" user={user} />} />
                <Route path="/vdot-times" element={<VDOTTimes initialView="race" user={user} />} />
                <Route path="/daisy_math" element={<DaisyMath />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </WingoBalanceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 