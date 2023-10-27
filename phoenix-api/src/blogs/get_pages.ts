import { Context } from "../hono_bindings";
import { checkAuth, parseAndValidateApiInput } from "../utils";
import { GetPagesInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Page } from "@phoenix/core/entities";

export async function getPages(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const apiInput = await parseAndValidateApiInput(ctx, GetPagesInputValidator);

  const pagesRes = await ctx.var.db.query('SELECT * FROM pages WHERE blog_id = $1', [apiInput.blog_id]);
  const pages: Page[] = pagesRes.rows;

  return ctx.json(convertToApiResponse(pages));
}
