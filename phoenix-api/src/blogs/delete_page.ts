import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { DeletePageInputValidator } from "@phoenix/core/api";

export async function deletePage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, DeletePageInputValidator);

  await ctx.var.db.query('DELETE FROM pages WHERE id = $1', [apiInput.page_id]);

  return ctx.json({ ok: true });
}
