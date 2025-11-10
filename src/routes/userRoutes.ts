import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Hono } from "hono";
import { CreateUserSchema } from "#repo/types/userReqSchema.js";
import { z } from "zod";
import { createResponse } from "#repo/types/responseType.js";

const userRoute = new Hono();

userRoute.post('/signup', async (c) => {
  const bodyyy = await c.req.json();
  const parsedBody = CreateUserSchema.safeParse(bodyyy);

  if (parsedBody.error) {
    return createResponse(c, {
      message: "Invalid user input",
      responseType: "error",
      error: z.prettifyError(parsedBody.error)
    }, 400);
  }
  // console.log(data.error?.issues);
  return c.text("ok ok");
});

userRoute.post('/signin', async (c) => {
});

export { userRoute };
