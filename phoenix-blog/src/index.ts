import { Hono } from 'hono';
import { etagMiddleware } from '@phoenix/core/middlewares';
import Handlebars from './templates';
import robotsTxt from './public/robots.txt';
import indexCss from './public/theme/index.css';
import { ApiClient, ApiResponse, headlessGetPosts } from '@phoenix/core/api';
import { Page } from '@phoenix/core/entities';
import { Bindings, Variables, getBlog, getPage, getPosts } from './utils';
import { NotFoundError } from '@phoenix/core/errors';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', etagMiddleware());
app.use('*', async (ctx, next) => {
  await next();
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
})

app.get('/robots.txt', async (ctx) => {
  return ctx.text(robotsTxt);
})

app.get('/theme/index.css', async (ctx) => {
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

  ctx.res.headers.set('Cache-Control', 'public, no-cache, must-revalidate');
  // c.res.headers.set('ETag', '"123"');

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

  return ctx.html(html);
});

export default app;


