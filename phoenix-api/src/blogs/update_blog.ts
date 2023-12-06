import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "@phoenix/core/errors";
import { UpdateBlogInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { parseBlogFromDB } from "./utils";

export async function updateBlog(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.env.DB, userId);

  const apiInput = await parseAndValidateApiInput(ctx, UpdateBlogInputValidator);

  const blogRes = await ctx.env.DB.prepare('SELECT * FROM blogs WHERE id = ?1')
    .bind(apiInput.blog_id)
    .first();
  if (!blogRes) {
    throw new NotFoundError('blog not found');
  }
  const blog = parseBlogFromDB(blogRes);

  blog.updated_at = new Date();
  blog.slug = apiInput.slug ?? blog.slug;
  blog.name = apiInput.name ?? blog.name;
  blog.navigation = apiInput.navigation ?? blog.navigation;
  blog.description_html = apiInput.description_html ?? blog.description_html;

  await ctx.env.DB.prepare(`UPDATE blogs SET
    updated_at = ?1, slug = ?2, name = ?3, navigation = ?4, description_html = ?5
    WHERE id = ?6`)
    .bind(blog.updated_at.toISOString(), blog.slug, blog.name, JSON.stringify(blog.navigation),
      blog.description_html, blog.id)
    .run();

  return ctx.json(convertToApiResponse(blog));
}
