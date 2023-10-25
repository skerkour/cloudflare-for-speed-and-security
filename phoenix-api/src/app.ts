import { Hono } from 'hono';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { ErrorCode, NotFoundError, PermissionDeniedError, formatZodError } from './errors';
import { ApiError, ApiResponse } from '@phoenix/core/api';
import { requestIdMiddleware } from '@phoenix/core/middlewares';
import { Bindings, Variables } from './bindings';
import { ZodError } from 'zod';
import { createPage } from './blogs/create_page';
import { headlessGetPosts } from './blogs/headless_get_posts';
import { headlessGetPage } from './blogs/headless_get_page';
import { getPages } from './blogs/get_pages';
import { getPage } from './blogs/get_page';
import { deletePage } from './blogs/delete_page';
import { updatePage } from './blogs/update_page';
import { getBlogs } from './blogs/get_blogs';
import { createBlog } from './blogs/create_blog';
import { signup } from './users/signup';
import { updateBlog } from './blogs/update_blog';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middlewares
app.use('*', requestIdMiddleware());
app.use('*', async (ctx, next) => {
  // we use the pool.fetch connection method. See chapter 2 for the "why"
  neonConfig.poolQueryViaFetch = true;
  neonConfig.fetchConnectionCache = true;

  const pgClient = new Pool({ connectionString: ctx.env.DATABASE_URL });

  ctx.set('db', pgClient);
  await next();
});


// API
app.get('/', (ctx) => {
  return ctx.json({ message: 'Hello Phoenix!' });
});

app.post('/signup', signup);
app.post('/login', signup);

app.get('/blogs', getBlogs);
app.post('/create_blog', createBlog);
app.post('/update_blog', updateBlog);

app.get('/pages', getPages);
app.post('/create_page', createPage);
app.post('/page', getPage);
app.post('/delete_page', deletePage);
app.post('/update_page', updatePage);

// headless API
app.get('/headless/posts', headlessGetPosts);
app.get('/headless/page', headlessGetPage);


app.onError((err, c) => {
  let apiErr: ApiError = {
    code: ErrorCode.InternalServerError,
    message: 'Internal Server error',
  };
  let statusCode = 500;

  if (err instanceof NotFoundError) {
    apiErr.code = ErrorCode.NotFound;
    apiErr.message = err.message;
    statusCode = 404;
  } else if (err instanceof PermissionDeniedError) {
    apiErr.code = ErrorCode.PermissionDenied;
    apiErr.message = err.message;
    statusCode = 403;
  } else if (err instanceof ZodError) {
    apiErr.code = ErrorCode.InvalidArgument;
    apiErr.message = formatZodError(err);
    statusCode = 400;
  } else {
    console.error(err);
  }

  const res: ApiResponse = {
    data: null,
    error: apiErr,
  };
  return c.json(res, statusCode);
});

app.notFound(async (ctx) => {
  return ctx.json({
    data: null,
    error: {
      code: ErrorCode.NotFound,
      message: 'Route not found.',
    },
  })
});

export default app;
