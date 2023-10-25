import { z } from 'zod';
import { PageType } from './entities';

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
  slug: z.string().optional().and(blogSlug),
  name: z.string().optional(),
  description: z.string().optional(),
  navigation: z.record(z.string()),
}).strict();

////////////////////////////////////////////////////////////////////////////////////////////////////
// Pages
////////////////////////////////////////////////////////////////////////////////////////////////////

export const CreatePageInput = z.object({
  title: z.string(),
  slug: z.string().min(1).refine((val) => val.startsWith('/'), { message: 'must start with /' }),
  type: z.nativeEnum(PageType).and(z.string()),
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
  slug: z.string().optional(),
  title: z.string().optional(),
}).strict();

export const GetPagesInput = z.object({
  blog_id: z.string(),
}).strict();
