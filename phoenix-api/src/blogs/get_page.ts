import { Context } from "../hono_bindings";
import { checkAuth, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "@phoenix/core/errors";
import { GetPageInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Page } from "@phoenix/core/entities";

export async function getPage(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const apiInput = await parseAndValidateApiInput(ctx, GetPageInputValidator);

  const pageRes = await ctx.var.db.query('SELECT * FROM pages WHERE id = $1', [apiInput.page_id]);
  if (pageRes.rowCount !== 1) {
    throw new NotFoundError('page not found');
  }
  const page: Page = pageRes.rows[0];

  return ctx.json(convertToApiResponse(page));
}
