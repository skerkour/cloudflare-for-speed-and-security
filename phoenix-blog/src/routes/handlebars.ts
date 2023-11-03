import { sha256Sum } from "@phoenix/core/crypto";
import { Context } from "../context";
import { handleCaching } from "../utils";


export async function handlebars(ctx: Context): Promise<Response> {
  const name = ctx.req.query('name') ?? 'Handlebars'

  const html = Handlebars.templates['handlebars']({ name });

  const etag = await sha256Sum(html);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.html(html);
}
