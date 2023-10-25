import { Context } from "hono";
import { Bindings, Variables } from "../bindings";
import * as api from "./api";
import { checkAuth, findUserById } from "../users/utils";
import { NotFoundError, PermissionDeniedError } from "../errors";
import { Blog, Page } from "./entities";
import { uuidv7 } from "@phoenix/uuiv7";

export async function createPage(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const userId = await checkAuth(ctx);
  const user = await findUserById(ctx.var.db, userId);
  if (!user.is_admin) {
    throw new PermissionDeniedError();
  }

  const reqBody = await ctx.req.json()
  const apiInput = api.CreatePageInput.parse(reqBody);

  const blogRes = await ctx.var.db.query('SELECT * FROM blogs WHERE id = $1', [apiInput.blog_id]);
  if (blogRes.rowCount !== 1) {
    throw new NotFoundError('blog not found');
  }
  const blog: Blog = blogRes.rows[0];

  const now = new Date();
  const page: Page = {
    id: uuidv7(),
    created_at: now,
    updated_at: now,
    slug: apiInput.slug,
    type: apiInput.type,
    title: apiInput.title,
    content_html: apiInput.content_html,
    blog_id: blog.id,
  };

  await ctx.var.db.query('INSERT INTO pages VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    [page.id, page.created_at, page.updated_at, page.slug, page.type, page.title, page.content_html, page.blog_id],
  );

  return ctx.json(page);
}
