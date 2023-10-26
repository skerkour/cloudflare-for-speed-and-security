import { Context } from "hono";
import { Bindings, Variables } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput } from "../utils";
import { DeletePageInput } from "@phoenix/core/api";

export async function deletePage(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, DeletePageInput);

  await ctx.var.db.query('DELETE FROM pages WHERE id = $1', [apiInput.page_id]);

  return ctx.json({ ok: true });
}
