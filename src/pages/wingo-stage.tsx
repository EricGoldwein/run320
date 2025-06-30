import React from 'react';

const tubeColor = '#ff6b35';

const WingoStage: React.FC = () => {
  // O outer tube: y=25 to y=135 (height 110), so baseline at y=135, cap at y=25
  // We'll set font-size to 110px, y=135 for baseline alignment
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a0f0a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <svg className="neon-svg" viewBox="0 0 700 200" width="90vw" height="auto" style={{ maxWidth: '700px', height: 'auto', display: 'block' }}>
        {/* W */}
        <g>
          <path className="neon-tube" d="M30,30 L50,135 L70,80 L90,135 L110,30" />
          <path className="neon-tube" d="M40,40 L55,120 L70,70 L85,120 L100,40" strokeWidth="2" />
        </g>
        {/* I */}
        <g>
          <rect className="neon-tube" x="130" y="30" width="20" height="105" rx="10" />
          <rect className="neon-tube" x="136" y="40" width="8" height="85" rx="4" strokeWidth="2" />
        </g>
        {/* N */}
        <g>
          <path className="neon-tube" d="M170,135 L170,30 L220,135 L220,30" />
          <path className="neon-tube" d="M180,120 L180,50 L210,120 L210,50" strokeWidth="2" />
        </g>
        {/* G */}
        <g>
          <path className="neon-tube" d="M250,100 A52,52 0 1,1 302,100 Q300,135 270,135 Q250,135 250,100" />
          <path className="neon-tube" d="M260,100 A40,40 0 1,1 292,100 Q291,125 270,125 Q260,125 260,100" strokeWidth="2" />
          <path className="neon-tube" d="M285,115 L302,115" />
          <path className="neon-tube" d="M285,122 L295,122" strokeWidth="2" />
        </g>
        {/* O (reverted to previous version, untouched) */}
        <g transform="translate(420, 30)">
          {/* Outer tube */}
          <rect className="neon-tube" x="5" y="25" width="60" height="110" rx="30" ry="30"/>
          {/* Inner tube (parallel) */}
          <rect className="neon-tube" x="20" y="40" width="30" height="80" rx="15" ry="15"/>
          {/* Path for the dot to follow (counter-clockwise) */}
          <path id="dotPath" d="M 35 32.5 Q 12.5 32.5 12.5 80 Q 12.5 127.5 35 127.5 Q 57.5 127.5 57.5 80 Q 57.5 32.5 35 32.5 Z" fill="none" stroke="none"/>
          {/* Traveling yellow dot */}
          <circle className="traveling-dot" r="2" cx="0" cy="0">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#dotPath" />
            </animateMotion>
          </circle>
        </g>
      </svg>
      <style>{`
        .neon-svg {
          filter: none;
        }
        .neon-tube {
          fill: none;
          stroke: ${tubeColor};
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .traveling-dot {
          fill: #ffff00;
          filter: drop-shadow(0 0 3px #ffff00);
        }
      `}</style>
    </div>
  );
};

export default WingoStage;