import { NotFoundError } from "@phoenix/core/errors";
import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput, sendApiResponse } from "../utils";
import { DeletePageInputValidator } from "@phoenix/core/api";
import { Page, PageValidator } from "@phoenix/core/entities";

export async function deletePage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.env.DB, userId);

  const apiInput = await parseAndValidateApiInput(ctx, DeletePageInputValidator);

  const pageRes = await ctx.env.DB.prepare('SELECT * FROM pages WHERE id = ?1')
    .bind(apiInput.page_id)
    .first();
  if (!pageRes) {
    throw new NotFoundError('page not found');
  }
  const page = PageValidator.parse(pageRes);
  const now = new Date();

  await ctx.env.DB.prepare('DELETE FROM pages WHERE id = ?1')
    .bind(apiInput.page_id)
    .run();

  return sendApiResponse(ctx, { ok: true });
}
