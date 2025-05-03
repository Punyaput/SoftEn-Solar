// app/api/users/me/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization header missing or invalid' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const response = await fetch('http://localhost:8000/api/users/me/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Django API responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user data' },
      { status: 401 }
    );
  }
}