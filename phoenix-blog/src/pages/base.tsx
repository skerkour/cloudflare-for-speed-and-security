import type { FC } from 'hono/jsx';
import { raw } from 'hono/html';

export const Base: FC = (props) => {
    const base = (props: any) => (
        <html>
            <head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="referrer" content="no-referrer-when-downgrade" />

                <meta name="robots" content="noindex" />
                <link href="/theme/index.css" rel="stylesheet" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            </head>
            <body>
                <div class="bg-white py-12">
                    <div class="mx-auto max-w-7xl px-6 lg:px-8">
                        <div class="mx-auto max-w-2xl">
                            <a href="/">
                                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    { props.blog?.name ?? '' }
                                </h2>
                            </a>
                            <p dangerouslySetInnerHTML={{ __html: props.blog?.description_html ?? '' }}
                              class="mt-2 text-lg leading-8 text-gray-600">
                            </p>
                            <div class="mt-10 space-y-8 border-t border-gray-200 pt-10 sm:mt-8 sm:pt-8">
                              {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );

    return raw(`<!DOCTYPE html>${base(props)}`);
}
