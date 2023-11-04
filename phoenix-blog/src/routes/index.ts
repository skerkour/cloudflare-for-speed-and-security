import { sha256Sum } from "@phoenix/core/crypto";
import { Context } from "../context";
import { PostsTemplate } from "../templates_tsx/posts";
import { getBlog, getPosts } from "../utils";
import { handleCaching } from "../caching";

export async function index(ctx: Context): Promise<Response> {
  // const reqUrl = new URL(ctx.req.url);
  const domain = 'blog.cloudflarebook.net';
  const [blog, posts] = await Promise.all([
    getBlog(ctx, domain),
    getPosts(ctx, domain),
  ]);

  const html = PostsTemplate({ blog, posts });
  const etag = await sha256Sum(html);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.html(html);
}
