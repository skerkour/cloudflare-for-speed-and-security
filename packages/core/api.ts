import { z } from 'zod';
import { PageType, User } from './entities';
import deepClone from '@phoenix/deepclone';

export * from './api_client';
export * from './api_routes';

////////////////////////////////////////////////////////////////////////////////////////////////////
// Users
////////////////////////////////////////////////////////////////////////////////////////////////////

export const SignupInputValidator = z.object({
  email: z.string().email().refine((val) => val.toLowerCase() === val, { message: 'must be lowercase' }),
  password: z.string().min(10),
}).strict();

export type SignupInput = typeof SignupInputValidator._type;


export const LoginInputValidator = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict();

export type LoginInput = typeof LoginInputValidator._type;


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

const pageSlugValidator = z.string().min(2).refine((val) => val.startsWith('/'), { message: 'must start with /' })

export const CreatePageInputValidator = z.object({
  title: z.string(),
  slug: pageSlugValidator,
  type: z.nativeEnum(PageType),
  blog_id: z.string().uuid(),
  content_html: z.string(),
}).strict();

export type CreatePageInput = typeof CreatePageInputValidator._type;


export const GetPageInputValidator = z.object({
  page_id: z.string(),
}).strict();

export type GetPageInput = typeof GetPageInputValidator._type;


export const DeletePageInputValidator = z.object({
  page_id: z.string(),
}).strict();

export type DeletePageInput = typeof DeletePageInputValidator._type;


export const UpdatePageInputValidator = z.object({
  page_id: z.string(),
  slug: pageSlugValidator.optional(),
  title: z.string().optional(),
  content_html: z.string().optional(),
}).strict();

export type UpdatePageInput = typeof UpdatePageInputValidator._type;


export const GetPagesInputValidator = z.object({
  blog_id: z.string(),
}).strict();

export type GetPagesInput = typeof GetPagesInputValidator._type;
