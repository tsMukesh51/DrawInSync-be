import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userTable } from '#repo/db/schema.js';
import { db } from '#repo/db/db.js';
import { boardRoute } from '#repo/routes/boardRoutes.js';

const app = new Hono();

app.route("/board", boardRoute);

app.get('/', async (c) => {
  return c.text("Hello Workd");
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
