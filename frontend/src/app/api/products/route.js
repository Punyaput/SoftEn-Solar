import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const djangoResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/`);
    const products = await djangoResponse.json();
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}