import type { FC } from 'hono/jsx';

const Base: FC = (props) => {
  return (
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
                        <p class="mt-2 text-lg leading-8">
                        <div class="flex text-blue-500">
                            <a href="/">Back To Home</a>
                        </div>
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
}


export const JsxPage: FC<{ name: string }> = (props: { name: string }) => {
    return (
      <Base>
        <div>
          Hello { props.name } :)
        </div>
      </Base>
    );
  }
