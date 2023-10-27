import { convertToApiResponse } from "@phoenix/core/api";
import { Context } from "../hono_bindings";

export async function headlessGetPage(ctx: Context): Promise<Response> {
  const pageSlug = ctx.req.query('slug');
  return ctx.json(convertToApiResponse({ title: 'Hello World', content_html: `<h1>Hello World!</h1> from ${pageSlug}` }));
}
