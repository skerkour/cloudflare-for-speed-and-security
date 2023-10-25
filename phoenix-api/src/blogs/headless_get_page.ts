import { Context } from "hono";
import { Bindings, Variables } from "../bindings";

export async function headlessGetPage(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const pageSlug = ctx.req.query('slug');
  return ctx.json({ title: 'Hello World', content_html: `<h1>Hello World!</h1> from ${pageSlug}` });
}
