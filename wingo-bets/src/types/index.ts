export interface User {
  id: string;
  username: string;
  wingo_balance: number;
  total_wingos: number;
  created_at: string;
  last_activity: string;
  email?: string;
  full_name?: string;
  correct_picks?: number;
  total_picks?: number;
  units_won?: number;
  units_lost?: number;
} 