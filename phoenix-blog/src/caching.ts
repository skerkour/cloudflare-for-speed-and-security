import { Next } from "hono";
import { Context } from "./context";

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

export async function staticAssetsCacheControlMiddleware(ctx: Context, next: Next) {
  const url = new URL(ctx.req.url);
  switch (url.pathname) {
    case '/favicon.ico':
      ctx.res.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
      break;
    default: {
      if (url.pathname.startsWith('/theme')) {
        ctx.res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        ctx.res.headers.set('Cache-Control', 'public, max-age=1800, immutable');
      }
      break;
    }
  }
  await next();
}
