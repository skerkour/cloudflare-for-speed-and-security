import { uuidv7 } from "@phoenix/uuiv7";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { CreateBlogInput } from "@phoenix/core/api";
import { Blog } from "@phoenix/core/entities";
import { Context } from "../hono_bindings";

export async function createBlog(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, CreateBlogInput);

  const now = new Date();
  const blog: Blog = {
    id: uuidv7(),
    created_at: now,
    updated_at: now,
    name: apiInput.name,
    slug: apiInput.slug,
    navigation: {},
    description: '',
  };

  await ctx.var.db.query('INSERT INTO blogs VALUES($1, $2, $3, $4, $5, $6, $7)',
    [blog.id, blog.created_at, blog.updated_at, blog.name, blog.slug, blog.navigation, blog.description],
  );

  return ctx.json(blog);
}
