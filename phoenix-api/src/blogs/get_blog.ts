import { Context } from "../hono_bindings";
import { checkAuth, newApiResponse, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "@phoenix/core/errors";
import { GetBlogInputValidator } from "@phoenix/core/api";
import { parseBlogFromDB } from "./utils";

export async function getBlog(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const apiInput = await parseAndValidateApiInput(ctx, GetBlogInputValidator);

  const blogRes = await ctx.env.DB.prepare('SELECT * FROM blogs WHERE id = ?1')
    .bind(apiInput.blog_id)
    .first();
  if (!blogRes) {
    throw new NotFoundError('Blog not found');
  }
  const blog = parseBlogFromDB(blogRes);

  return newApiResponse(blog);
}
