// src/hooks/useUser.js
'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('Not authenticated');
      }
  
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          return fetchUser(); // Use the memoized version
        }
        throw new Error('Session expired. Please login again.');
      }
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
      if (
        (err.message.includes('Not authenticated') || 
         err.message.includes('Session expired')) &&
        !['/auth/login', '/auth/signup', '/store/products', '/cart'].includes(pathname)
        && !pathname.startsWith('/store/product/')
      ) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);
  

  useEffect(() => {
    fetchUser();
    
    const handleStorage = () => fetchUser();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchUser]);

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    router.push('/auth/login');
  };

  return {
    user,
    isLoading: loading,
    error,
    refetch: fetchUser,
    logout,
    username: user?.username || null,
    sunPoints: user?.sun_points || 0,
    streakDays: user?.streak_days || 0,
    co2Reduced: user?.total_co2_saved || 0,
    energyGenerated: user?.total_energy_saved || 0
  };

  
}

async function refreshToken() {
  try {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) return null;
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });

    if (!res.ok) return null;
    
    const { access } = await res.json();
    localStorage.setItem('access', access);
    return access;
  } catch (error) {
    return null;
  }
}