import { Hono } from 'hono';
import Handlebars from './templates';
import robotsTxt from './public/robots.txt';
import indexCss from './public/theme/index-5eca4c37898bca4ff1a357cf7c481dfe0375b737.css';
import favicon from './public/favicon.ico';
import { getBlog, getEtag, getPage, getPosts, handleCaching, maxTime } from './utils';
import { NotFoundError } from '@phoenix/core/errors';
import { sha256Sum } from '@phoenix/core/crypto';
import { PageTemplate } from './pages/page';
import { ErrorTemplate } from './pages/error';
import { PostsTemplate } from './pages/posts';
import TsxSha256Hash from './tsx_sha256.txt';
import { Bindings, Variables } from './context';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const etagsCache = new Map<string, string>();

app.use('*', async (ctx, next) => {
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
  await next();
})

app.get('/robots.txt', async (ctx) => {
  let etag = await getEtag(etagsCache, '/robots.txt', robotsTxt);
  const cacheHit = handleCaching(ctx, 'public, max-age=1800, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.text(robotsTxt);
})

app.get('/favicon.ico', async (ctx) => {
  let etag = await getEtag(etagsCache, '/favicon.ico', '/favicon.ico');
  const cacheHit = handleCaching(ctx, 'public, max-age=3600, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(favicon, {
    headers: {
      'Content-Type': 'image/x-icon',
    },
  })
})

app.get('/theme/index-5eca4c37898bca4ff1a357cf7c481dfe0375b737.css', async (ctx) => {
  let etag = await getEtag(etagsCache, '/theme/index-5eca4c37898bca4ff1a357cf7c481dfe0375b737.css', indexCss);
  const cacheHit = handleCaching(ctx, 'public, max-age=31536000, immutable', etag);
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
  const [blog, posts] = await Promise.all([
    getBlog(ctx, domain),
    getPosts(ctx, domain),
  ]);

  const html = PostsTemplate({ blog, posts });
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
  const [blog, page] = await Promise.all([
    getBlog(ctx, domain),
    getPage(ctx, domain, reqUrl.pathname),
  ]);

  const updatedAt = maxTime(blog.updated_at, page.updated_at);
  const etag = await sha256Sum(`${TsxSha256Hash}|${updatedAt.toISOString()}`)
  const cacheHit = handleCaching(ctx, 'public, max-age=60, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  const html = PageTemplate({ blog, page });

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

  const html = ErrorTemplate({ error: errorMessage });

  return ctx.html(html, statusCode);
});

export default app;


