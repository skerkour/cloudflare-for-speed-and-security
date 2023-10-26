import { type Pool } from '@neondatabase/serverless';

export type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type Variables = {
  db: Pool;
  request_id: string;
};
