import { Hono } from 'hono';
import { connect, Connection } from '@planetscale/database';

type Bindings = {
  DATABASE_URL: string;
};

type Variables = {
  db: Connection;
};

// CREATE TABLE products(id VARCHAR(6) PRIMARY KEY, serial_number TEXT NOT NULL, name TEXT NOT NULL);
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
  const planetscaleConnection = connect({
    url: c.env.DATABASE_URL,
    fetch: (url, init) => {
      delete (init!)["cache"];
      return fetch(url, init);
    }
  });

  c.set('db', planetscaleConnection);
  await next();
  // c.executionCtx.waitUntil(psConnection.end());
});

app.get('/products', async (c) => {
  // we do a few subrequests
  await c.var.db.execute("SELECT * FROM products");
  await c.var.db.execute("SELECT * FROM products");
  await c.var.db.execute("SELECT * FROM products");
  await c.var.db.execute("SELECT * FROM products");

  const result = await c.var.db.execute("SELECT * FROM products");

  return c.json(result.rows);
});

app.post('/products', async (c) => {
  const newProduct: Product = {
    id: randStr(),
    serial_number: `serial-number-${randStr()}`,
    name: `name-${randStr()}`,
  };
  await c.var.db.execute("INSERT INTO products VALUES(:id, :serial_number, :name)", newProduct);

  return c.json(newProduct);
});


app.delete('/products/:product_id', async (c) => {
  const productId = c.req.param('product_id');
  await c.var.db.execute("DELETE FROM products WHERE id = :id", { id: productId });
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
