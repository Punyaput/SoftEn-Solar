import { NextResponse } from 'next/server';
import { fetchAPI } from '@/utils/api';

export async function GET() {
  try {
    const djangoResponse = await fetchAPI(`/api/users/sun-point-status/`);
    const data = await djangoResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { claimed: false, error: 'Failed to check status' },
      { status: 500 }
    );
  }
}