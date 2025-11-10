import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/node-postgres';
import { userTable } from '#repo/db/schema.js';
import { db } from '#repo/db/db.js';
import { boardRoute } from '#repo/routes/boardRoutes.js';
import { userRoute } from '#repo/routes/userRoutes.js';
import { etag } from 'hono/etag';
import { cors } from 'hono/cors'
// load env vars
import 'dotenv/config';
import { env } from '#repo/env.js';
import { createResponse } from './types/responseType.js';

const app = new Hono();
// app.use(etag);
app.use(cors({
  origin: "https://example.com",
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowHeaders: ['Content-Type', 'Authorization'],
  // credentials: true
}));

app.route("/board", boardRoute);
app.route("/user", userRoute);

app.get('/', (c) => {
  return createResponse(c, { message: "Hello Workd", responseType: "success" }, 200);
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Environments loaded: ${Object.keys(env).length}.\nServer is running on http://localhost:${info.port}`)
});
