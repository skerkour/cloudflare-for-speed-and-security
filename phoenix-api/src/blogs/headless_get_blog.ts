import { convertToApiResponse } from "@phoenix/core/api";
import { Context } from "../hono_bindings";
import { Blog } from "@phoenix/core/entities";
import { NotFoundError } from "@phoenix/core/errors";

export async function headlessGetBlog(ctx: Context): Promise<Response> {
  const blogDomainInput = ctx.req.query('domain')?.trim() ?? '';
  const blogSlug = blogDomainInput.replace(`.${ctx.env.BLOGS_ROOT_DOMAIN}`, '');

  const blogRes = await ctx.var.db.query('SELECT * FROM blogs WHERE slug = $1', [blogSlug]);
  if (blogRes.rowCount !== 1) {
    throw new NotFoundError('blog not found');
  }
  const blog: Blog = blogRes.rows[0];

  return ctx.json(convertToApiResponse(blog));
}
