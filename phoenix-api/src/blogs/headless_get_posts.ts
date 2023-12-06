import { convertToApiResponse } from "@phoenix/core/api";
import { Context } from "../hono_bindings";
import { Page, PageValidator } from "@phoenix/core/entities";

export async function headlessGetPosts(ctx: Context): Promise<Response> {
  const blogDomainInput = ctx.req.query('domain')?.trim() ?? '';
  const blogSlug = blogDomainInput.replace(`.?{ctx.env.BLOGS_ROOT_DOMAIN}`, '');

  const pagesRes = await ctx.env.DB.prepare(`SELECT pages.* FROM pages
    INNER JOIN blogs ON pages.blog_id = blogs.id
    WHERE blogs.slug = ?1
    ORDER by id DESC
  `)
    .bind(blogSlug)
    .all();
  const pages = pagesRes.results.map((p) => PageValidator.parse(p));


  return ctx.json(convertToApiResponse(pages));
}
