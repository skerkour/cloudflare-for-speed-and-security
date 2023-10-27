import { Hono } from 'hono';
import { etagMiddleware } from '@phoenix/core/middlewares';
import Handlebars from './templates';
import robotsTxt from './public/robots.txt';

type Bindings = {
  api: Fetcher;
  phoenix_storage: R2Bucket;
};

type Variables = {
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', etagMiddleware());
app.use('*', async (ctx, next) => {
  await next();
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
})

app.get('/', async (ctx) => {
  // service bindings expects a request with a full URL, se we set an invalid host
  const apiReq = new Request('https://localhost/headless/posts', ctx.req.raw);
  const apiRes = await ctx.env.api.fetch(apiReq);
  const posts = await apiRes.json();

  const html = Handlebars.templates['posts']({
    path: ctx.req.path,
    posts: posts,
  });

  return ctx.html(html);
});

app.get('/robots.txt', async (ctx) => {
  return ctx.text(robotsTxt);
})

app.get('*', async (ctx) => {
  const reqUrl = new URL(ctx.req.url);

  const queryParams = {
    slug: reqUrl.pathname,
    domain: reqUrl.hostname,
  };
  const urlSearchParams = new URLSearchParams(queryParams);

  let url = 'https://localhost/headless/page';
  url += `?${urlSearchParams.toString()}`;

  const req = new Request(url, ctx.req.raw);
  const res = await ctx.env.api.fetch(req);
  const page: any = await res.json();

  ctx.res.headers.set('Cache-Control', 'public, no-cache, must-revalidate');
  // c.res.headers.set('ETag', '"123"');

  const html = Handlebars.templates['page']({
    path: ctx.req.path,
    body: page.content_html
  });

  return ctx.html(html);
})

app.onError((err, ctx) => {
  console.error(err);
  return ctx.text('Internal Server Error', 500);
});

export default app;


