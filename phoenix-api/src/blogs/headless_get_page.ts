import { Context } from "../hono_bindings";
import { NotFoundError } from "@phoenix/core/errors";
import { PageValidator } from "@phoenix/core/entities";
import { sendApiResponse } from "../utils";

export async function headlessGetPage(ctx: Context): Promise<Response> {
  const pageSlug = ctx.req.query('slug')?.trim() ?? '';
  const blogDomainInput = ctx.req.query('domain')?.trim() ?? '';
  const blogSlug = blogDomainInput.replace(`.${ctx.env.BLOGS_ROOT_DOMAIN}`, '');

  const pageRes = await ctx.env.DB.prepare(`SELECT pages.* FROM pages
    INNER JOIN blogs ON pages.blog_id = blogs.id
    WHERE blogs.slug = ?1 AND pages.slug = ?2
  `)
    .bind(blogSlug, pageSlug)
    .first();
  if (!pageRes) {
    throw new NotFoundError('page not found');
  }
  const page = PageValidator.parse(pageRes);

  return sendApiResponse(ctx, page);
}
