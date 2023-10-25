import { Hono } from 'hono';
import { Pool, neonConfig } from '@neondatabase/serverless';

type Bindings = {
  DATABASE_URL: string;
};

type Variables = {
  db: Pool;
};

// CREATE TABLE products( id TEXT PRIMARY KEY, serial_number TEXT NOT NULL, name TEXT NOT NULL);
type Product = {
  id: string;
  serial_number: string;
  name: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Note: due to the use of Math.random(), this function is not secure and is used only for demonstration purpose
function randStr(): string {
  return (Math.random() + 1).toString(36).substring(2).slice(0, 6);
}

app.use('*', async (c, next) => {
  // we use the pool.fetch connection method. See chapter 6 for the "why"
  neonConfig.poolQueryViaFetch = true;
  neonConfig.fetchConnectionCache = true;

  const pgClient = new Pool({ connectionString: c.env.DATABASE_URL });

  c.set('db', pgClient);
  await next();
});

app.get('/products', async (c) => {
  // we do a few subrequests
  await c.var.db.query("SELECT * FROM products");
  await c.var.db.query("SELECT * FROM products");
  await c.var.db.query("SELECT * FROM products");
  await c.var.db.query("SELECT * FROM products");

  const result = await c.var.db.query("SELECT * FROM products");

  return c.json(result.rows);
});

app.post('/products', async (c) => {
  const newProduct: Product = {
    id: randStr(),
    serial_number: `serial-number-${randStr()}`,
    name: `name-${randStr()}`,
  };
  await c.var.db.query(
    "INSERT INTO products VALUES($1, $2, $3)",
    [newProduct.id, newProduct.serial_number, newProduct.name],
  );

  return c.json(newProduct);
});

app.delete('/products/:productId', async (c) => {
  const productId = c.req.param('productId');
  await c.var.db.query("DELETE FROM products WHERE id = $1", [productId]);
  return c.json({ message: 'ok' });
});


app.onError((e, c) => {
  console.error(e);
  return c.text('Internal Server Error', 500);
});


app.get('/', (c) => {
  return c.json({ message: 'Hello World!' });
});

export default app;
