'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './signup.css';

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

    const res = await fetch('http://localhost:8000/api/users/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/auth/login');
    } else {
      const data = await res.json();
      setError(data.detail || 'Signup failed');
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
