import { proxyToBackend } from '../../_proxy';

export async function GET(
  req: Request,
  ctx: { params: Promise<{ assessmentId: string }> }
) {
  const { assessmentId } = await ctx.params;
  return proxyToBackend(req, {
    apiPath: `/api/v1/assessments/${encodeURIComponent(assessmentId)}`,
  });
}
