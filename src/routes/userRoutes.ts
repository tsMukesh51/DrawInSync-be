import { CreateUserSchema, LoginUserSchema } from "@repo/lib/types";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Hono } from "hono";

const userRoute = new Hono();

userRoute.post('/signup', async (c) => {
});

userRoute.post('/signin', async (c) => {
});

export { userRoute };
