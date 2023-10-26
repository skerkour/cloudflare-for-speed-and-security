import { Context } from "../hono_bindings";

export async function headlessGetPosts(ctx: Context): Promise<Response> {
  return ctx.json(['hello World']);
}
