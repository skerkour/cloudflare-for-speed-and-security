import { convertToApiResponse } from "@phoenix/core/api";
import { Context } from "../hono_bindings";

export async function headlessGetPosts(ctx: Context): Promise<Response> {
  return ctx.json(convertToApiResponse(['hello World']));
}
