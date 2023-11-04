import { Context } from "../context";
import { getEtag, handleCaching } from "../caching";
import faviconFileContent from '../public/favicon.ico';

export async function favicon(ctx: Context): Promise<Response> {
  let etag = await getEtag('/favicon.ico', '/favicon.ico');
  const cacheHit = handleCaching(ctx, 'public, max-age=3600, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(faviconFileContent, {
    headers: {
      'Content-Type': 'image/x-icon',
    },
  })
}
