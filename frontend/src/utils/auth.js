// src/utils/auth.js
import { fetchAPI } from '@/utils/api';

export async function refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw new Error('No refresh token');
      
      const res = await fetchAPI(`/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });
  
      if (!res.ok) throw new Error('Token refresh failed');
      
      const { access } = await res.json();
      localStorage.setItem('access', access);
      return access;
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      throw error;
    }
  }