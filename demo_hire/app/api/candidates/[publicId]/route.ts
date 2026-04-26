import { proxyToBackend } from '../../_proxy'

export async function GET(req: Request, ctx: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await ctx.params
  return proxyToBackend(req, { apiPath: `/api/v1/candidates/${encodeURIComponent(publicId)}` })
}
