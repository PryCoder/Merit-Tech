export class ApiError extends Error {
  status: number;
  code?: string;
  requestId?: string;
  payload?: unknown;

  constructor(
    message: string,
    options: {
      status: number;
      code?: string;
      requestId?: string;
      payload?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.payload = options.payload;
  }
}

type FetchJsonOptions = Omit<RequestInit, 'body' | 'method'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
};

export async function fetchJson<T>(
  url: string,
  options: FetchJsonOptions = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    method: options.method ?? (options.body ? 'POST' : 'GET'),
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const errObj = (payload as any)?.error;
    throw new ApiError(errObj?.message || `Request failed (${res.status})`, {
      status: res.status,
      code: errObj?.code,
      requestId: errObj?.requestId,
      payload,
    });
  }

  return payload as T;
}
