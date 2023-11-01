import { Hono } from 'hono';
import { etagMiddleware } from '@phoenix/core/middlewares';
import Handlebars from './templates';
import robotsTxt from './public/robots.txt';
import indexCss from './public/theme/index.css';
import favicon from './public/favicon.ico';
import { Bindings, Variables, getBlog, getPage, getPosts, handleCaching } from './utils';
import { NotFoundError } from '@phoenix/core/errors';
import { sha256Sum } from '@phoenix/core/crypto';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (ctx, next) => {
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
  await next();
})

app.get('/robots.txt', async (ctx) => {
  const etag = await sha256Sum(indexCss);
  const cacheHit = handleCaching(ctx, 'public, max-age=1800, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.text(robotsTxt);
})

app.get('/favicon.ico', async (ctx) => {
  const etag = await sha256Sum('/favicon.ico');
  const cacheHit = handleCaching(ctx, 'public, max-age=31536000, immutable', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(favicon, {
    headers: {
      'Content-Type': 'image/x-icon',
    },
  })
})

app.get('/theme/index.css', async (ctx) => {
  const etag = await sha256Sum(indexCss);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return new Response(indexCss, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
    },
  })
})

app.get('/', async (ctx) => {
  // const reqUrl = new URL(ctx.req.url);
  const domain = 'blog.cloudflarebook.net';
  const res = await Promise.all([
    getBlog(ctx, domain),
    getPosts(ctx, domain),
  ]);

  const etag = btoa(res[0].updated_at.toISOString());
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  const html = Handlebars.templates['posts']({
    path: ctx.req.path,
    blog: res[0],
    posts: res[1],
  });

  return ctx.html(html);
});

app.get('*', async (ctx) => {
  const reqUrl = new URL(ctx.req.url);

  const domain = 'blog.cloudflarebook.net';
  const res = await Promise.all([
    getBlog(ctx, domain),
    getPage(ctx, domain, reqUrl.pathname),
  ]);

  const etag = btoa(res[0].updated_at.toISOString());
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  const html = Handlebars.templates['page']({
    blog: res[0],
    page: res[1],
  });

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

  const html = Handlebars.templates['error']({
    error: errorMessage,
  });

  ctx.res.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

  return ctx.html(html, statusCode);
});

export default app;


