import { NextResponse } from 'next/server'

const DEFAULT_API_BASE_URL = 'http://localhost:8080'

function buildAuthCookie(token: string) {
  const parts = [
    `ml_token=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export async function POST(req: Request) {
  const apiBaseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL

  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = null
  }

  const upstream = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization') as string } : {}),
    },
    body: JSON.stringify(body ?? {}),
    cache: 'no-store',
  })

  const contentType = upstream.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await upstream.json().catch(() => null) : await upstream.text().catch(() => null)

  const res = NextResponse.json(payload, { status: upstream.status })

  const token = (payload as any)?.token
  if (upstream.ok && typeof token === 'string' && token.length > 0) {
    res.headers.set('set-cookie', buildAuthCookie(token))
  }

  return res
}
