import { proxyToBackend } from '../../_proxy'

export async function POST(req: Request) {
  return proxyToBackend(req, { apiPath: '/api/v1/mentor/hint' })
}
