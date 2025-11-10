import { z } from "zod";

export const CreateUserSchema = z.object({
    userName: z.string().min(6).max(40),
    email: z.email(),
    password: z.string().min(6).max(24).refine((str) => {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]+$/.test(str);
    }, "Password must contain atleast 1 lowercase, uppercase, number, symbol from !@#$%^&"),
    profilePic: z.string().optional()
});

export const LoginUserSchema = z.object({
    userName: z.string().min(6).max(40),
    password: z.string().min(6).max(24).refine((str) => {
        return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&]+$/.test(str);
    }, "Password must contain atleast 1 lowercase, uppercase, number, symbol from !@#$%^&")
});