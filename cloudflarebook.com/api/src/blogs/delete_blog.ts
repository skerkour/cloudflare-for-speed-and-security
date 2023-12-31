import { Context } from "../hono_bindings";
import { checkAuth, checkIsAdmin, parseAndValidateApiInput, sendApiResponse } from "../utils";
import { DeleteBlogInputValidator } from "@cloudflarebook.com/core/api";

export async function deleteBlog(ctx: Context): Promise<Response> {
  const userId = await checkAuth(ctx);
  await checkIsAdmin(ctx.env.DB, userId);

  const apiInput = await parseAndValidateApiInput(ctx, DeleteBlogInputValidator);

  await ctx.env.DB.prepare('DELETE FROM blogs WHERE id = ?1')
    .bind(apiInput.blog_id)
    .run();

  return sendApiResponse(ctx, { ok: true });
}
