import { getEtag, handleCaching } from "../caching";
import { Context } from "../context";
import indexCssFielContent from '../public/theme/index-5eca4c37898bca4ff1a357cf7c481dfe0375b737.css';

export async function indexCss(ctx: Context): Promise<Response> {
  let etag = await getEtag('/theme/index-5eca4c37898bca4ff1a357cf7c481dfe0375b737.css', indexCssFielContent);
  const cacheHit = handleCaching(ctx, 'public, max-age=31536000, immutable', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(indexCssFielContent, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
    },
  })
}
