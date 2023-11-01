import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "@phoenix/core/errors";
import { UpdateBlogInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Blog } from "@phoenix/core/entities";

export async function updateBlog(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, UpdateBlogInputValidator);

  const blogRes = await ctx.var.db.query('SELECT * FROM blogs WHERE id = $1', [apiInput.blog_id]);
  if (blogRes.rowCount !== 1) {
    throw new NotFoundError('blog not found');
  }
  const blog: Blog = blogRes.rows[0];

  blog.updated_at = new Date();
  blog.slug = apiInput.slug ?? blog.slug;
  blog.name = apiInput.name ?? blog.name;
  blog.navigation = apiInput.navigation ?? blog.navigation;
  blog.description_html = apiInput.description_html ?? blog.description_html;

  await ctx.var.db.query(`UPDATE blogs SET
    updated_at = $1, slug = $2, name = $3, navigation = $4, description_html = $5
    WHERE id = $6`,
    [blog.updated_at, blog.slug, blog.name, blog.navigation, blog.description_html, blog.id],
  );

  return ctx.json(convertToApiResponse(blog));
}
