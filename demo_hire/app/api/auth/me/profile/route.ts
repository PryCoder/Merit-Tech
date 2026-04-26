import { proxyToBackend } from '../../../_proxy'

export async function PUT(req: Request) {
  return proxyToBackend(req, { apiPath: '/api/v1/auth/me/profile' })
}
