import { Context } from "../hono_bindings";
import { NotFoundError } from "@phoenix/core/errors";
import { parseBlogFromDB } from "./utils";
import { sendApiResponse } from "../utils";

export async function headlessGetBlog(ctx: Context): Promise<Response> {
  const blogDomainInput = ctx.req.query('domain')?.trim() ?? '';
  const blogSlug = blogDomainInput.replace(`.${ctx.env.BLOGS_ROOT_DOMAIN}`, '');

  const blogRes = await ctx.env.DB.prepare('SELECT * FROM blogs WHERE slug = ?1')
    .bind(blogSlug)
    .first();
  if (!blogRes) {
    throw new NotFoundError('Blog not found');
  }
  const blog = parseBlogFromDB(blogRes);

  return sendApiResponse(ctx, blog);
}
