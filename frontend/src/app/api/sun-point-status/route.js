import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Replace with your Django backend endpoint
    const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/sun-point-status/`);
    const data = await djangoResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { claimed: false, error: 'Failed to check status' },
      { status: 500 }
    );
  }
}