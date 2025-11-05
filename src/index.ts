import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { userTable } from '#repo/db/schema.js';
import { db } from '#repo/db/db.js';

const app = new Hono()

app.get('/', async (c) => {
  await db.insert(userTable).values({
    userName: "tsMukesh",
    email: "tsmukesh96@email.com",
    password: "dksldf",
    profilePic: "nothing.com/index.jpg",
    updatedAt: new Date(),
  });

  const users = await db.select().from(userTable);

  return c.text(JSON.stringify(users));
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});
