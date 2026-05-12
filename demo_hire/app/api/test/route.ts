import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiBaseUrl =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'http://localhost:8080';
    const response = await fetch(`${apiBaseUrl}/api/v1/health`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      backend: data,
      nextjs: { 
        running: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.code,
      message: error.message 
    }, { status: 503 });
  }
}