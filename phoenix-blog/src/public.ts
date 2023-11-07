import { serveStatic } from 'hono/cloudflare-workers';

export const serveFavicon = serveStatic({ path: './favicon.ico' });
export const serveRobotsTxt = serveStatic({ path: './robots.txt' });
export const serveTheme = serveStatic();
