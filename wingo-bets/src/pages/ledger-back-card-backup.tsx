// Backup of the back card implementation for the avatar modal
// This contains the baseball card style back side that can be implemented later

import React from 'react';

export const AvatarModalBackCard = ({ 
  selectedAvatar, 
  leaderboardData, 
  logEntries, 
  setShowAvatarModal, 
  getGearQuote, 
  format 
}: {
  selectedAvatar: {username: string, avatarUrl: string, balance: number, totalMined: number, distance: number, rank: number} | null;
  leaderboardData: any[];
  logEntries: any[];
  setShowAvatarModal: (show: boolean) => void;
  getGearQuote: (username: string) => {gear: string, quote: string};
  format: (date: Date, format: string) => string;
}) => {
  if (!selectedAvatar) return null;
  
  const userRansactions = logEntries.filter(e => e.username === selectedAvatar.username);
  const cardHeight = userRansactions.length < 3 ? 'h-[400px]' : 'h-[464px]';
  
  return (
    <div className={`rounded-xl shadow-2xl max-w-sm w-full ${cardHeight} overflow-hidden border-4 border-[#E6C200] relative flex flex-col`}
      style={{
        background: 'radial-gradient(ellipse at 60% 0%, #232323 60%, #181818 100%)',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
      }}
    >
      {/* Avatar Back Button - Top Left */}
      <button
        onClick={() => {
          const card = document.getElementById('avatarCard');
          if (card) {
            card.style.transform = 'rotateY(0deg)';
          }
        }}
        className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center p-0 z-10 bg-transparent"
        style={{
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF7A00 0%, #E65A00 40%, #FFB347 100%)',
          boxShadow: '0 0 12px 2px #FF7A0088',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Back to front"
      >
        <img
          src={selectedAvatar.avatarUrl}
          alt="Back to front"
          style={{
            width: '44px',
            height: '44px',
            objectFit: 'cover',
            objectPosition: 'center 30%',
            borderRadius: '50%',
            margin: '0 auto',
            background: '#fff',
            boxShadow: '0 1px 4px 0 #0003',
          }}
        />
      </button>
      
      {/* Close Button - Top Right */}
      <button
        onClick={() => setShowAvatarModal(false)}
        className="absolute top-4 right-4 text-white hover:text-[#E6C200] text-2xl font-bold bg-black/30 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm z-10"
        aria-label="Close"
      >
        <span className="-mt-0.5">×</span>
      </button>
      
      {/* Card Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 p-3 text-center">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          {selectedAvatar.username}
        </h3>
        <p className="text-gray-400 text-sm">320 Track Club</p>
      </div>

      {/* Stat Bar - dark, gold accent border, white text */}
      <div className="max-w-xs mx-auto rounded-lg bg-neutral-800/90 px-3 py-2 mt-2 mb-2 gap-2 text-center flex justify-between items-center text-white border border-[#E6C200]">
        <div className="flex-1">
          <div className="text-[11px] text-[#E6C200] font-medium">BALANCE</div>
          <div className="text-base font-bold text-white">{selectedAvatar.balance.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">Rank: {leaderboardData.find(e => e.user === selectedAvatar?.username)?.rank ?? '--'}</div>
        </div>
        <div className="flex-1 border-l border-[#E6C200] px-2">
          <div className="text-[11px] text-[#E6C200] font-medium">MINED</div>
          <div className="text-base font-bold text-white">{selectedAvatar.totalMined.toLocaleString()}</div>
          <div className="text-[9px] text-gray-400">({selectedAvatar.distance.toFixed(1)} km)</div>
        </div>
        <div className="flex-1 border-l border-[#E6C200] px-2">
          <div className="text-[11px] text-[#E6C200] font-medium">VOTING</div>
          <div className="text-base font-bold text-white">{leaderboardData.find(e => e.user === selectedAvatar?.username)?.votingShare?.toFixed(1) ?? '--'}%</div>
          <div className="text-[10px] text-gray-400">Share</div>
        </div>
      </div>

      {/* Card Content - fills remaining space, no scrolling */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="p-3 flex-1 overflow-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-1 max-w-xs mx-auto w-full">
            {/* Initiation */}
            <div className="bg-white/80 rounded-lg p-1.5 flex flex-col items-start border-l-4 border-[#E6C200] shadow-sm w-full">
              <div className="text-xs text-black font-medium uppercase tracking-wide mb-0.5">Initiation</div>
              <div className="text-xs font-bold text-gray-500">
                {(() => {
                  const initiationEntry = logEntries
                    .filter(e => e.username === selectedAvatar.username && e.initiation)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  return initiationEntry ? format(new Date(initiationEntry.date), 'MMM d, yyyy') : 'Unknown';
                })()}
              </div>
            </div>

            {/* Top Wingo Session */}
            <div className="bg-white/80 rounded-lg p-1.5 flex flex-col items-start border-l-4 border-[#E6C200] shadow-sm w-full">
              <div className="text-xs text-black font-medium uppercase tracking-wide mb-0.5">Top Wingo Session</div>
              <div className="text-xs font-bold text-gray-500">
                {(() => {
                  const userEntries = logEntries.filter(e => e.username === selectedAvatar.username);
                  const topEntry = userEntries.reduce((max, entry) => 
                    entry.wingoMined > max.wingoMined ? entry : max, userEntries[0]);
                  return topEntry ? 
                    `${topEntry.wingoMined} W (${format(new Date(topEntry.date), 'M/d/yy')})` : 
                    '0 W';
                })()}
              </div>
            </div>

            {/* Favorite Gear */}
            <div className="bg-white/80 rounded-lg p-1.5 flex flex-col items-start border-l-4 border-[#E6C200] shadow-sm w-full">
              <div className="text-xs text-black font-medium uppercase tracking-wide mb-0.5">Favorite Old Balance Gear</div>
              <div className="text-xs font-bold text-gray-500">{getGearQuote(selectedAvatar.username).gear}</div>
            </div>

            {/* Recent Ransactions */}
            <div className="bg-white/90 rounded-lg p-1.5 border border-[#E6C200] shadow-sm w-full">
              <div className="text-xs text-black font-medium uppercase tracking-wide">Recent Ransactions</div>
              <div className="text-xs text-gray-700 space-y-0.5">
                {userRansactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((entry, index) => (
                    <div key={index} className="flex justify-between items-center gap-1">
                      <span className="whitespace-nowrap text-[11px]">{format(new Date(entry.date), 'M/d/yy')}</span>
                      <span className="font-medium whitespace-nowrap text-[11px]">
                        {entry.wingoMined > 0 ? '+' : ''}{entry.wingoMined} W ({entry.category === 'Gate Unlock' ? 'OBWI' : `${entry.kmLogged.toFixed(2)} km`})
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* Quote at the very bottom */}
          <div className="w-full max-w-xs mx-auto mt-2">
            <div className="p-0 text-xs italic text-center" style={{ color: '#E6C200', background: 'transparent' }}>
              "{getGearQuote(selectedAvatar.username).quote}"
            </div>
          </div>
        </div>
        {/* OBWI Certified Badge - Bottom Right */}
        {logEntries.some(e => e.username === selectedAvatar.username && e.category === 'Gate Unlock') && (
          <div className="absolute bottom-2 right-4">
            <div className="bg-[#00a8b3] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-[#008ba3]">
              OBWI Certified
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 