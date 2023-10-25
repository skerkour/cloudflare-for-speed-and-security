import { uuidv7 } from "@phoenix/uuiv7/src";
import { MiddlewareHandler } from "hono";

export function requestIdMiddleware(): MiddlewareHandler {
  return async (ctx, next) => {
    const requestId = uuidv7();
    ctx.set('request_id', requestId);
    ctx.res.headers.set('X-Phoenix-Request-Id', requestId);
    await next();
  };
}
