import { NextResponse } from 'next/server';
import { fetchAPI } from '@/utils/api';

export async function POST() {
  try {
    // Replace with your Django backend endpoint
    const djangoResponse = await fetchAPI(`/api/users/claim-sun-point/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await djangoResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to claim sun point' },
      { status: 500 }
    );
  }
}