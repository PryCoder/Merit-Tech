import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8080/api/v1/health');
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