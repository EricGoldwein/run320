export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  balance: number;
  stravaId?: string;
  profileUrl?: string;
  isActive: boolean;
  createdAt: Date;
  wingo_balance: number;
  total_wingos: number;
  created_at: string;
  last_activity: string;
  full_name?: string;
  correct_picks?: number;
  total_picks?: number;
  units_won?: number;
  units_lost?: number;
} 