// src/utils/auth.js
export async function refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) throw new Error('No refresh token');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
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