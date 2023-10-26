import { Context } from "hono";
import { Bindings, Variables } from "../hono_bindings";

export async function headlessGetPosts(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  return ctx.json(['hello World']);
}
