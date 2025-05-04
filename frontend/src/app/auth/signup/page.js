'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './signup.css';
import { fetchAPI } from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const data = await fetchAPI(`/api/users/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log(data)

      // Assuming the backend sends a successful response with a message
      if (data.detail) {
        router.push('/auth/login');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Sign Up</h1>
          <p>Create your SolarShop account</p>
        </div>
        <form onSubmit={handleSignup} className="auth-options">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="auth-btn primary">
            Sign Up
          </button>
        </form>
        <div className="auth-footer mt-4">
          <p>
            Already have an account?{' '}
            <a href="/auth/login">Log in</a>
          </p>
        </div>
      </div>
    </main>
  );
}
