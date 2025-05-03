// components/ClaimSunPoint.js
'use client';
import { useState } from 'react';
import './claim-sun-point.css'

export default function ClaimSunPoint({ onClaim }) {
  const [message, setMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/users/claim-sun-point/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        if (onClaim) onClaim();
      } else {
        setMessage(data.message || 'Failed to claim Sun Point');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="claim-container">
      <button 
        onClick={handleClaim} 
        disabled={isClaiming}
        className="claim-btn"
      >
        {isClaiming ? 'Claiming...' : 'Claim Sun Point'}
      </button>
      {message && (
        <p 
          className={`claim-message ${
            message.toLowerCase().includes('claimed') || message.toLowerCase().includes('success')
              ? 'status-success'
              : 'status-error'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}