import { proxyToBackend } from '../../../_proxy';

export async function GET(
  req: Request,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await ctx.params;
  return proxyToBackend(req, {
    apiPath: `/api/v1/sessions/${encodeURIComponent(sessionId)}/results`,
  });
}
