import { Context } from "../hono_bindings";
import { checkAuth, parseAndValidateApiInput } from "../utils";
import { GetPagesInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Page, PageValidator } from "@phoenix/core/entities";

export async function getPages(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const apiInput = await parseAndValidateApiInput(ctx, GetPagesInputValidator);

  const pagesRes = await ctx.env.DB.prepare('SELECT * FROM pages WHERE blog_id = ?1 ORDER BY id DESC')
    .bind(apiInput.blog_id)
    .all();
  const pages = pagesRes.results.map((p) => PageValidator.parse(p));

  return ctx.json(convertToApiResponse(pages));
}
