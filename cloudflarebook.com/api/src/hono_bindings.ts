import { Context as HonoContext } from "hono";


export type Bindings = {
  JWT_SECRET: string;
  BLOGS_ROOT_DOMAIN: string;
  DB: D1Database;
  R2_BUCKET: R2Bucket;
};

export type Variables = {
  request_id: string;
};

export type Context = HonoContext<{Bindings: Bindings, Variables: Variables}>
