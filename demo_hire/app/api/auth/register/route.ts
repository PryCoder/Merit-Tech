import { NextResponse } from 'next/server';

const DEFAULT_API_BASE_URL = 'http://localhost:8080';

function buildAuthCookie(token: string) {
  const parts = [
    `ml_token=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

export async function POST(req: Request) {
  const apiBaseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
  
  try {
    // Parse the request body
    const body = await req.json();
    
    console.log('Proxying registration request to:', `${apiBaseUrl}/api/v1/auth/register`);
    console.log('Request body:', { ...body, password: '[REDACTED]' });
    
    // Make request to backend
    const response = await fetch(`${apiBaseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Get the response data
    const data = await response.json();
    
    console.log('Backend response status:', response.status);
    
    // Create the Next.js response
    const nextResponse = NextResponse.json(data, { 
      status: response.status 
    });
    
    // If registration was successful and we have a token, set the cookie
    if (response.ok && data.token) {
      nextResponse.headers.set('Set-Cookie', buildAuthCookie(data.token));
      console.log('Auth cookie set successfully');
    }
    
    return nextResponse;
    
  } catch (error: any) {
    console.error('Registration proxy error:', error);
    
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: error.message || 'Internal server error',
        code: error.code || 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}