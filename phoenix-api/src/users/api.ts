import { z } from 'zod';
import * as entities from './entities'

////////////////////////////////////////////////////////////////////////////////////////////////////
// Users
////////////////////////////////////////////////////////////////////////////////////////////////////

export const SignupInput = z.object({
  email: z.string().email().refine((val) => val.toLowerCase() === val, { message: 'must be lowercase' }),
  password: z.string().min(10),
}).strict();

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict();

export type User = {
  id: string;
  created_at: Date;
  updated_at: Date;

  email: string;
}

export function convertUser(input: entities.User): User {
  return {
    id: input.id,
    created_at: input.created_at,
    updated_at: input.updated_at,
    email: input.email,
  }
}
