// app/api/products/route.js
import { NextResponse } from 'next/server';
import { fetchAPI } from '@/utils/api';

export async function GET() {
  try {
    const djangoResponse = await fetchAPI(`/api/products/`);
    const products = await djangoResponse.json();
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}