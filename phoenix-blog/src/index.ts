import { Hono } from 'hono';
import Handlebars from './templates';
import robotsTxt from './public/robots.txt';
import indexCss from './public/theme/index.css';
import favicon from './public/favicon.ico';
import { Bindings, Variables, getBlog, getPage, getPosts, handleCaching } from './utils';
import { NotFoundError } from '@phoenix/core/errors';
import { sha256Sum } from '@phoenix/core/crypto';
import { PageTemplate } from './pages/page';
import { ErrorTempalte } from './pages/error';
import { PostsTemplate } from './pages/posts';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (ctx, next) => {
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
  await next();
})

let robotsTxtEtag: string | null = null;
app.get('/robots.txt', async (ctx) => {
  if (!robotsTxtEtag) {
    robotsTxtEtag = await sha256Sum(robotsTxt);
  }
  const cacheHit = handleCaching(ctx, 'public, max-age=1800, must-revalidate', robotsTxtEtag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.text(robotsTxt);
})

let faviconEtag: string | null = null;
app.get('/favicon.ico', async (ctx) => {
  if (!faviconEtag) {
    faviconEtag = await sha256Sum('/favicon.ico');
  }
  const cacheHit = handleCaching(ctx, 'public, max-age=31536000, immutable', faviconEtag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(favicon, {
    headers: {
      'Content-Type': 'image/x-icon',
    },
  })
})

let indexCssEtag: string | null = null;
app.get('/theme/index.css', async (ctx) => {
  if (!indexCssEtag) {
    indexCssEtag = await sha256Sum(indexCss);
  }
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', indexCssEtag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(indexCss, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
    },
  })
})

app.get('/handlebars', async (ctx) => {
  const name = ctx.req.query('name') ?? 'Handlebars'

  const html = Handlebars.templates['handlebars']({ name });

  const etag = await sha256Sum(html);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.html(html);
})

app.get('/', async (ctx) => {
  // const reqUrl = new URL(ctx.req.url);
  const domain = 'blog.cloudflarebook.net';
  const res = await Promise.all([
    getBlog(ctx, domain),
    getPosts(ctx, domain),
  ]);

  const html = PostsTemplate({ blog: res[0], posts: res[1] });
  const etag = await sha256Sum(html);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.html(html);
});

app.get('*', async (ctx) => {
  const reqUrl = new URL(ctx.req.url);

  const domain = 'blog.cloudflarebook.net';
  const res = await Promise.all([
    getBlog(ctx, domain),
    getPage(ctx, domain, reqUrl.pathname),
  ]);

  const html = PageTemplate({ blog: res[0], page: res[1] });
  const etag = await sha256Sum(html);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.html(html);
})

app.onError((err, ctx) => {
  let errorMessage = 'Internal Server Error';
  let statusCode = 500;

  if (err instanceof NotFoundError) {
    errorMessage = err.message;
    statusCode = 404;
  } else {
    console.error(err);
  }

  ctx.res.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

  const html = ErrorTempalte({ error: errorMessage });

  return ctx.html(html, statusCode);
});

export default app;


