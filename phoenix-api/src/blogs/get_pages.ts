import { Context } from "hono";
import { Bindings, Variables } from "../bindings";

export async function getPages(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  return ctx.json([]);
}
