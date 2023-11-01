import { Blog, Page } from '@phoenix/core/entities';
import type { FC } from 'hono/jsx';
import { Base } from './base';
import { date } from '../utils';

export const PostsTemplate: FC<{ posts: Page[], blog: Blog }> = (props: { posts: Page[], blog: Blog }) => {
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
