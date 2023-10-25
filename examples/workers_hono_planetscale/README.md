# workers_hono_planetscale

## Dev

```bash
$ npm install
$ npm run dev
```

## Deploy


First, you need to create a [PlanetScale](https://planetscale.com) database and create a table as indicated in `index.ts` (`CREATE TABLE ...`).

Then deploy your Worker:

```bash
$ npm run deploy
```

Finally, set your PlanetScale `DATABASE_URL` as a secret of your newly created Worker.
