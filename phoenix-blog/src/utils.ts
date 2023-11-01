import { ApiError, ApiResponse } from "@phoenix/core/api";
import { Blog, BlogValidator, Page, PageValidator } from "@phoenix/core/entities";
import { Context as HonoContext } from "hono";
import { InternalServerError, NotFoundError } from "@phoenix/core/errors";

export type Bindings = {
  api: Fetcher;
  phoenix_storage: R2Bucket;
};

export type Variables = {
};

export type Context = HonoContext<{Bindings: Bindings, Variables: Variables}>


export function handleCaching(ctx: Context, cacheControl: string, etag: string): Response | null {
  ctx.res.headers.set('Cache-Control', cacheControl);
  ctx.res.headers.set('Etag', `"${etag}"`);

  const ifNoneMatch = ctx.req.header('If-None-Match')?.trim().replace('W/', '').replaceAll('"', '');
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: ctx.res.headers,
    });
  }

  return null;
}

export async function getBlog(ctx: Context, domain: string): Promise<Blog> {
  // service bindings expects a request with a full URL, se we set an invalid host
  const apiReq = new Request(`https://localhost/headless/blog?domain=${domain}`, ctx.req.raw);
  const apiRes: ApiResponse<unknown> = await (await ctx.env.api.fetch(apiReq)).json();
  if (apiRes.error) {
    handleError(apiRes.error);
  }

  const blog = BlogValidator.parse(apiRes.data);
  return blog;
}

export async function getPosts(ctx: Context, domain: string): Promise<Page[]> {
  // service bindings expects a request with a full URL, se we set an invalid host
  const apiReq = new Request(`https://localhost/headless/posts?domain=${domain}`, ctx.req.raw);
  const apiRes: ApiResponse<unknown[]> = await (await ctx.env.api.fetch(apiReq)).json();
  if (apiRes.error) {
    handleError(apiRes.error);
  }

  const pages = apiRes.data.map((x) => PageValidator.parse(x));
  return pages;
}

export async function getPage(ctx: Context, domain: string, slug: string): Promise<Page> {
  const queryParams = {
    slug,
    domain,
  };
  const urlSearchParams = new URLSearchParams(queryParams);

  // service bindings expects a request with a full URL, se we set an invalid host
  let url = `https://localhost/headless/page?${urlSearchParams.toString()}`;

  const apiReq = new Request(url, ctx.req.raw);
  const apiRes: ApiResponse<unknown> = await (await ctx.env.api.fetch(apiReq)).json();
  if (apiRes.error) {
    handleError(apiRes.error);
  }

  const page = PageValidator.parse(apiRes.data);
  return page;
}


function handleError(err: ApiError) {
  switch (err.code) {
    case 'NOT_FOUND': {
      throw new NotFoundError(err.message);
    }
  }
  throw new InternalServerError(err.message);
}

export function maxTime(...times: Date[]): Date {
  if (times.length === 0) {
    throw new Error('at least one parameter is expected');
  }

  let max = times[0];
  for (let i = 1; i < times.length; i += 1) {
    if (times[i].getTime() > max.getTime()) {
      max = times[i];
    }
  }

  return max;
}
