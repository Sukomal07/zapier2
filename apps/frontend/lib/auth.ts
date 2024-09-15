import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { credentialsSchema } from "../types/authTypes";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jon@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "Jon@12" },
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    const { error } = credentialsSchema.safeParse(credentials);
                    if (error) {
                        throw new Error(error.message);
                    }

                    const user = await db.user.findFirst({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user) {
                        throw new Error("User does not exist");
                    }

                    if (!user.verified) {
                        throw new Error(`${credentials.email} is not verified. Please verify first.`);

                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isValidPassword) {
                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }
                } catch (error: any) {
                    throw new Error(error.message);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.verified = user.verified;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.verified = token.verified;
            }
            return session;
        },
    },
    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: "jwt",
    },
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secret: process.env.NEXTAUTH_SECRET,
};