import { sha256Sum } from "@phoenix/core/crypto";
import { Context } from "../context";
import { getBlog, getPage, maxTime } from "../utils";
import templatesHash from './templates_sha256.txt';
import { handleCaching } from "../caching";
import { Blog, Page } from "@phoenix/core/entities";
import { FC } from "hono/jsx";
import { Base } from "./_base";

export async function page(ctx: Context): Promise<Response> {
  const reqUrl = new URL(ctx.req.url);

  const domain = 'blog.cloudflarebook.net';
  const [blog, page] = await Promise.all([
    getBlog(ctx, domain),
    getPage(ctx, domain, reqUrl.pathname),
  ]);

  const updatedAt = maxTime(blog.updated_at, page.updated_at);
  const etag = await sha256Sum(`${templatesHash}|${updatedAt.toISOString()}`)
  const cacheHit = handleCaching(ctx, 'public, max-age=60, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  const html = PageTemplate({ blog, page });

  return ctx.html(html);
}

type PageTemplateProps = {
  blog: Blog,
  page: Page,
}

const PageTemplate: FC<PageTemplateProps> = (props: PageTemplateProps) => {
  return (
      <Base blog={props.blog} title={props.page.title}>
          <div class="flex flex-col">
              <div class="flex">
                  <h2 class="text-3xl font-bold">
                      { props.page.title }
                  </h2>
              </div>

              <div class="flex mt-10">
                  <div dangerouslySetInnerHTML={{ __html: props.page.content_html}} class="prose prose-sm w-full h-full max-w-none">
                  </div>
              </div>
          </div>
      </Base>
  );
}
