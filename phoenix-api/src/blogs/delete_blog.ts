import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { DeleteBlogInputValidator, convertToApiResponse } from "@phoenix/core/api";

export async function deleteBlog(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, DeleteBlogInputValidator);

  await ctx.var.db.query('DELETE FROM blogs WHERE id = $1', [apiInput.blog_id]);

  return ctx.json(convertToApiResponse({ ok: true }));
}
