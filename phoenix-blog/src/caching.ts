import { sha256Sum } from "@phoenix/core/crypto";
import { Context } from "./context";

let etagsCache = new Map<string, string>();

export async function getEtag(path: string, content: string): Promise<string> {
  let etag = etagsCache.get(path);
  if (!etag) {
    etag = await sha256Sum(content);
    etagsCache.set(path, etag);
  }
  return etag;
}

export function handleCaching(ctx: Context, cacheControl: string, etag: string): Response | null {
  ctx.res.headers.set('Cache-Control', cacheControl);
  ctx.res.headers.set('ETag', `"${etag}"`);

  const ifNoneMatch = ctx.req.header('If-None-Match')?.trim().replace('W/', '').replaceAll('"', '');
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: ctx.res.headers,
    });
  }

  return null;
}
