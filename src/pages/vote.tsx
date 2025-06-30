import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWingoBalance } from '../contexts/WingoBalanceContext';

interface VoteOption {
  id: string;
  title: string;
  description: string;
  votes: number;
  imageUrl?: string;
  cost: number; // Cost in WINGO tokens
  endDate: string;
  hasVoted?: boolean;
}

type VoteState = {
  [voteId: string]: {
    choice: 'hay' | 'neigh' | null;
    amount: number;
  }
};

const Vote: React.FC = () => {
  const { user } = useAuth();
  const { wingoBalance, refreshBalance } = useWingoBalance();
  const navigate = useNavigate();
  const [activeVotes, setActiveVotes] = useState<VoteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingInProgress, setVotingInProgress] = useState<string | null>(null);
  const [voteState, setVoteState] = useState<VoteState>({});

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);
        // Mock data for now
        setActiveVotes([
          {
            id: '1',
            title: 'Wingo Website',
            description: 'Change website to Wingo320',
            votes: 150,
            imageUrl: '/wingate1.jpg',
            cost: 10,
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            hasVoted: false
          },
          {
            id: '2',
            title: 'Featured Athlete',
            description: 'Choose the next featured athlete',
            votes: 89,
            imageUrl: '/wingatebw1.jpg',
            cost: 5,
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            hasVoted: false
          }
        ]);
      } catch (err) {
        setError('Failed to load votes');
        console.error('Error fetching votes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  useEffect(() => {
    setVoteState((prev) => {
      const newState = { ...prev };
      activeVotes.forEach(vote => {
        if (!newState[vote.id]) {
          newState[vote.id] = {
            choice: null,
            amount: wingoBalance
          };
        }
      });
      return newState;
    });
  }, [activeVotes, wingoBalance]);

  const handleVote = async (voteId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const vote = activeVotes.find(v => v.id === voteId);
    if (!vote) return;

    if (wingoBalance < vote.cost) {
      setError(`Insufficient WINGO balance. You need ${vote.cost} WINGO to vote.`);
      return;
    }

    try {
      setVotingInProgress(voteId);
      setError(null);

      // Submit vote and deduct WINGO tokens
      const response = await fetch('http://localhost:3001/api/votes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          voteId,
          cost: vote.cost,
          votingPower: wingoBalance // Send current balance to calculate voting power
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit vote');
      }

      const data = await response.json();

      // Update local state with new vote count and user's vote status
      setActiveVotes(prev => prev.map(v => 
        v.id === voteId 
          ? { 
              ...v, 
              votes: data.newVoteCount,
              hasVoted: true 
            }
          : v
      ));

      // Refresh WINGO balance after successful vote
      await refreshBalance();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote');
      console.error('Error submitting vote:', err);
    } finally {
      setVotingInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wingo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading votes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            1 <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>, 1 Vote
          </h1>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <p className="text-lg text-gray-600">
              <span className="inline-flex items-baseline">
                <span>WINGO</span></span> World is a democracy. Sort of. All 320 Track Club members have voting rights, so long as they hold <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>.
            </p>
            <p className="text-lg text-gray-600">
              Your voting power is proportional to your <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> balance.
            </p>
            <p className="text-lg text-gray-600">
              If you hold 4% of all verified <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> in circulation, your vote counts for 4%. The current <Link to="/ledger" className="text-wingo-600 hover:text-wingo-700">ledger</Link> determines total supply and individual holdings. There are no caps, no delegation, and no pooling. Your balance is your influence.
            </p>
            <p className="text-lg text-gray-600">
              Membership (10 <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
              </span>) is the only threshold. Once in, your voice scales with your loops (and your wagers).
            </p>
            <p className="text-lg text-gray-600">
              <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span> has no price, no market, and no prestige — but it does determine who shapes what little there is to shape.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 my-12"></div>

        {/* DAISY Section as a visually distinct aside */}
        <aside className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl shadow-sm p-8 my-8 italic">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 not-italic">
            The horse in the room...
          </h2>
          <div className="space-y-6 text-gray-700">
            <p>
              Coach DAISY™ holds <span className="inline-flex items-baseline">
                <span className="text-[#E6C200] font-bold">W</span>
                <span>INGO</span>
              </span>, oversees verification, and maintains the ledger. But she cannot vote.
            </p>
            <p>
              It's... complicated. As a Centairenarian — part horse, part algorithm, fully unbeholden to legal personhood — she exists outside the framework she maintains.
            </p>
            <p>
              Whether that's a justified safeguard or a quiet injustice is... not up for a vote. At least not yet.
            </p>
          </div>
        </aside>

        <div className="border-t border-gray-200 my-12"></div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Active Votes
          </h2>
          <p className="text-lg text-gray-600">
            Your Balance: {wingoBalance} <span className="inline-flex items-baseline">
              <span className="text-[#E6C200] font-bold">W</span>
              <span>INGO</span>
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeVotes.map((vote) => (
            <div key={vote.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={vote.imageUrl}
                alt={vote.title}
                className="w-full h-40 object-cover rounded mb-4 bg-gray-200"
                onError={e => { e.currentTarget.src = 'https://placehold.co/600x200?text=No+Image'; }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{vote.title}</h3>
                <p className="text-gray-600 mb-4">{vote.description}</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`vote-${vote.id}`}
                        value="hay"
                        checked={voteState[vote.id]?.choice === 'hay'}
                        onChange={() => setVoteState(s => ({ ...s, [vote.id]: { ...s[vote.id], choice: 'hay' } }))}
                        className="form-radio h-4 w-4 text-wingo-600"
                        disabled={vote.hasVoted}
                      />
                      <span className="ml-2">Hay</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`vote-${vote.id}`}
                        value="neigh"
                        checked={voteState[vote.id]?.choice === 'neigh'}
                        onChange={() => setVoteState(s => ({ ...s, [vote.id]: { ...s[vote.id], choice: 'neigh' } }))}
                        className="form-radio h-4 w-4 text-wingo-600"
                        disabled={vote.hasVoted}
                      />
                      <span className="ml-2">Neigh</span>
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vote Amount (WINGO)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={wingoBalance}
                      value={voteState[vote.id]?.amount ?? wingoBalance}
                      onChange={e => setVoteState(s => ({ ...s, [vote.id]: { ...s[vote.id], amount: Number(e.target.value) } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-wingo-500 focus:border-wingo-500"
                      disabled={vote.hasVoted}
                    />
                  </div>
                  <button
                    onClick={() => handleVote(vote.id)}
                    disabled={
                      votingInProgress === vote.id ||
                      vote.hasVoted ||
                      !voteState[vote.id]?.choice ||
                      voteState[vote.id]?.amount <= 0 ||
                      voteState[vote.id]?.amount > wingoBalance
                    }
                    className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                      ${vote.hasVoted 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : !voteState[vote.id]?.choice || voteState[vote.id]?.amount <= 0 || voteState[vote.id]?.amount > wingoBalance
                          ? 'bg-red-500 cursor-not-allowed'
                          : 'bg-wingo-600 hover:bg-wingo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wingo-500'
                      }`}
                  >
                    {votingInProgress === vote.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : vote.hasVoted ? (
                      'Voted'
                    ) : !voteState[vote.id]?.choice ? (
                      'Select Vote'
                    ) : voteState[vote.id]?.amount <= 0 || voteState[vote.id]?.amount > wingoBalance ? (
                      'Invalid Amount'
                    ) : (
                      'Vote'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vote; 