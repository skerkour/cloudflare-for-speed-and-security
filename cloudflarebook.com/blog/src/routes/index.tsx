import { sha256Sum } from "@cloudflarebook.com/core/crypto";
import { Context } from "../context";
import { getBlog, getPosts } from "../utils";
import { handleCaching } from "../caching";
import { Blog, Page } from '@cloudflarebook.com/core/entities';
import type { FC } from 'hono/jsx';
import { Base } from './_base';
import { date } from '../utils';
import { HtmlEscapedString } from "hono/utils/html";

export async function index(ctx: Context): Promise<Response> {
  // const reqUrl = new URL(ctx.req.url);
  const domain = 'blog.cloudflarebook.com';
  const [blog, posts] = await Promise.all([
    getBlog(ctx, domain),
    getPosts(ctx, domain),
  ]);

  const html = IndexTemplate({ blog, posts }) as HtmlEscapedString;
  const etag = await sha256Sum(html);
  const cacheHit = handleCaching(ctx, 'public, no-cache, must-revalidate', etag);
  if (cacheHit) {
    return cacheHit;
  }

  return ctx.html(html);
}


type IndexTemplateProps = {
  posts: Page[],
  blog: Blog,
}

const IndexTemplate: FC<IndexTemplateProps> = (props: IndexTemplateProps) => {
  return (
      <Base blog={props.blog}>
          {props.posts.map((post) => (
              <article class="flex max-w-xl flex-col items-start justify-between">
                  <a href={post.slug}>
                      <div class="group relative">
                          <h3 class="mt-3 text-lg leading-6 text-gray-900 group-hover:text-gray-600 mb-2">
                              { post.title }
                          </h3>
                          <time datetime="2020-03-16" class="text-gray-500 text-xs font-medium">
                              { date(post.created_at) }
                          </time>
                      </div>
                  </a>
              </article>
          ))}
      </Base>
  );
}
