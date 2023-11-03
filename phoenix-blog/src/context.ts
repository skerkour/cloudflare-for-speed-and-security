import { Context as HonoContext } from "hono";

export type Bindings = {
  api: Fetcher;
  phoenix_storage: R2Bucket;
};

export type Variables = {
};

export type Context = HonoContext<{Bindings: Bindings, Variables: Variables}>
