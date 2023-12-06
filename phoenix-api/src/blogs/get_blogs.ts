import { Context } from "../hono_bindings";
import { checkAuth, sendApiResponse } from "../utils";
import { parseBlogFromDB } from "./utils";

export async function getBlogs(ctx: Context): Promise<Response> {
  await checkAuth(ctx);

  const blogsRes = (await ctx.env.DB.prepare('SELECT * FROM blogs ORDER BY id DESC').all()).results;
  const blogs = blogsRes.map(parseBlogFromDB);

  return sendApiResponse(ctx, blogs);
}
