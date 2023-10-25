import { Context } from "hono";
import { Bindings, Variables } from "../bindings";
import { checkAuth, checkIsAdmin } from "../utils";

export async function updateBlog(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);


  return ctx.json({});
}
