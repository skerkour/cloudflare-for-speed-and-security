import type { FC } from 'hono/jsx';


export const Jsx: FC<{ name: string }> = (props: { name: string }) => {
    return (
      <div>
        Hello { props.name }!
      </div>
    );
  }
