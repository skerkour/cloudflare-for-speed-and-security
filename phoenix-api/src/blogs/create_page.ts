import { checkAuth, parseAndValidateApiInput } from "../utils";
import { NotFoundError } from "@phoenix/core/errors";
import { uuidv7 } from "@phoenix/uuidv7";
import { checkIsAdmin } from "../utils";
import { CreatePageInputValidator, convertToApiResponse } from "@phoenix/core/api";
import { Blog, Page } from "@phoenix/core/entities";
import { Context } from "../hono_bindings";

export async function createPage(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.var.db, userId);

  const apiInput = await parseAndValidateApiInput(ctx, CreatePageInputValidator);

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

  await ctx.var.db.query(`INSERT INTO pages
    (id, created_at, updated_at, slug, type, title, content_html, blog_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [page.id, page.created_at, page.updated_at, page.slug, page.type, page.title, page.content_html, page.blog_id],
  );

  return ctx.json(convertToApiResponse(page));
}
