// app/api/orders/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(
      { error: 'Authorization token missing' },
      { status: 401 }
    );
  }

  try {
    const orderData = await request.json();
    
    // Forward to Django backend
    const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json();
      return NextResponse.json(
        { error: errorData || 'Order creation failed' },
        { status: djangoResponse.status }
      );
    }

    const data = await djangoResponse.json();
    return NextResponse.json(data, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}