import { Hono } from 'hono';
import { NotFoundError } from '@phoenix/core/errors';
import { ErrorTemplate } from './routes/_error';
import { Bindings, Variables } from './context';
import { robotsTxt } from './routes/robotstxt';
import { favicon } from './routes/favicon';
import { indexCss } from './routes/indexcss';
import { handlebars } from './routes/handlebars';
import { index } from './routes';
import { page } from './routes/page';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const etagsCache = new Map<string, string>();

app.use('*', async (ctx, next) => {
  ctx.res.headers.set('X-Robots-Tag', 'noindex');
  await next();
})

app.get('/robots.txt', robotsTxt);
app.get('/favicon.ico', favicon);
app.get('/theme/index-5eca4c37898bca4ff1a357cf7c481dfe0375b737.css', indexCss);

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


