import { Blog, Page } from '@phoenix/core/entities';
import type { FC } from 'hono/jsx';
import { Base } from './base';

type Props = {
    blog: Blog,
    page: Page,
}

export const PageTemplate: FC<Props> = (props: Props) => {
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
