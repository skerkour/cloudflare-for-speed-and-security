import { useEtagsCache } from "../cache";
import { Context } from "../context";
import { getEtag, handleCaching } from "../utils";
import robotsTxtFileContent from '../public/robots.txt';

export async function robotsTxt(ctx: Context): Promise<Response> {
  let etag = await getEtag(useEtagsCache(), '/robots.txt', robotsTxtFileContent);
  const cacheHit = handleCaching(ctx, 'public, max-age=1800, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.text(robotsTxtFileContent);
};