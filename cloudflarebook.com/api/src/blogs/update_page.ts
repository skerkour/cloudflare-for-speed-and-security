import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput, sendApiResponse } from "../utils";
import { NotFoundError } from "@cloudflarebook.com/core/errors";
import { UpdatePageInputValidator } from "@cloudflarebook.com/core/api";
import { PageValidator } from "@cloudflarebook.com/core/entities";

export async function updatePage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.env.DB, userId);

  const apiInput = await parseAndValidateApiInput(ctx, UpdatePageInputValidator);

  const pageRes = await ctx.env.DB.prepare('SELECT * FROM pages WHERE id = ?1')
    .bind(apiInput.page_id)
    .first();
  if (!pageRes) {
    throw new NotFoundError('page not found');
  }
  const page = PageValidator.parse(pageRes);

  const now = new Date();
  page.updated_at = now;
  page.slug = apiInput.slug ?? page.slug;
  page.title = apiInput.title ?? page.title;
  page.content_html = apiInput.content_html ?? page.content_html;

  await ctx.env.DB.prepare(`UPDATE pages SET
    updated_at = ?1, slug = ?2, title = ?3, content_html = ?4
    WHERE id = ?5`)
    .bind(page.updated_at.toISOString(), page.slug, page.title, page.content_html, page.id)
    .run();

  return sendApiResponse(ctx, page);
}
