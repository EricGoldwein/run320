import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from './types';
import { authService } from './services/auth';
import Navbar from './components/navbar';
import Home from './components/home';
import Login from './components/login';
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
import Events from './pages/events';

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
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/wallet" />} />
            <Route path="/register" element={!user ? <Register onRegister={setUser} /> : <Navigate to="/wallet" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/wallet" element={user ? <Wallet user={user} /> : <Navigate to="/login" />} />
            <Route path="/mine" element={user ? <MineWingo user={user} onMineWingo={(amount) => {
              setUser(prev => prev ? { ...prev, wingo_balance: prev.wingo_balance + amount } : null);
            }} /> : <Navigate to="/login" />} />
            <Route path="/ledger" element={user ? <Ledger user={user} /> : <Navigate to="/login" />} />
            <Route path="/wager" element={user ? <Wager user={user} /> : <Navigate to="/login" />} />
            <Route path="/create-bet" element={user ? <CreateBet user={user} onCreateBet={() => {}} /> : <Navigate to="/login" />} />
            <Route path="/bet-board" element={user ? <BetBoard user={user} bets={[]} onAcceptBet={() => {}} /> : <Navigate to="/login" />} />
            <Route path="/wingate-invitational" element={user ? <WingateInvitational user={user} /> : <Navigate to="/login" />} />
            <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 