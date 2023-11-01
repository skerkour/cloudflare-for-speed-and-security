import type { FC } from 'hono/jsx';
import { Base } from './base';

export const ErrorTempalte: FC<{ error: string }> = (props: { error: string }) => {
    return (
        <Base>
            <div class="flex flex-col space-y-6">
                <div class="flex">
                    <h2 class="text-3xl font-bold">
                        Error :(
                    </h2>
                </div>

                <div class="flex">
                    { props.error }
                </div>

                <div class="flex text-blue-500">
                    <a href="/">Back To Home</a>
                </div>
            </div>
        </Base>
    );
}
