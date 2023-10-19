# workers_hono_noeon

## Dev

```bash
$ npm install
$ npm run dev
```

## Deploy


First, you need to create a [Neon](https://neon.tech) database and create a table as indicated in `index.ts` (`CREATE TABLE ...`).

Then deploy your Worker:

```bash
$ npm run deploy
```

Finally, set your Neon `DATABASE_URL` as a secret of your newly created Worker.
