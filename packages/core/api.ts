import { z } from 'zod';
import { PageType, User } from './entities';
import deepClone from '@phoenix/deepclone';
import { ApiResponse } from './api_client';

export * from './api_client';
export * from './api_routes';

export function convertToApiResponse<T>(data: T): ApiResponse<T> {
  return {
    data: data,
    error: null,
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Users
////////////////////////////////////////////////////////////////////////////////////////////////////

export const SignupInputValidator = z.object({
  email: z.string().email().refine((val) => val.toLowerCase() === val, { message: 'must be lowercase' }),
  password: z.string().min(10),
}).strict();

export type SignupInput = z.infer<typeof SignupInputValidator>;


export const LoginInputValidator = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict();

export type LoginInput = z.infer<typeof LoginInputValidator>;


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

export const CreateBlogInputValidator = z.object({
  name: z.string(),
  slug: blogSlug,
}).strict();

export type CreateBlogInput = z.infer<typeof CreateBlogInputValidator>;


export const GetBlogInputValidator = z.object({
  blog_id: z.string(),
}).strict();

export type GetBlogInput = z.infer<typeof GetBlogInputValidator>;


export const DeleteBlogInputValidator = z.object({
  blog_id: z.string(),
}).strict();

export type DeleteBlogInput = z.infer<typeof DeleteBlogInputValidator>;


export const UpdateBlogInputValidator = z.object({
  blog_id: z.string(),
  slug: blogSlug.optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  navigation: z.record(z.string()).optional(),
}).strict();

export type UpdateBlogInput = z.infer<typeof UpdateBlogInputValidator>;


////////////////////////////////////////////////////////////////////////////////////////////////////
// Pages
////////////////////////////////////////////////////////////////////////////////////////////////////

const pageSlugValidator = z.string().min(2)
  .refine((val) => val.startsWith('/'), { message: 'must start with /' })
  .refine((val) => val.trim() === val, { message: 'whitespaces are not allowed' })

export const CreatePageInputValidator = z.object({
  title: z.string(),
  slug: pageSlugValidator,
  type: z.nativeEnum(PageType),
  blog_id: z.string().uuid(),
  content_html: z.string(),
}).strict();

export type CreatePageInput = z.infer<typeof CreatePageInputValidator>;


export const GetPageInputValidator = z.object({
  page_id: z.string(),
}).strict();

export type GetPageInput = z.infer<typeof GetPageInputValidator>;


export const DeletePageInputValidator = z.object({
  page_id: z.string(),
}).strict();

export type DeletePageInput = z.infer<typeof DeletePageInputValidator>;


export const UpdatePageInputValidator = z.object({
  page_id: z.string(),
  slug: pageSlugValidator.optional(),
  title: z.string().optional(),
  content_html: z.string().optional(),
}).strict();

export type UpdatePageInput = z.infer<typeof UpdatePageInputValidator>;


export const GetPagesInputValidator = z.object({
  blog_id: z.string(),
}).strict();

export type GetPagesInput = z.infer<typeof GetPagesInputValidator>;
