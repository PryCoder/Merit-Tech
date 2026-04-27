import { NextResponse } from 'next/server';

const DEFAULT_API_BASE_URL = 'http://localhost:4000';

type ProxyOptions = {
  apiPath: string;
};

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

function pickAuthHeader(req: Request) {
  const fromHeader = req.headers.get('authorization');
  if (fromHeader) return fromHeader;

  const token = getCookieValue(req.headers.get('cookie'), 'ml_token');
  if (!token) return null;
  return `Bearer ${token}`;
}

export async function proxyToBackend(req: Request, { apiPath }: ProxyOptions) {
  const apiBaseUrl = process.env.API_BASE_URL || DEFAULT_API_BASE_URL;

  let body: unknown = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await req.json();
    } catch {
      body = null;
    }
  }

  const auth = pickAuthHeader(req);

  const upstream = await fetch(`${apiBaseUrl}${apiPath}`, {
    method: req.method,
    headers: {
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
      ...(auth ? { authorization: auth } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body ?? {}),
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson
    ? await upstream.json().catch(() => null)
    : await upstream.text().catch(() => null);

  return NextResponse.json(payload, { status: upstream.status });
}
