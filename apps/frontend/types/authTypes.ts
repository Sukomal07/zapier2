import { z } from "zod";

const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;

export const credentialsSchema = z.object({
    email: z
        .string()
        .email("Please enter valid email"),
    password: z
        .string()
        .min(1, "Password must be at least 1 character")
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 character"),
    email: z
        .string()
        .email("Please enter valid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 character")
        .regex(
            passwordRegex,
            "Password must be contains at least one uppercase and one lowercase and one digit and one special character"
        ),
})

export type TSignInSchema = z.infer<typeof credentialsSchema>;
export type TSignUpSchema = z.infer<typeof signupSchema>;
