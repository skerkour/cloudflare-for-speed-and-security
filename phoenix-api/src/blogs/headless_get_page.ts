import { convertToApiResponse } from "@phoenix/core/api";
import { Context } from "../hono_bindings";
import { NotFoundError } from "@phoenix/core/errors";
import { Page } from "@phoenix/core/entities";

export async function headlessGetPage(ctx: Context): Promise<Response> {
  const pageSlug = ctx.req.query('slug')?.trim() ?? '';
  const blogDomainInput = ctx.req.query('domain')?.trim() ?? '';
  const blogSlug = blogDomainInput.replace(`.${ctx.env.BLOGS_ROOT_DOMAIN}`, '');

  const pageRes = await ctx.var.db.query(`SELECT pages.* FROM pages
    INNER JOIN blogs ON pages.blog_id = blogs.id
    WHERE blogs.slug = $1 AND pages.slug = $2
  `,
      [blogSlug, pageSlug],
    );
  if (pageRes.rowCount !== 1) {
    throw new NotFoundError('page not found');
  }
  const page: Page = pageRes.rows[0];


  return ctx.json(convertToApiResponse(page));
}
