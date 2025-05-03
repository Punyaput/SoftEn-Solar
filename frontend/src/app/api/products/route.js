import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const djangoResponse = await fetch('http://localhost:8000/api/products/');
    const products = await djangoResponse.json();
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}