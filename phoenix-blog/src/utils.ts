import { ApiError, ApiResponse } from "@phoenix/core/api";
import { Blog, Page } from "@phoenix/core/entities";
import { Context as HonoContext } from "hono";
import { InternalServerError, NotFoundError } from "@phoenix/core/errors";

export type Bindings = {
  api: Fetcher;
  phoenix_storage: R2Bucket;
};

export type Variables = {
};

export type Context = HonoContext<{Bindings: Bindings, Variables: Variables}>


export async function getBlog(ctx: Context, domain: string): Promise<Blog> {
  // service bindings expects a request with a full URL, se we set an invalid host
  const apiReq = new Request(`https://localhost/headless/blog?domain=${domain}`, ctx.req.raw);
  const apiRes: ApiResponse<Blog> = await (await ctx.env.api.fetch(apiReq)).json();
  if (apiRes.error) {
    handleError(apiRes.error);
  }

  return apiRes.data;
}

export async function getPosts(ctx: Context, domain: string): Promise<Page[]> {
  // service bindings expects a request with a full URL, se we set an invalid host
  const apiReq = new Request(`https://localhost/headless/posts?domain=${domain}`, ctx.req.raw);
  const apiRes: ApiResponse<Page[]> = await (await ctx.env.api.fetch(apiReq)).json();
  if (apiRes.error) {
    handleError(apiRes.error);
  }

  return apiRes.data;
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
  const apiRes: ApiResponse<Page> = await (await ctx.env.api.fetch(apiReq)).json();
  if (apiRes.error) {
    handleError(apiRes.error);
  }

  return apiRes.data;
}


function handleError(err: ApiError) {
  switch (err.code) {
    case 'NOT_FOUND': {
      throw new NotFoundError(err.message);
    }
  }
  throw new InternalServerError(err.message);
}
