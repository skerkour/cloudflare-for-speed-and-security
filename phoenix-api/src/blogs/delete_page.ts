import { NotFoundError } from "@phoenix/core/errors";
import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { DeletePageInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Page } from "@phoenix/core/entities";

export async function deletePage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, DeletePageInputValidator);

  const pageRes = await ctx.var.db.query('SELECT * FROM pages WHERE id = $1', [apiInput.page_id]);
  if (pageRes.rowCount !== 1) {
    throw new NotFoundError('page not found');
  }
  const page: Page = pageRes.rows[0];
  const now = new Date();

  await ctx.var.db.query('DELETE FROM pages WHERE id = $1', [apiInput.page_id]);
  await ctx.var.db.query(`UPDATE blogs SET updated_at = $1 WHERE id = $2`, [now, page.blog_id]);

  return ctx.json(convertToApiResponse({ ok: true }));
}
