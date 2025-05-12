export interface Bet {
  title: string;
  description: string;
  distance: string;
  pace: string;
  probability: string;
  odds: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  wingo_balance: number;
} 