import { Hono } from 'hono';
import { NotFoundError } from '@phoenix/core/errors';
import { ErrorTemplate } from './routes/_error';
import { Bindings, Variables } from './context';
import { handlebars } from './routes/handlebars';
import { index } from './routes';
import { page } from './routes/page';
import { serveFavicon, serveRobotsTxt, serveTheme } from './public';
import { etag } from 'hono/etag'
import { staticAssetsCacheControlMiddleware } from './caching';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const staticAssets = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (ctx, next) => {
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
  await next();
})

staticAssets.use('*', etag());
staticAssets.use('*', staticAssetsCacheControlMiddleware);
staticAssets.get('/robots.txt', etag(), serveRobotsTxt);
staticAssets.get('/favicon.ico', serveFavicon);
staticAssets.get('/theme/*', serveTheme);

app.route('/', staticAssets);

app.get('/handlebars', handlebars);
app.get('/', index);
app.get('*', page);

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


