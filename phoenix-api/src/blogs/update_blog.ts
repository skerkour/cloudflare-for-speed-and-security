import { Context } from "hono";
import { Bindings, Variables } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "../errors";
import { UpdateBlogInput } from "@phoenix/core/api";
import { Blog } from "@phoenix/core/entities";

export async function updateBlog(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, UpdateBlogInput);

  const blogRes = await ctx.var.db.query('SELECT * FROM blogs WHERE id = $1', [apiInput.blog_id]);
  if (blogRes.rowCount !== 1) {
    throw new NotFoundError('blog not found');
  }
  const blog: Blog = blogRes.rows[0];

  blog.updated_at = new Date();
  blog.slug = apiInput.slug ?? blog.slug;
  blog.name = apiInput.name ?? blog.name;
  blog.navigation = apiInput.navigation ?? blog.navigation;
  blog.description = apiInput.description ?? blog.description;

  await ctx.var.db.query(`UPDATE blogs SET
    updated_at = $1, slug = $2, name = $3, navigation = $4, description = $5
    WHERE id = $6`,
    [blog.updated_at, blog.slug, blog.name, blog.navigation, blog.description, blog.id],
  );

  return ctx.json(blog);
}
