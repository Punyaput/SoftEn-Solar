// components/ClaimSunPoint.js
'use client';
import { useState } from 'react';
import './claim-sun-point.css';
import { fetchAPI } from '@/utils/api';

export default function ClaimSunPoint({ onClaim }) {
  const [message, setMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    setIsClaiming(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('access');
      
      // Using fetchAPI to make the POST request
      const data = await fetchAPI(`/api/users/claim-sun-point/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Assuming the API response is successful if the message is returned
      if (data.success) {
        setMessage(data.message);
        if (onClaim) onClaim();
      } else {
        setMessage(data.message || 'Failed to claim Sun Point');
      }
    } catch (error) {
      // Handle specific message in case of time-based error or network issues
      if (error.message.includes('Sun Points can only be claimed between')) {
        setMessage('Sun Points can only be claimed between 8 AM and 9 AM.');
      } else {
        setMessage('Network error or bad request. Please try again.');
      }
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
