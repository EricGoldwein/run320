import { User } from '../types';

const API_URL = 'http://127.0.0.1:3001';

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    body: new URLSearchParams({
      'username': email,
      'password': password,
    }),
    });

    if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
    }

    const { access_token } = await response.json();
  localStorage.setItem('token', access_token);

    // Get user data
  const userResponse = await fetch(`${API_URL}/me`, {
      headers: {
      'Authorization': `Bearer ${access_token}`,
    },
    });

    if (!userResponse.ok) {
    throw new Error('Failed to get user data');
    }

    const user = await userResponse.json();
  return { user, token: access_token };
};

export const register = async (
  email: string,
  password: string,
  username: string,
  full_name: string,
  strava_id?: string,
  strava_access_token?: string,
  strava_refresh_token?: string,
  strava_token_expires_at?: string
): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      password,
        username,
      full_name,
      strava_id,
      strava_access_token,
      strava_refresh_token,
      strava_token_expires_at,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};

export const forgotPassword = async (email: string): Promise<void> => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to send reset email');
  }
};

export const resetPassword = async (token: string, new_password: string): Promise<void> => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
        headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, new_password }),
      });

      if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to reset password');
      }
};

export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get current user');
  }

  return response.json();
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

export const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout,
}; 