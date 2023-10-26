import { type Pool } from '@neondatabase/serverless';
import { Context as HonoContext } from "hono";


export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type Variables = {
  db: Pool;
  request_id: string;
};

export type Context = HonoContext<{Bindings: Bindings, Variables: Variables}>
