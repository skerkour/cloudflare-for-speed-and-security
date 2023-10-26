import { z } from 'zod';
import { PageType, User } from './entities';
import deepClone from '@phoenix/deepclone';

export * from './api_client';
export * from './api_routes';

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

export type UserApi = Omit<User, 'password_hash'>;

export function convertUser(input: User): UserApi {
  let ret = deepClone(input) as Partial<User>;
  delete ret.password_hash;
  return ret as UserApi;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Blogs
////////////////////////////////////////////////////////////////////////////////////////////////////

const blogSlug = z.string().min(3).regex(/^[a-z]+$/, 'must be lowercase')

export const CreateBlogInput = z.object({
  name: z.string(),
  slug: blogSlug,
}).strict();

export const UpdateBlogInput = z.object({
  blog_id: z.string(),
  slug: blogSlug.optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  navigation: z.record(z.string()).optional(),
}).strict();

////////////////////////////////////////////////////////////////////////////////////////////////////
// Pages
////////////////////////////////////////////////////////////////////////////////////////////////////

const pageSlug = z.string().min(2).refine((val) => val.startsWith('/'), { message: 'must start with /' })

export const CreatePageInput = z.object({
  title: z.string(),
  slug: pageSlug,
  type: z.nativeEnum(PageType),
  blog_id: z.string().uuid(),
  content_html: z.string(),
}).strict();

export const GetPageInput = z.object({
  page_id: z.string(),
}).strict();

export const DeletePageInput = z.object({
  page_id: z.string(),
}).strict();

export const UpdatePageInput = z.object({
  page_id: z.string(),
  slug: pageSlug.optional(),
  title: z.string().optional(),
  content_html: z.string().optional(),
}).strict();

export const GetPagesInput = z.object({
  blog_id: z.string(),
}).strict();
