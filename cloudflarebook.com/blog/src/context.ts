import { Context as HonoContext } from "hono";

export type Bindings = {
  api: Fetcher;
  storage: R2Bucket;
};

export type Variables = {
};

export type Context = HonoContext<{Bindings: Bindings, Variables: Variables}>
