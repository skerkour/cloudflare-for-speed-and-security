import { Context } from "hono";
import { Bindings, Variables } from "../bindings";
import * as api from "./api";
import { Blog } from "./entities";
import { uuidv7 } from "@phoenix/uuiv7/src";
import { checkAuth } from "../users/utils";

export async function createBlog(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const userId = await checkAuth(ctx);

  const reqBody = await ctx.req.json();
  const apiInput = api.CreateBlogInput.parse(reqBody);

  const now = new Date();
  const blog: Blog = {
    id: uuidv7(),
    created_at: now,
    updated_at: now,
    name: apiInput.name,
    slug: apiInput.slug,
    navigation: {},
    description: '',
    user_id: userId,
  };

  await ctx.var.db.query('INSERT INTO blogs VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    [blog.id, blog.created_at, blog.updated_at, blog.name, blog.slug, blog.navigation, blog.description, blog.user_id],
  );

  return ctx.json(blog);
}
