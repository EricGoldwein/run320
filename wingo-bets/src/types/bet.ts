export type BetType = 'time' | 'matchup' | 'parlay';

export type BetStatus = 'active' | 'settled' | 'cancelled';

export interface User {
  id: number;
  email: string;
  username: string;
  wingo_balance: number;
  created_at: string;
}

export interface BetParticipant {
  user: User;
  amount: number;
}

export interface Bet {
  id: string;
  type: BetType;
  title: string;
  description: string;
  creator: User;
  participants: BetParticipant[];
  amount: number;
  odds: number;
  spread?: number;
  status: 'active' | 'matched' | 'completed' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
  settledAt?: Date;
  winner?: User;
  event?: {
    name: string;
    date?: Date;
    location?: string;
  };
  conditions: {
    type: 'time' | 'placement' | 'head-to-head';
    value: string | number;
    comparison: 'over' | 'under' | 'exact' | 'vs';
  }[];
} 