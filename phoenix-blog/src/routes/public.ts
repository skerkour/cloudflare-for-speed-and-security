import { Context, Next } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';

export const serveFavicon = serveStatic({ path: './favicon.ico' });
export const serveRobotsTxt = serveStatic({ path: './robots.txt' });
export const serveTheme = serveStatic();

export async function publicCacheControl(ctx: Context, next: Next) {
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
