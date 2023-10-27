import { Context } from "../hono_bindings";
import { checkAuth, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "../errors";
import { GetBlogInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Blog } from "@phoenix/core/entities";

export async function getBlog(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const apiInput = await parseAndValidateApiInput(ctx, GetBlogInputValidator);

  const blogsRes = await ctx.var.db.query('SELECT * FROM blogs WHERE id = $1', [apiInput.blog_id]);
  if (blogsRes.rowCount !== 1) {
    throw new NotFoundError('Blog not found');
  }
  const blog: Blog = blogsRes.rows[0];

  return ctx.json(convertToApiResponse(blog));
}
