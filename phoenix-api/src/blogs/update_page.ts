import { Context } from "hono";
import { Bindings, Variables } from "../bindings";
import { checkAuth, findUserById } from "../users/utils";
import { PermissionDeniedError } from "../errors";

export async function updatePage(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const userId = await checkAuth(ctx);
  const user = await findUserById(ctx.var.db, userId);
  if (!user.is_admin) {
    throw new PermissionDeniedError();
  }

  return ctx.json({});
}
