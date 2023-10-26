import { Context } from "hono";
import { Bindings, Variables } from "../hono_bindings";
import { checkAuth } from "../utils";
import { Blog } from "@phoenix/core/entities";

export async function getBlogs(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  await checkAuth(ctx);

  const blogsRes = await ctx.var.db.query('SELECT * FROM blogs');
  const blogs: Blog[] = blogsRes.rows;

  return ctx.json(blogs);
}
