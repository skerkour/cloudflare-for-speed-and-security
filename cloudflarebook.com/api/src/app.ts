import { Hono } from 'hono';
import { ErrorCode, NotFoundError, PermissionDeniedError, formatZodError } from '@cloudflarebook.com/core/errors';
import { ApiError, ApiResponse, Routes } from '@cloudflarebook.com/core/api';
import { requestIdMiddleware } from '@cloudflarebook.com/core/middlewares';
import { Bindings, Variables } from './hono_bindings';
import { ZodError } from 'zod';
import { createPage } from './blogs/create_page';
import { headlessGetPosts } from './blogs/headless_get_posts';
import { headlessGetPage } from './blogs/headless_get_page';
import { headlessGetBlog } from './blogs/headless_get_blog';
import { getPages } from './blogs/get_pages';
import { getPage } from './blogs/get_page';
import { deletePage } from './blogs/delete_page';
import { updatePage } from './blogs/update_page';
import { getBlogs } from './blogs/get_blogs';
import { createBlog } from './blogs/create_blog';
import { signup } from './users/signup';
import { login } from './users/login';
import { updateBlog } from './blogs/update_blog';
import { getBlog } from './blogs/get_blog';
import { deleteBlog } from './blogs/delete_blog';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Middlewares
app.use('*', requestIdMiddleware());
// app.use('*', async (ctx, next) => {
//   // we use the pool.fetch connection method. See chapter 2 for the "why"
//   neonConfig.poolQueryViaFetch = true;
//   neonConfig.fetchConnectionCache = true;

//   const pgClient = new Pool({ connectionString: ctx.env.DATABASE_URL });

//   ctx.set('db', pgClient);
//   await next();
// });


// API
app.get('/', (ctx) => {
  return ctx.json({ message: 'Hello World!' });
});

app.post(Routes.Signup, signup);
app.post(Routes.Login, login);

app.post(Routes.Blogs, getBlogs);
app.post(Routes.Blog, getBlog);
app.post(Routes.CreateBlog, createBlog);
app.post(Routes.UpdateBlog, updateBlog);
app.post(Routes.DeleteBlog, deleteBlog);

app.post(Routes.Pages, getPages);
app.post(Routes.CreatePage, createPage);
app.post(Routes.Page, getPage);
app.post(Routes.DeletePage, deletePage);
app.post(Routes.UpdatePage, updatePage);

// headless API
app.get(Routes.HeadlessPosts, headlessGetPosts);
app.get(Routes.HeadlessPage, headlessGetPage);
app.get(Routes.HeadlessBlog, headlessGetBlog);


app.onError((err, ctx) => {
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

  ctx.res.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')

  const res: ApiResponse<null> = {
    data: null,
    error: apiErr,
  };
  return ctx.json(res, statusCode);
});

app.notFound(async (ctx) => {
  ctx.res.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')

  return ctx.json({
    data: null,
    error: {
      code: ErrorCode.NotFound,
      message: 'Route not found.',
    },
  })
});

export default app;
