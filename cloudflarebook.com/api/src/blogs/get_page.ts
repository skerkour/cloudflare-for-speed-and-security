import { Context } from "../hono_bindings";
import { checkAuth, parseAndValidateApiInput, sendApiResponse } from "../utils";
import { NotFoundError } from "@cloudflarebook.com/core/errors";
import { GetPageInputValidator } from "@cloudflarebook.com/core/api";
import { Page, PageValidator } from "@cloudflarebook.com/core/entities";

export async function getPage(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const apiInput = await parseAndValidateApiInput(ctx, GetPageInputValidator);

  const pageRes = await ctx.env.DB.prepare('SELECT * FROM pages WHERE id = ?1')
    .bind(apiInput.page_id)
    .first();
  if (!pageRes) {
    throw new NotFoundError('page not found');
  }
  const page = PageValidator.parse(pageRes);

  return sendApiResponse(ctx, page);
}
