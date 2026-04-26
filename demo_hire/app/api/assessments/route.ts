import { proxyToBackend } from '../_proxy'

export async function GET(req: Request) {
  return proxyToBackend(req, { apiPath: '/api/v1/assessments' })
}

export async function POST(req: Request) {
  return proxyToBackend(req, { apiPath: '/api/v1/assessments' })
}
