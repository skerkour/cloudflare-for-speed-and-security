import { checkAuth, parseAndValidateApiInput, sendApiResponse } from "../utils";
import { NotFoundError } from "@cloudflarebook.com/core/errors";
import { uuidv7 } from "@cloudflarebook.com/uuidv7";
import { checkIsAdmin } from "../utils";
import { CreatePageInputValidator } from "@cloudflarebook.com/core/api";
import { Blog, Page } from "@cloudflarebook.com/core/entities";
import { Context } from "../hono_bindings";
import { parseBlogFromDB } from "./utils";

export async function createPage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.env.DB, userId);

  const apiInput = await parseAndValidateApiInput(ctx, CreatePageInputValidator);

  const blogRes = await ctx.env.DB.prepare('SELECT * FROM blogs WHERE id = ?1')
    .bind(apiInput.blog_id)
    .first();
  if (!blogRes) {
    throw new NotFoundError('blog not found');
  }
  const blog: Blog = parseBlogFromDB(blogRes)

  const now = new Date();
  const page: Page = {
    id: uuidv7(),
    created_at: now,
    updated_at: now,
    slug: apiInput.slug,
    type: apiInput.type,
    title: apiInput.title,
    content_html: apiInput.content_html,
    blog_id: blog.id,
  };

  await ctx.env.DB.prepare(`INSERT INTO pages
    (id, created_at, updated_at, slug, type, title, content_html, blog_id)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`)
    .bind(page.id, page.created_at.toISOString(), page.updated_at.toISOString(), page.slug, page.type,
      page.title, page.content_html, page.blog_id)
    .run();

  await ctx.env.DB.prepare(`UPDATE blogs SET updated_at = ?1 WHERE id = ?2`)
  .bind(now.toISOString(), blog.id)
  .run();

  return sendApiResponse(ctx, page);
}
