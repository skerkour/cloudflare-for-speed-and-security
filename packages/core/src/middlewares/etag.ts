import { MiddlewareHandler } from "hono";

export function etagMiddleware(): MiddlewareHandler {
  return async (ctx, next) => {
    let ifNoneMatch = ctx.req.header('If-None-Match');
    if (ifNoneMatch && ifNoneMatch.startsWith('W/"')) {
      // remove weak ETag modifier, if any
      ifNoneMatch = ifNoneMatch.replace('W/"', '');
    }

    await next();

    const etag = ctx.res.headers.get('ETag');
    if (ifNoneMatch && etag && etag === ifNoneMatch) {
      await ctx.res.blob() // Force using body
      ctx.res = new Response(null, {
        status: 304,
        headers: ctx.res.headers,
      });
    }
  };
}
