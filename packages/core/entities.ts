////////////////////////////////////////////////////////////////////////////////////////////////////
// Users
////////////////////////////////////////////////////////////////////////////////////////////////////

import { z } from "zod";

export const UserValidator = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),

  email: z.string(),
  password_hash: z.string(),
  is_admin: z.boolean(),
}).strict();

export type User = z.infer<typeof UserValidator>;


////////////////////////////////////////////////////////////////////////////////////////////////////
// Blogs
////////////////////////////////////////////////////////////////////////////////////////////////////

export enum PageType {
  Page = 'page',
  Post = 'post',
};

export const BlogValidator = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),

  name: z.string(),
  slug: z.string(),
  navigation: z.record(z.string()),
  description_html: z.string(),
}).strict();

export type Blog = z.infer<typeof BlogValidator>;


export const PageValidator = z.object({
  id: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),

  slug: z.string(),
  type: z.nativeEnum(PageType),
  title: z.string(),
  content_html: z.string(),
  blog_id: z.string(),
}).strict();

export type Page = z.infer<typeof PageValidator>;
